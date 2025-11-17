import { CHAIN_CONFIG } from '../config/chains.js';

class ChainConnectionService {
  constructor() {
    this.connections = new Map();
    this.connectionStatus = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.connectionTimeout = 10000; // 10 seconds
  }

  /**
   * Get current connection status for all chains
   * Returns health scores like we saw in ex7 (50-90% range)
   */
  getConnectionStatus() {
    const status = {};
    
    for (const [chainId, config] of Object.entries(CHAIN_CONFIG)) {
      const connectionInfo = this.connectionStatus.get(chainId);
      
      status[chainId] = {
        name: config.name,
        icon: config.icon,
        type: config.type,
        connected: connectionInfo?.connected || false,
        health: connectionInfo?.health || 0,
        lastConnected: connectionInfo?.lastConnected || null,
        endpoint: connectionInfo?.activeEndpoint || config.endpoints[0],
        retryCount: this.retryAttempts.get(chainId) || 0
      };
    }
    
    return status;
  }

  /**
   * Test connection to a specific chain
   * Simulates the multi-chain connection patterns from our experiments
   */
  async testChainConnection(chainId) {
    const config = CHAIN_CONFIG[chainId];
    if (!config) {
      throw new Error(`Unknown chain: ${chainId}`);
    }

    console.log(`🔗 Testing connection to ${config.name}...`);
    
    // For now, simulate connection test with realistic timing
    // In real implementation, this will use PAPI to connect
    const startTime = Date.now();
    
    try {
      // Simulate network delay and occasional failures
      await this.simulateConnection(config);
      
      const connectionTime = Date.now() - startTime;
      const health = this.calculateHealthScore(connectionTime);
      
      // Store connection status
      this.connectionStatus.set(chainId, {
        connected: true,
        health: health,
        lastConnected: new Date(),
        activeEndpoint: config.endpoints[0],
        connectionTime: connectionTime
      });

      // Reset retry counter on success
      this.retryAttempts.set(chainId, 0);

      console.log(`✅ ${config.name} connected - Health: ${health}%`);
      
      return {
        success: true,
        chainId,
        name: config.name,
        health,
        connectionTime,
        endpoint: config.endpoints[0]
      };
      
    } catch (error) {
      console.log(`❌ ${config.name} connection failed: ${error.message}`);
      
      // Increment retry counter
      const retries = (this.retryAttempts.get(chainId) || 0) + 1;
      this.retryAttempts.set(chainId, retries);
      
      // Mark as disconnected
      this.connectionStatus.set(chainId, {
        connected: false,
        health: 0,
        lastConnected: null,
        activeEndpoint: null,
        error: error.message
      });
      
      return {
        success: false,
        chainId,
        name: config.name,
        error: error.message,
        retryCount: retries,
        canRetry: retries < this.maxRetries
      };
    }
  }

  /**
   * Test all chain connections
   * Returns summary similar to ex7 network health monitoring
   */
  async testAllConnections() {
    console.log('🌐 Testing all chain connections...');
    
    const results = [];
    const chainIds = Object.keys(CHAIN_CONFIG);
    
    // Test connections sequentially to avoid overwhelming the network
    for (const chainId of chainIds) {
      const result = await this.testChainConnection(chainId);
      results.push(result);
      
      // Small delay between connections
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Calculate overall network health
    const connectedChains = results.filter(r => r.success);
    const totalHealth = connectedChains.reduce((sum, r) => sum + (r.health || 0), 0);
    const avgHealth = connectedChains.length > 0 ? Math.round(totalHealth / connectedChains.length) : 0;
    
    const summary = {
      timestamp: new Date(),
      totalChains: results.length,
      connectedChains: connectedChains.length,
      failedChains: results.length - connectedChains.length,
      averageHealth: avgHealth,
      results: results
    };
    
    console.log(`📊 Network Health Summary:`);
    console.log(`   Connected: ${summary.connectedChains}/${summary.totalChains}`);
    console.log(`   Average Health: ${summary.averageHealth}%`);
    
    return summary;
  }

  /**
   * Simulate chain connection for testing
   * Will be replaced with actual PAPI connection logic
   */
  async simulateConnection(config) {
    return new Promise((resolve, reject) => {
      // Simulate various connection scenarios
      const delay = 200 + Math.random() * 1000; // 200ms - 1.2s
      
      setTimeout(() => {
        // Simulate occasional failures (10% chance)
        if (Math.random() < 0.1) {
          reject(new Error('Connection timeout'));
          return;
        }
        
        // Simulate different chain types having different connection patterns
        if (config.type === 'relay' && Math.random() < 0.05) {
          reject(new Error('Relay chain under maintenance'));
          return;
        }
        
        resolve();
      }, delay);
    });
  }

  /**
   * Calculate health score based on connection time and chain type
   * Mimics the 50-90% health scores we observed in ex7
   */
  calculateHealthScore(connectionTime) {
    let baseHealth = 100;
    
    // Penalize slow connections
    if (connectionTime > 800) {
      baseHealth -= 30;
    } else if (connectionTime > 500) {
      baseHealth -= 15;
    } else if (connectionTime > 300) {
      baseHealth -= 5;
    }
    
    // Add some randomness to simulate real network conditions
    const variation = -10 + Math.random() * 20; // ±10%
    baseHealth += variation;
    
    // Ensure health is within realistic bounds (50-95%)
    return Math.max(50, Math.min(95, Math.round(baseHealth)));
  }

  /**
   * Get connection info for a specific chain
   */
  getChainInfo(chainId) {
    const config = CHAIN_CONFIG[chainId];
    const status = this.connectionStatus.get(chainId);
    
    if (!config) {
      return null;
    }
    
    return {
      ...config,
      status: status || { connected: false, health: 0 }
    };
  }

  /**
   * Reset all connections (useful for testing)
   */
  reset() {
    this.connections.clear();
    this.connectionStatus.clear();
    this.retryAttempts.clear();
    console.log('🔄 Chain connection service reset');
  }
}

export default ChainConnectionService;