// config/db.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

let sslConfig = undefined;

if (process.env.DB_SSL_CA) {
  try {
    const caPath = path.resolve(process.env.DB_SSL_CA);
    if (fs.existsSync(caPath)) {
      sslConfig = { ca: fs.readFileSync(caPath), rejectUnauthorized: true };
    } else {
      console.warn(`WARN: DB_SSL_CA path not found: ${caPath}`);
      sslConfig = { rejectUnauthorized: false };
    }
  } catch (err) {
    console.warn('WARN: Could not read DB_SSL_CA:', err.message);
  }
}

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:      sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: 'Z',
  dateStrings: true,
});

(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Aiven MySQL connected');
  } catch (err) {
    console.error('Aiven MySQL connection failed:', err.message);
  }
})();

module.exports = pool;
