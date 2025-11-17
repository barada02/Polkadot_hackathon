import express from 'express';
import { polkadotPortfolio } from '../polkadot/portfolio.js';

const router = express.Router();

/**
 * POST /api/v1/portfolio/analyze
 * Analyze address portfolio on Westend2 (frontend primary endpoint)
 * 
 * Body: { "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { address } = req.body;
    
    // Validate request
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required',
        message: 'Please provide a valid Polkadot address'
      });
    }
    
    console.log(`🔍 API Request: Portfolio analysis for ${address.slice(0, 8)}...`);
    
    // Validate address format
    const validation = polkadotPortfolio.validateAddress(address);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid address format',
        message: validation.error
      });
    }
    
    // Analyze portfolio using isolated Polkadot logic
    const result = await polkadotPortfolio.analyzeWestendPortfolio(address);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Portfolio analysis completed',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Portfolio analysis failed',
        data: result
      });
    }
    
  } catch (error) {
    console.error('Error in portfolio analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/portfolio/validate-address
 * Validate address format before analysis (frontend helper)
 * 
 * Body: { "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }
 */
router.post('/validate-address', (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Address is required'
      });
    }
    
    const validation = polkadotPortfolio.validateAddress(address);
    
    res.json({
      success: true,
      data: {
        address,
        valid: validation.valid,
        error: validation.error || null
      }
    });
    
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/portfolio/test-addresses
 * Get test addresses for frontend development (Alice, Bob, Charlie)
 */
router.get('/test-addresses', (req, res) => {
  try {
    const testAddresses = {
      alice: {
        name: "Alice",
        address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        description: "Well-known test account with funding"
      },
      bob: {
        name: "Bob",
        address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        description: "Well-known test account for transfers"
      },
      charlie: {
        name: "Charlie",
        address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        description: "Well-known test account for multi-sig"
      }
    };
    
    res.json({
      success: true,
      message: 'Test addresses for development',
      data: testAddresses
    });
    
  } catch (error) {
    console.error('Error getting test addresses:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/portfolio/cleanup
 * Cleanup portfolio connections (development helper)
 */
router.post('/cleanup', async (req, res) => {
  try {
    await polkadotPortfolio.cleanup();
    
    res.json({
      success: true,
      message: 'Portfolio connections cleaned up'
    });
    
  } catch (error) {
    console.error('Error cleaning up portfolio:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup portfolio connections',
      message: error.message
    });
  }
});

export default router;