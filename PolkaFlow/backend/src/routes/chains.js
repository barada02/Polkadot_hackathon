import express from 'express';
import ChainConnectionService from '../services/chainConnectionService.js';

const router = express.Router();
const chainService = new ChainConnectionService();

/**
 * GET /api/v1/chains/status
 * Get current status of all chain connections
 */
router.get('/status', (req, res) => {
  try {
    const status = chainService.getConnectionStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getting chain status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chain status',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/chains/test
 * Test connections to all chains (like ex7 network health monitoring)
 */
router.post('/test', async (req, res) => {
  try {
    console.log('🔍 API Request: Testing all chain connections');
    
    const results = await chainService.testAllConnections();
    
    res.json({
      success: true,
      data: results,
      summary: {
        totalChains: results.totalChains,
        connectedChains: results.connectedChains,
        averageHealth: results.averageHealth,
        timestamp: results.timestamp
      }
    });
  } catch (error) {
    console.error('Error testing chains:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test chain connections',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/chains/test/:chainId
 * Test connection to a specific chain
 */
router.post('/test/:chainId', async (req, res) => {
  try {
    const { chainId } = req.params;
    
    console.log(`🔍 API Request: Testing ${chainId} connection`);
    
    const result = await chainService.testChainConnection(chainId);
    
    if (result.success) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        data: result,
        error: `Failed to connect to ${result.name}`
      });
    }
  } catch (error) {
    console.error(`Error testing chain ${req.params.chainId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to test chain connection',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/chains/:chainId
 * Get detailed information about a specific chain
 */
router.get('/:chainId', (req, res) => {
  try {
    const { chainId } = req.params;
    const chainInfo = chainService.getChainInfo(chainId);
    
    if (!chainInfo) {
      return res.status(404).json({
        success: false,
        error: 'Chain not found',
        message: `Chain '${chainId}' is not configured`
      });
    }
    
    res.json({
      success: true,
      data: chainInfo
    });
  } catch (error) {
    console.error(`Error getting chain info for ${req.params.chainId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chain information',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/chains/reset
 * Reset all chain connections (useful for development/testing)
 */
router.post('/reset', (req, res) => {
  try {
    chainService.reset();
    
    res.json({
      success: true,
      message: 'Chain connections reset successfully'
    });
  } catch (error) {
    console.error('Error resetting chains:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset chain connections',
      message: error.message
    });
  }
});

export default router;