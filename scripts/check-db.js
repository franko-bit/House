// scripts/check-db.js
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

  console.log('Database:', process.env.DB_NAME);
  console.log('='.repeat(70));

  const [[{ properties }]] = await conn.query('SELECT COUNT(*) AS properties FROM properties');
  const [[{ images }]]     = await conn.query('SELECT COUNT(*) AS images FROM property_images');
  const [[{ rooms }]]      = await conn.query('SELECT COUNT(*) AS rooms FROM property_rooms');
  const [[{ amenities }]]  = await conn.query('SELECT COUNT(*) AS amenities FROM property_amenities');
  const [[{ locations }]]  = await conn.query('SELECT COUNT(*) AS locations FROM locations');
  const [[{ agents }]]     = await conn.query('SELECT COUNT(*) AS agents FROM agents');
  const [[{ inquiries }]]  = await conn.query('SELECT COUNT(*) AS inquiries FROM inquiries');

  console.log('Row counts:');
  console.log('  properties ......... ' + properties);
  console.log('  property_images .... ' + images);
  console.log('  property_rooms ..... ' + rooms);
  console.log('  property_amenities . ' + amenities);
  console.log('  locations .......... ' + locations);
  console.log('  agents ............. ' + agents);
  console.log('  inquiries .......... ' + inquiries);
  console.log('='.repeat(70));

  const [rows] = await conn.query(`
    SELECT
      p.id, p.listing_id, p.title, p.property_type, p.status,
      p.price, p.bedrooms, p.bathrooms, p.size_sqm, p.is_featured,
      l.city, l.neighborhood,
      a.name AS agent_name,
      (SELECT COUNT(*) FROM property_images WHERE property_id = p.id) AS image_count
    FROM properties p
    LEFT JOIN locations l ON p.location_id = l.id
    LEFT JOIN agents a ON p.agent_id = a.id
    ORDER BY p.id ASC
  `);

  if (!rows.length) {
    console.log('No properties found in the database.');
  } else {
    console.log('');
    console.log('Properties (' + rows.length + ' total):');
    console.log('');
    rows.forEach(p => {
      console.log('  [' + p.id + '] ' + p.listing_id + '  ' + p.status + '  ' + p.property_type + '  ' + p.image_count + ' img  ' + (p.is_featured ? 'FEATURED' : ''));
      console.log('       ' + p.title);
      console.log('       ' + (p.neighborhood || '') + ', ' + (p.city || '') + '  |  ' + p.bedrooms + 'bd/' + p.bathrooms + 'ba/' + p.size_sqm + 'sqm  |  ' + Number(p.price).toLocaleString() + ' Fr');
      console.log('');
    });
  }

  await conn.end();
  console.log('Done.');
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
