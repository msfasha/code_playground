/**
 * Raasel Chat Platform - Secure Express Server with Socket.IO
 * 
 * Main server for the Raasel Chat Platform, a multi-tenant customer support chat application.
 * Built with Node.js, Express, and Socket.IO, designed to run securely over HTTPS.
 * 
 * Key Features:
 * - Environment configuration with dotenv
 * - Debug logging utility
 * - Express app with security middleware (helmet, CORS)
 * - SSL/TLS configuration with certificate loading
 * - HTTPS server creation
 * - Socket.IO integration for real-time communication
 * - Rate limiting and security features
 * - API routes for clients, agents, organizations, sessions
 * - Error handling and graceful shutdown
 * 
 * Usage: npm start or npm run dev
 * Dependencies: express, https, fs, socket.io, cors, helmet, express-rate-limit, path, dotenv
 */

const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Debug configuration
const DEBUG = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
const debugLog = (message, data = null) => {
  if (DEBUG) {
    console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
};

const app = express();

// SSL configuration
let sslOptions;
try {
  sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'))
  };
  debugLog('SSL certificates loaded successfully');
} catch (error) {
  console.error('Failed to load SSL certificates:', error.message);
  debugLog('SSL certificate error details:', error);
  process.exit(1);
}

const server = https.createServer(sslOptions, app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { 
    success: false,
    message: 'Too many requests from this IP, please try again later.' 
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/organizations', require('./routes/organizations'));
app.use('/api/sessions', require('./routes/sessions'));

// Socket.io connection handling
const chatHandler = require('./socket/chatHandler');
chatHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  debugLog('Request error details:', {
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 HTTPS Server running on port ${PORT}`);
  const host = process.env.HOST || 'localhost';
  console.log(`📊 Health check available at https://${host}:${PORT}/health`);
  console.log(`🔌 Socket.IO server ready`);
  debugLog('Server startup complete', {
    port: PORT,
    nodeEnv: process.env.NODE_ENV,
    debug: DEBUG,
    ssl: !!sslOptions
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = { app, server, io }; 