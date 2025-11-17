// Fee Analysis Routes - Building on experiment 6 success (89% savings!)
import express from 'express';
import { crossChainFeeAnalyzer } from '../polkadot/crossChainFees.js';
import { CHAIN_CONFIG, TEST_ADDRESSES } from '../config/chains.js';

const router = express.Router();

/**
 * POST /api/v1/fees/compare
 * Compare transfer fees across all chains - MAIN FEATURE
 * Based on experiment 6 that proved 89% savings possible
 */
router.post('/compare', async (req, res) => {
  try {
    const { amount, destinationAddress } = req.body;

    // Validate inputs
    if (!destinationAddress) {
      return res.status(400).json({
        success: false,
        error: 'destinationAddress is required'
      });
    }

    // Use default amount if not provided (1 WND)
    const transferAmount = amount || "1000000000000";

    console.log(`💰 Fee comparison request: ${transferAmount} to ${destinationAddress.slice(0, 8)}...`);

    const result = await crossChainFeeAnalyzer.compareTransferFees(transferAmount, destinationAddress);

    res.json({
      success: true,
      message: 'Cross-chain fee analysis completed',
      data: result.data
    });

  } catch (error) {
    console.error('Fee comparison failed:', error);
    res.status(500).json({
      success: false,
      error: 'Fee comparison failed',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/fees/optimal-route
 * Find optimal route between two chains
 * Smart routing for minimum cost transfers
 */
router.post('/optimal-route', async (req, res) => {
  try {
    const { fromChain, toChain, amount } = req.body;

    // Validate inputs
    if (!fromChain || !toChain) {
      return res.status(400).json({
        success: false,
        error: 'fromChain and toChain are required'
      });
    }

    // Validate chain IDs
    if (!CHAIN_CONFIG[fromChain]) {
      return res.status(400).json({
        success: false,
        error: `Unsupported fromChain: ${fromChain}`
      });
    }

    if (!CHAIN_CONFIG[toChain]) {
      return res.status(400).json({
        success: false,
        error: `Unsupported toChain: ${toChain}`
      });
    }

    const transferAmount = amount || "1000000000000";

    console.log(`🚀 Route optimization: ${fromChain} -> ${toChain} (${transferAmount})`);

    const result = await crossChainFeeAnalyzer.findOptimalRoute(fromChain, toChain, transferAmount);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Optimal route analysis completed',
      data: result.data
    });

  } catch (error) {
    console.error('Route optimization failed:', error);
    res.status(500).json({
      success: false,
      error: 'Route optimization failed',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/fees/routes/:chainId
 * Get all supported routes from a specific chain
 */
router.get('/routes/:chainId', async (req, res) => {
  try {
    const { chainId } = req.params;

    // Validate chain ID
    if (!CHAIN_CONFIG[chainId]) {
      return res.status(404).json({
        success: false,
        error: `Chain not found: ${chainId}`
      });
    }

    const result = crossChainFeeAnalyzer.getSupportedRoutes(chainId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: `Routes for ${chainId} retrieved`,
      data: result
    });

  } catch (error) {
    console.error('Route retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Route retrieval failed',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/fees/supported-chains
 * Get all chains that support fee analysis
 */
router.get('/supported-chains', (req, res) => {
  try {
    const chains = Object.entries(CHAIN_CONFIG).map(([chainId, config]) => ({
      chainId,
      name: config.name,
      icon: config.icon,
      type: config.type,
      tokenSymbol: config.tokenSymbol,
      decimals: config.decimals,
      priority: config.priority
    }));

    res.json({
      success: true,
      message: `${chains.length} chains support fee analysis`,
      data: {
        totalChains: chains.length,
        chains: chains.sort((a, b) => a.priority - b.priority)
      }
    });

  } catch (error) {
    console.error('Supported chains retrieval failed:', error);
    res.status(500).json({
      success: false,
      error: 'Supported chains retrieval failed',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/fees/test-scenario
 * Demo endpoint showcasing fee savings (like experiment 6)
 * Perfect for hackathon demos!
 */
router.get('/test-scenario', async (req, res) => {
  try {
    console.log('🎭 Running fee comparison demo scenario...');
    
    // Use Alice's address for demo
    const testAddress = TEST_ADDRESSES.alice.address;
    const testAmount = "1000000000000"; // 1 WND

    const result = await crossChainFeeAnalyzer.compareTransferFees(testAmount, testAddress);

    // Add demo context
    const demoResult = {
      ...result.data,
      demoInfo: {
        scenario: "Transfer 1 WND to Alice's address across all Westend chains",
        testAddress,
        testAmount,
        amountFormatted: "1.0000 WND",
        purpose: "Demonstrate cross-chain fee savings (based on experiment 6 proving 89% savings possible)"
      }
    };

    res.json({
      success: true,
      message: 'Demo fee comparison completed - showcasing potential savings!',
      data: demoResult
    });

  } catch (error) {
    console.error('Demo scenario failed:', error);
    res.status(500).json({
      success: false,
      error: 'Demo scenario failed',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/fees/cleanup
 * Cleanup all fee analyzer connections
 */
router.post('/cleanup', async (req, res) => {
  try {
    await crossChainFeeAnalyzer.cleanup();
    
    res.json({
      success: true,
      message: 'Fee analyzer connections cleaned up'
    });

  } catch (error) {
    console.error('Fee analyzer cleanup failed:', error);
    res.status(500).json({
      success: false,
      error: 'Fee analyzer cleanup failed',
      message: error.message
    });
  }
});

export default router;