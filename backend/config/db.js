/**
 * config/db.js
 * ------------------------------------------------------------
 * Creates a single reusable MySQL connection pool.
 * Every model/controller imports THIS file rather than creating
 * its own connection, so we don't leak connections under load.
 * ------------------------------------------------------------
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'shegerflix',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

module.exports = pool;
