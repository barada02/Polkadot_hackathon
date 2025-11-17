import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import portfolioRoutes from './src/routes/portfolio.js';
import feeRoutes from './src/routes/fees.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'PolkaFlow Backend',
    version: '1.0.0'
  });
});

// API routes
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'PolkaFlow API v1 - Multi-chain Portfolio & Fee Analysis',
    endpoints: [
      'GET /health - Health check',
      'GET /api/v1 - API info',
      '--- Portfolio Analysis ---',
      'POST /api/v1/portfolio/analyze - Multi-chain portfolio analysis (MAIN ENDPOINT)',
      'POST /api/v1/portfolio/chain - Single chain portfolio analysis',
      'POST /api/v1/portfolio/validate-address - Validate Polkadot address format',
      'GET /api/v1/portfolio/supported-chains - Get list of supported chains',
      'GET /api/v1/portfolio/test-addresses - Get test addresses for development',
      'POST /api/v1/portfolio/cleanup - Cleanup connections (dev helper)',
      '--- Fee Analysis & Route Optimization (NEW!) ---',
      'POST /api/v1/fees/compare - Compare transfer fees across all chains (89% savings!)',
      'POST /api/v1/fees/optimal-route - Find cheapest route between chains',
      'GET /api/v1/fees/routes/:chainId - Get supported routes from a chain',
      'GET /api/v1/fees/supported-chains - Get chains supporting fee analysis',
      'GET /api/v1/fees/test-scenario - Demo fee savings scenario',
      'POST /api/v1/fees/cleanup - Cleanup fee analyzer connections'
    ]
  });
});

// Route handlers
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/fees', feeRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PolkaFlow Backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  console.log(`💡 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Portfolio API: http://localhost:${PORT}/api/v1/portfolio`);
  console.log(`💰 Fee Analysis API: http://localhost:${PORT}/api/v1/fees`);
  console.log(`🎯 Demo endpoint: http://localhost:${PORT}/api/v1/fees/test-scenario`);
});