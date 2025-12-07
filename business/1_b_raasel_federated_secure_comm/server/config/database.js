/**
 * Raasel Chat Platform - Database Configuration
 *
 * PostgreSQL connection setup for the main application database.
 * Uses environment variables for configuration.
 *
 * Example usage:
 *   const { db } = require('./config/database');
 *   const result = await db.query('SELECT * FROM users');
 *
 * Dependencies: pg
 */

const { Pool } = require('pg');

// PostgreSQL configuration
let db = null;

try {
  db = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'raasel',
    password: process.env.PG_PASSWORD || 'password',
    port: process.env.PG_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  });

  // Test the connection
  db.query('SELECT NOW()')
    .then(() => console.log('✅ PostgreSQL connected successfully'))
    .catch(err => {
      console.error('❌ PostgreSQL connection failed:', err.message);
      db = null;
    });

} catch (error) {
  console.error('❌ Failed to create PostgreSQL pool:', error.message);
  db = null;
}

module.exports = { db }; 