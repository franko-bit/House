// scripts/runSql.js
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

(async () => {
  const sqlFile = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(sqlFile)) {
    console.error('❌ scripts/schema.sql not found');
    process.exit(1);
  }

  const caPath = path.resolve(process.env.DB_SSL_CA || './ca.pem');
  const ssl = fs.existsSync(caPath)
    ? { ca: fs.readFileSync(caPath), rejectUnauthorized: true }
    : { rejectUnauthorized: false };

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl,
    multipleStatements: true,
  });

  console.log('📡 Connected to Aiven MySQL');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  await conn.query(sql);
  console.log('✅ schema.sql applied successfully');
  await conn.end();
})().catch(err => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});