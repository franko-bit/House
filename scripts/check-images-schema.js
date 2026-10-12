// scripts/check-images-schema.js
require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');

(async () => {
  const ca = fs.readFileSync('./ca.pem');
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: Number(process.env.DB_PORT),
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, ssl: { ca, rejectUnauthorized: true },
  });

  console.log('=== property_images columns ===');
  const [cols] = await conn.query('SHOW COLUMNS FROM property_images');
  console.table(cols);

  console.log('\n=== Recent images ===');
  const [imgs] = await conn.query(`
    SELECT id, property_id, image_title, room_type, is_featured, display_order
    FROM property_images ORDER BY id DESC LIMIT 10
  `);
  console.table(imgs);

  await conn.end();
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
