// Multi-Chain Portfolio Orchestrator
import { westend2Service } from './westend2.js';
import { assetHubService } from './assetHub.js';

/**
 * Multi-Chain Portfolio Service
 * Orchestrates portfolio queries across multiple chains
 */
export class MultiChainPortfolio {
  constructor() {
    this.chains = {
      westend2: westend2Service,
      westend2_asset_hub: assetHubService
      // Bridge Hub and People Chain can be added later
    };
  }

  /**
   * Analyze portfolio across all chains - PARALLEL like experiments
   * Main endpoint for frontend
   */
  async analyzeMultiChainPortfolio(address) {
    console.log(`🌐 Multi-chain analysis for ${address.slice(0, 8)}...`);
    
    const startTime = Date.now();
    
    // Create all queries in parallel with timeout (like experiments)
    const chainPromises = Object.entries(this.chains).map(async ([chainId, service]) => {
      try {
        // Add timeout to prevent hanging
        const result = await Promise.race([
          service.getAccountPortfolio(address),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Chain query timeout (15s)')), 15000)
          )
        ]);
        return result;
      } catch (error) {
        console.log(`❌ ${chainId} query failed:`, error.message);
        return {
          success: false,
          chainId,
          address,
          error: error.message,
          timestamp: new Date()
        };
      }
    });
    
    // Wait for all chains to complete (or timeout)
    console.log(`⚡ Querying ${chainPromises.length} chains in parallel...`);
    const results = await Promise.allSettled(chainPromises);
    
    // Process results
    const processedResults = [];
    let totalBalance = 0n;
    let successfulChains = 0;
    
    results.forEach((result, index) => {
      const chainId = Object.keys(this.chains)[index];
      
      if (result.status === 'fulfilled') {
        const chainResult = result.value;
        processedResults.push(chainResult);
        
        if (chainResult.success) {
          successfulChains++;
          totalBalance += BigInt(chainResult.portfolio.totalBalance);
        }
      } else {
        console.log(`❌ ${chainId} promise failed:`, result.reason?.message);
        processedResults.push({
          success: false,
          chainId,
          address,
          error: result.reason?.message || 'Promise rejected',
          timestamp: new Date()
        });
      }
    });
    
    const analysisTime = Date.now() - startTime;
    
    // Calculate summary
    const summary = {
      address,
      totalChains: Object.keys(this.chains).length,
      successfulChains,
      failedChains: Object.keys(this.chains).length - successfulChains,
      totalBalance: totalBalance.toString(),
      totalBalanceFormatted: this.formatBalance(totalBalance.toString()),
      analysisTime,
      timestamp: new Date()
    };
    
    console.log(`✅ Parallel analysis completed in ${analysisTime}ms: ${summary.totalBalanceFormatted} WND across ${successfulChains}/${summary.totalChains} chains`);
    
    return {
      success: successfulChains > 0,
      summary,
      chains: processedResults
    };
  }

  /**
   * Analyze portfolio on specific chain
   */
  async analyzeChainPortfolio(address, chainId) {
    const service = this.chains[chainId];
    
    if (!service) {
      return {
        success: false,
        error: `Chain '${chainId}' not supported`,
        supportedChains: Object.keys(this.chains)
      };
    }
    
    return await service.getAccountPortfolio(address);
  }

  /**
   * Test connections to all chains
   */
  async testAllConnections() {
    console.log('🔗 Testing all chain connections...');
    
    const results = [];
    
    for (const [chainId, service] of Object.entries(this.chains)) {
      const result = await service.testConnection();
      results.push({
        chainId,
        ...result
      });
    }
    
    const connectedChains = results.filter(r => r.success).length;
    const avgHealth = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + (r.health || 0), 0) / connectedChains || 0;
    
    return {
      success: connectedChains > 0,
      totalChains: results.length,
      connectedChains,
      averageHealth: Math.round(avgHealth),
      results,
      timestamp: new Date()
    };
  }

  /**
   * Get supported chains list
   */
  getSupportedChains() {
    return Object.keys(this.chains).map(chainId => ({
      chainId,
      name: this.getChainDisplayName(chainId),
      type: this.getChainType(chainId)
    }));
  }

  /**
   * Get chain display name
   */
  getChainDisplayName(chainId) {
    const names = {
      westend2: 'Westend Relay',
      westend2_asset_hub: 'Asset Hub',
      westend2_bridge_hub: 'Bridge Hub',
      westend2_people: 'People Chain'
    };
    return names[chainId] || chainId;
  }

  /**
   * Get chain type
   */
  getChainType(chainId) {
    if (chainId === 'westend2') return 'relay';
    return 'system_parachain';
  }

  /**
   * Format balance for display
   */
  formatBalance(balance, decimals = 12) {
    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(10 ** decimals);
    
    const wholePart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');
    
    if (trimmedFractional) {
      return `${wholePart}.${trimmedFractional}`;
    }
    
    return wholePart.toString();
  }

  /**
   * Validate address format
   */
  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      return { valid: false, error: 'Address is required and must be a string' };
    }
    
    if (address.length < 40 || address.length > 60) {
      return { valid: false, error: 'Invalid address length' };
    }
    
    if (!address.startsWith('5')) {
      return { valid: false, error: 'Address must start with 5 for Westend format' };
    }
    
    return { valid: true };
  }

  /**
   * Cleanup all connections
   */
  async cleanup() {
    console.log('🧹 Cleaning up all chain connections...');
    
    for (const [chainId, service] of Object.entries(this.chains)) {
      try {
        await service.disconnect();
      } catch (error) {
        console.log(`⚠️ Error cleaning up ${chainId}:`, error.message);
      }
    }
    
    // Import and cleanup shared Smoldot
    const { smoldotManager } = await import('./smoldotManager.js');
    await smoldotManager.terminate();
  }
}

// Export singleton instance
export const multiChainPortfolio = new MultiChainPortfolio();