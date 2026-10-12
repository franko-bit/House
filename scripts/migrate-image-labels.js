// scripts/migrate-image-labels.js
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

  // Check existing columns
  const [cols] = await conn.query('SHOW COLUMNS FROM property_images');
  const names = cols.map(c => c.Field);

  const additions = [];
  if (!names.includes('image_title'))       additions.push('ADD COLUMN image_title VARCHAR(150)');
  if (!names.includes('image_description')) additions.push('ADD COLUMN image_description TEXT');
  if (!names.includes('room_type'))         additions.push('ADD COLUMN room_type VARCHAR(80)');
  if (!names.includes('is_featured'))       additions.push('ADD COLUMN is_featured BOOLEAN DEFAULT FALSE');
  if (!names.includes('display_order'))     additions.push('ADD COLUMN display_order INT DEFAULT 0');
  if (!names.includes('created_at'))        additions.push('ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');

  if (!additions.length) {
    console.log('✅ All columns already exist. Nothing to do.');
    await conn.end();
    return;
  }

  const sql = `ALTER TABLE property_images ${additions.join(', ')}`;
  console.log('Running:', sql);
  await conn.query(sql);

  console.log('✅ Schema updated');
  await conn.end();
})().catch(err => { console.error('Error:', err.message); process.exit(1); });
