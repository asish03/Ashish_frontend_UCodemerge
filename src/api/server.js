import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import mergeRoutes from './routes/merge.js';
import convertRoutes from './routes/convert.js';
import repositoryRoutes from './routes/repository.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import usersRoutes from './routes/users.js';
import projectsRoutes from './routes/projects.js';

// Import backend integration
import { backendConfig, shouldProxy } from './config/backend.js';
import { createProxyMiddleware, checkBackendHealth } from './middleware/proxy.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev')); // Console logging

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}\n`;
  
  // Log to file
  fs.appendFile(
    path.join(logsDir, 'requests.log'),
    logMessage,
    (err) => {
      if (err) console.error('Error writing to log file:', err);
    }
  );
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Backend status endpoint
app.get('/backend/status', async (req, res) => {
  const nodeStatus = {
    healthy: true,
    mode: backendConfig.mode,
    uptime: process.uptime()
  };
  
  let pythonStatus = null;
  if (backendConfig.mode !== 'mock') {
    pythonStatus = await checkBackendHealth();
  }
  
  res.json({
    node: nodeStatus,
    python: pythonStatus,
    integrated: backendConfig.mode !== 'mock',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/merge', mergeRoutes);
app.use('/api/v1/convert', convertRoutes);
app.use('/api/v1/repository', repositoryRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/projects', projectsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AsembleAI API Server',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    status: 'running'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] ERROR: ${err.message}\nStack: ${err.stack}\n\n`;
  
  // Log error to file
  fs.appendFile(
    path.join(logsDir, 'errors.log'),
    errorMessage,
    (logErr) => {
      if (logErr) console.error('Error writing to error log:', logErr);
    }
  );
  
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    timestamp,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         AsembleAI API Server - Running!                  ║
║                                                           ║
║  Server:      http://localhost:${PORT}                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}                               ║
║  Health:      http://localhost:${PORT}/health               ║
║                                                           ║
║  API Endpoints:                                           ║
║  - POST /api/v1/auth/login                                ║
║  - POST /api/v1/auth/register                             ║
║  - POST /api/v1/merge/upload                              ║
║  - POST /api/v1/merge/start                               ║
║  - GET  /api/v1/merge/jobs                                ║
║  - POST /api/v1/convert/analyze                           ║
║  - GET  /api/v1/analytics/overview                        ║
║  - GET  /api/v1/users (Owner only)                        ║
║                                                           ║
║  Logs: ./api/logs/                                        ║
║  - access.log   (HTTP access logs)                        ║
║  - requests.log (Request tracking)                        ║
║  - errors.log   (Error logs)                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  process.exit(0);
});