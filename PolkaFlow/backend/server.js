import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import chainsRoutes from './src/routes/chains.js';

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
    message: 'PolkaFlow API v1',
    endpoints: [
      'GET /health - Health check',
      'GET /api/v1 - API info',
      'GET /api/v1/chains/status - Get all chain connection status',
      'POST /api/v1/chains/test - Test all chain connections',
      'POST /api/v1/chains/test/:chainId - Test specific chain connection',
      'GET /api/v1/chains/:chainId - Get chain information'
    ]
  });
});

// Route handlers
app.use('/api/v1/chains', chainsRoutes);

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
  console.log(`⛓️  Chains API: http://localhost:${PORT}/api/v1/chains`);
});