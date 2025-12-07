const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: (msg) => logger.debug(msg)
});

async function setupDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('Database models synchronized successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    throw error;
  }
}

module.exports = {
  sequelize,
  setupDatabase
}; 