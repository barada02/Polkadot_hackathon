// Cross-Chain Fee Analysis Service
// Building on experiment 6 - Fee Comparison (89% savings proven!)

import { westend2Service } from './westend2.js';
import { assetHubService } from './assetHub.js';
import CollectivesService from './collectives.js';
import CoretimeService from './coretime.js';
import PeopleService from './people.js';
import { CHAIN_CONFIG } from '../config/chains.js';

// Initialize services
const collectivesService = new CollectivesService();
const coretimeService = new CoretimeService();
const peopleService = new PeopleService();

export class CrossChainFeeAnalyzer {
  constructor() {
    this.chains = {
      westend2: westend2Service,
      westend2_asset_hub: assetHubService,
      westend2_collectives: collectivesService,
      westend2_coretime: coretimeService,
      westend2_people: peopleService
    };
    
    // XCM route mappings (based on Westend ecosystem architecture)
    this.xcmRoutes = {
      // From Relay Chain
      'westend2': {
        'westend2_asset_hub': { hops: 1, type: 'relay_to_parachain' },
        'westend2_collectives': { hops: 1, type: 'relay_to_parachain' },
        'westend2_coretime': { hops: 1, type: 'relay_to_parachain' },
        'westend2_people': { hops: 1, type: 'relay_to_parachain' }
      },
      // From Asset Hub (most connected parachain)
      'westend2_asset_hub': {
        'westend2': { hops: 1, type: 'parachain_to_relay' },
        'westend2_collectives': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_coretime': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_people': { hops: 2, type: 'parachain_to_parachain' }
      },
      // From Collectives
      'westend2_collectives': {
        'westend2': { hops: 1, type: 'parachain_to_relay' },
        'westend2_asset_hub': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_coretime': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_people': { hops: 2, type: 'parachain_to_parachain' }
      },
      // From Coretime
      'westend2_coretime': {
        'westend2': { hops: 1, type: 'parachain_to_relay' },
        'westend2_asset_hub': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_collectives': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_people': { hops: 2, type: 'parachain_to_parachain' }
      },
      // From People
      'westend2_people': {
        'westend2': { hops: 1, type: 'parachain_to_relay' },
        'westend2_asset_hub': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_collectives': { hops: 2, type: 'parachain_to_parachain' },
        'westend2_coretime': { hops: 2, type: 'parachain_to_parachain' }
      }
    };
  }

  /**
   * Compare transfer fees across all chains (like experiment 6)
   * Returns sorted list by cheapest fees
   */
  async compareTransferFees(amount = "1000000000000", destinationAddress) {
    console.log(`💰 Analyzing transfer fees for ${amount} across all chains...`);
    
    const startTime = Date.now();
    const feeResults = [];

    // Query all chains in parallel for maximum speed
    const feePromises = Object.entries(this.chains).map(async ([chainId, service]) => {
      try {
        const feeResult = await service.getTransferFee(amount, destinationAddress);
        return {
          ...feeResult,
          chainConfig: CHAIN_CONFIG[chainId]
        };
      } catch (error) {
        return {
          success: false,
          chainId,
          chainName: CHAIN_CONFIG[chainId]?.name || chainId,
          error: error.message || 'Fee estimation failed'
        };
      }
    });

    const results = await Promise.allSettled(feePromises);
    
    // Process results
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        feeResults.push(result.value);
      } else if (result.status === 'fulfilled') {
        feeResults.push(result.value); // Include failed results for transparency
      }
    });

    // Sort by fee (lowest first) - this is where the 89% savings come from!
    const successfulResults = feeResults.filter(r => r.success);
    successfulResults.sort((a, b) => parseFloat(a.fee) - parseFloat(b.fee));

    const analysisTime = Date.now() - startTime;
    
    // Calculate savings (like experiment 6)
    let savings = null;
    if (successfulResults.length >= 2) {
      const cheapest = successfulResults[0];
      const mostExpensive = successfulResults[successfulResults.length - 1];
      const savingsAmount = parseFloat(mostExpensive.fee) - parseFloat(cheapest.fee);
      const savingsPercent = ((savingsAmount / parseFloat(mostExpensive.fee)) * 100).toFixed(2);
      
      savings = {
        cheapest: cheapest.chainName,
        mostExpensive: mostExpensive.chainName,
        savingsAmount: savingsAmount.toString(),
        savingsPercent: `${savingsPercent}%`,
        absoluteSavings: (savingsAmount / Math.pow(10, cheapest.chainConfig.decimals)).toFixed(6)
      };
    }

    return {
      success: true,
      message: `Fee analysis completed across ${Object.keys(this.chains).length} chains`,
      data: {
        amount,
        destinationAddress,
        totalChains: Object.keys(this.chains).length,
        successfulChains: successfulResults.length,
        failedChains: feeResults.filter(r => !r.success).length,
        fees: feeResults,
        sortedByCheapest: successfulResults,
        savings,
        analysisTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Find optimal route for cross-chain transfer
   * Considers both direct routes and multi-hop via Asset Hub
   */
  async findOptimalRoute(fromChain, toChain, amount = "1000000000000") {
    console.log(`🚀 Finding optimal route: ${fromChain} -> ${toChain}`);
    
    if (fromChain === toChain) {
      return {
        success: false,
        error: "Source and destination chains cannot be the same"
      };
    }

    const routes = [];
    
    // Direct route (if available)
    if (this.xcmRoutes[fromChain] && this.xcmRoutes[fromChain][toChain]) {
      const directRoute = this.xcmRoutes[fromChain][toChain];
      routes.push({
        type: 'direct',
        path: [fromChain, toChain],
        hops: directRoute.hops,
        routeType: directRoute.type,
        estimatedFee: await this.estimateXcmFee(fromChain, toChain, amount)
      });
    }

    // Multi-hop routes via Asset Hub (usually cheapest)
    if (fromChain !== 'westend2_asset_hub' && toChain !== 'westend2_asset_hub') {
      const viaAssetHub = {
        type: 'multi_hop',
        path: [fromChain, 'westend2_asset_hub', toChain],
        hops: 2,
        routeType: 'via_asset_hub',
        estimatedFee: await this.estimateMultiHopFee(fromChain, 'westend2_asset_hub', toChain, amount)
      };
      routes.push(viaAssetHub);
    }

    // Multi-hop routes via Relay Chain
    if (fromChain !== 'westend2' && toChain !== 'westend2') {
      const viaRelay = {
        type: 'multi_hop',
        path: [fromChain, 'westend2', toChain],
        hops: 2,
        routeType: 'via_relay',
        estimatedFee: await this.estimateMultiHopFee(fromChain, 'westend2', toChain, amount)
      };
      routes.push(viaRelay);
    }

    // Sort routes by estimated fee
    routes.sort((a, b) => {
      if (!a.estimatedFee.success) return 1;
      if (!b.estimatedFee.success) return -1;
      return parseFloat(a.estimatedFee.totalFee) - parseFloat(b.estimatedFee.totalFee);
    });

    const optimalRoute = routes.length > 0 ? routes[0] : null;

    return {
      success: true,
      data: {
        fromChain,
        toChain,
        amount,
        totalRoutes: routes.length,
        optimalRoute,
        allRoutes: routes,
        recommendation: optimalRoute ? `Use ${optimalRoute.routeType} route with ${optimalRoute.hops} hop(s)` : 'No viable route found',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Estimate XCM fee for direct transfers
   */
  async estimateXcmFee(fromChain, toChain, amount) {
    try {
      // Base XCM fee estimation (placeholder - would need actual XCM calls)
      const baseXcmFee = "50000000000"; // 0.05 WND base fee
      const fromChainConfig = CHAIN_CONFIG[fromChain];
      const toChainConfig = CHAIN_CONFIG[toChain];
      
      return {
        success: true,
        fromChain,
        toChain,
        totalFee: baseXcmFee,
        totalFeeFormatted: (parseFloat(baseXcmFee) / Math.pow(10, fromChainConfig.decimals)).toFixed(6),
        tokenSymbol: fromChainConfig.tokenSymbol,
        breakdown: {
          xcmFee: baseXcmFee,
          deliveryFee: "0"
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'XCM fee estimation failed'
      };
    }
  }

  /**
   * Estimate multi-hop fee (sum of individual hops)
   */
  async estimateMultiHopFee(fromChain, viaChain, toChain, amount) {
    try {
      const hop1Fee = await this.estimateXcmFee(fromChain, viaChain, amount);
      const hop2Fee = await this.estimateXcmFee(viaChain, toChain, amount);
      
      if (!hop1Fee.success || !hop2Fee.success) {
        return {
          success: false,
          error: 'Multi-hop fee estimation failed'
        };
      }

      const totalFee = (BigInt(hop1Fee.totalFee) + BigInt(hop2Fee.totalFee)).toString();
      const fromChainConfig = CHAIN_CONFIG[fromChain];

      return {
        success: true,
        fromChain,
        viaChain,
        toChain,
        totalFee,
        totalFeeFormatted: (parseFloat(totalFee) / Math.pow(10, fromChainConfig.decimals)).toFixed(6),
        tokenSymbol: fromChainConfig.tokenSymbol,
        breakdown: {
          hop1Fee: hop1Fee.totalFee,
          hop2Fee: hop2Fee.totalFee
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Multi-hop fee estimation failed'
      };
    }
  }

  /**
   * Get all supported routes from a chain
   */
  getSupportedRoutes(fromChain) {
    if (!this.xcmRoutes[fromChain]) {
      return {
        success: false,
        error: `Chain ${fromChain} not supported or has no XCM routes`
      };
    }

    const routes = Object.entries(this.xcmRoutes[fromChain]).map(([toChain, routeInfo]) => ({
      toChain,
      toChainName: CHAIN_CONFIG[toChain]?.name || toChain,
      hops: routeInfo.hops,
      routeType: routeInfo.type
    }));

    return {
      success: true,
      fromChain,
      fromChainName: CHAIN_CONFIG[fromChain]?.name || fromChain,
      totalRoutes: routes.length,
      routes
    };
  }

  /**
   * Cleanup all connections
   */
  async cleanup() {
    const cleanupPromises = Object.values(this.chains).map(service => 
      service.disconnect?.() || Promise.resolve()
    );
    
    await Promise.allSettled(cleanupPromises);
    console.log('🧹 Cross-chain fee analyzer connections cleaned up');
  }
}

// Export singleton instance
export const crossChainFeeAnalyzer = new CrossChainFeeAnalyzer();
export default crossChainFeeAnalyzer;