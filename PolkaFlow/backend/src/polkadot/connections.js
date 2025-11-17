// Polkadot Connection Logic - Based on ex1-connection.js
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/westend2";
import { start } from "polkadot-api/smoldot";

/**
 * Real Polkadot connection logic - isolated from Express
 * Based on our successful ex1-connection.js experiment
 */
export class PolkadotConnector {
  constructor() {
    this.connections = new Map();
    this.smoldot = null;
  }

  /**
   * Initialize Smoldot (only once)
   */
  async initializeSmoldot() {
    if (!this.smoldot) {
      console.log('🔧 Initializing Smoldot...');
      this.smoldot = start();
    }
    return this.smoldot;
  }

  /**
   * Test connection to Westend2 (like ex1)
   */
  async testWestendConnection() {
    const startTime = Date.now();
    
    try {
      console.log('🔗 Testing Westend2 connection...');
      
      // Initialize Smoldot if needed
      const smoldot = await this.initializeSmoldot();
      
      // Create provider and client (like ex1)
      const provider = getSmProvider(smoldot.addChain({ chainSpec }));
      const client = createClient(provider);
      
      // Test the connection by getting chain info
      const chainInfo = await Promise.race([
        client.getChainSpecData(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);
      
      const connectionTime = Date.now() - startTime;
      
      // Store connection for reuse
      this.connections.set('westend2', { client, provider, chainInfo });
      
      console.log('✅ Westend2 connected successfully');
      console.log(`📊 Chain: ${chainInfo.name}`);
      console.log(`⚡ Connection time: ${connectionTime}ms`);
      
      return {
        success: true,
        chainId: 'westend2',
        name: chainInfo.name,
        connectionTime,
        blockHeight: null, // We can add this later if needed
        health: this.calculateHealth(connectionTime),
        timestamp: new Date()
      };
      
    } catch (error) {
      const connectionTime = Date.now() - startTime;
      
      console.log('❌ Westend2 connection failed:', error.message);
      
      return {
        success: false,
        chainId: 'westend2', 
        error: error.message,
        connectionTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get existing connection or null
   */
  getConnection(chainId) {
    return this.connections.get(chainId) || null;
  }

  /**
   * Calculate health score based on connection time
   */
  calculateHealth(connectionTime) {
    if (connectionTime < 1000) return 95;
    if (connectionTime < 2000) return 85;
    if (connectionTime < 3000) return 75;
    if (connectionTime < 5000) return 65;
    return 50;
  }

  /**
   * Cleanup connections
   */
  async cleanup() {
    console.log('🧹 Cleaning up Polkadot connections...');
    
    // Close all connections
    for (const [chainId, connection] of this.connections) {
      try {
        if (connection.provider && connection.provider.disconnect) {
          await connection.provider.disconnect();
        }
      } catch (error) {
        console.log(`⚠️ Error closing ${chainId}:`, error.message);
      }
    }
    
    this.connections.clear();
    
    // Terminate Smoldot
    if (this.smoldot) {
      this.smoldot.terminate();
      this.smoldot = null;
    }
  }
}

// Singleton instance for the backend
export const polkadotConnector = new PolkadotConnector();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down Polkadot connections...');
  await polkadotConnector.cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Terminating Polkadot connections...');
  await polkadotConnector.cleanup();
  process.exit(0);
});