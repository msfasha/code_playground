const express = require('express');
const authRoutes = require('./auth');

function setupRoutes(app) {
  app.use('/api/auth', authRoutes);
}

module.exports = {
  setupRoutes
}; 