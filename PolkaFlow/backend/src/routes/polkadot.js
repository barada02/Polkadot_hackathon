import express from 'express';
import { polkadotConnector } from '../polkadot/connections.js';

const router = express.Router();

/**
 * POST /api/v1/polkadot/test-connection
 * Test real Polkadot connection (like ex1)
 */
router.post('/test-connection', async (req, res) => {
  try {
    console.log('🔍 API Request: Testing real Polkadot connection');
    
    // Use the isolated Polkadot logic
    const result = await polkadotConnector.testWestendConnection();
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Polkadot connection successful',
        data: result
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Polkadot connection failed',
        data: result
      });
    }
    
  } catch (error) {
    console.error('Error in Polkadot connection test:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * GET /api/v1/polkadot/connection-status
 * Get status of existing connections
 */
router.get('/connection-status', (req, res) => {
  try {
    const westendConnection = polkadotConnector.getConnection('westend2');
    
    const status = {
      westend2: {
        connected: !!westendConnection,
        chainInfo: westendConnection?.chainInfo || null,
        lastConnected: westendConnection ? new Date() : null
      }
    };
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('Error getting connection status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get connection status',
      message: error.message
    });
  }
});

/**
 * POST /api/v1/polkadot/cleanup
 * Cleanup all connections (for testing)
 */
router.post('/cleanup', async (req, res) => {
  try {
    await polkadotConnector.cleanup();
    
    res.json({
      success: true,
      message: 'All Polkadot connections cleaned up'
    });
    
  } catch (error) {
    console.error('Error cleaning up connections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup connections', 
      message: error.message
    });
  }
});

export default router;