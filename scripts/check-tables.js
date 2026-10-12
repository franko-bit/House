require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

(async () => {
  const ca = fs.readFileSync('./ca.pem');
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT),
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl:      { ca, rejectUnauthorized: true },
  });

  const [rows] = await conn.query('SHOW TABLES');
  console.log('📋 Tables in', process.env.DB_NAME + ':');
  if (!rows.length) {
    console.log('   (none)');
  } else {
    rows.forEach(r => console.log('   •', Object.values(r)[0]));
  }
  await conn.end();
})().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});