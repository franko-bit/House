// scripts/seed.js
require('dotenv').config();

const bcrypt = require('bcrypt');
const pool = require('../config/db');

(async () => {
  try {
    console.log('Seeding...');

    const email = process.env.ADMIN_EMAIL || 'admin@estatehub.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const name = process.env.ADMIN_NAME || 'Admin';

    const [existing] = await pool.query('SELECT id FROM agents WHERE email = ?', [email]);
    let adminId;

    if (existing.length) {
      adminId = existing[0].id;
      console.log(`Admin already exists: ${email}`);
    } else {
      const hash = await bcrypt.hash(password, 10);
      const [r] = await pool.query(
        'INSERT INTO agents (name, email, password, role, phone_number, bio) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hash, 'admin', '+250 (0)788 123 456', 'HOMELINE platform administrator']
      );
      adminId = r.insertId;
      console.log(`Admin created: ${email} / ${password}`);
    }

    const locations = [
      ['Kigali', 'Gahanga'],
      ['Kigali', 'Nyarutarama'],
      ['Kigali', 'Kicukiro'],
      ['Kigali', 'Kibagabaga'],
      ['Kigali', 'Gacuriro'],
      ['Kigali', 'Kimihurura'],
      ['Kigali', 'Kacyiru'],
    ];
    const locationIds = [];
    for (const [city, hood] of locations) {
      const [rows] = await pool.query(
        'SELECT id FROM locations WHERE city = ? AND neighborhood = ?', [city, hood]
      );
      if (rows.length) locationIds.push(rows[0].id);
      else {
        const [r] = await pool.query(
          'INSERT INTO locations (city, neighborhood) VALUES (?, ?)', [city, hood]
        );
        locationIds.push(r.insertId);
      }
    }

    const demo = [
      { listing_id: 'HS26-005728', title: 'Brand-New Duplex with Rebero Views',
        property_type: 'House', status: 'For Sale', price: 390000000,
        bedrooms: 4, bathrooms: 3, size_sqm: 320,
        description: 'Premium duplex with panoramic city views and a fully finished master suite.',
        location: 0, is_featured: 1,
        main_image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=1600&q=80' },
      { listing_id: 'VL26-007428', title: 'Sunny Garden Villa Near the Hillside',
        property_type: 'Villa', status: 'For Sale', price: 720000000,
        bedrooms: 5, bathrooms: 4, size_sqm: 420,
        description: 'Peaceful villa surrounded by greenery with a generous lounge and landscaped garden.',
        location: 1, is_featured: 1,
        main_image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80' },
      { listing_id: 'AP26-001728', title: 'SUBIRA 2-Bedroom Apartment Nyarutarama',
        property_type: 'Apartment', status: 'For Sale', price: 867000000,
        bedrooms: 2, bathrooms: 2, size_sqm: 232,
        description: 'Stylish apartment with rooftop access, modern finishes, and strong city convenience.',
        location: 1, is_featured: 1,
        main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80' },
      { listing_id: 'HS26-004328', title: 'Modern Family Home in Rusororo',
        property_type: 'House', status: 'For Rent', price: 1400000,
        bedrooms: 4, bathrooms: 2, size_sqm: 351,
        description: 'A comfortable rental home with a quiet garden corner and practical family layout.',
        location: 2, is_featured: 0,
        main_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80' },
    ];

    for (const p of demo) {
      const [exists] = await pool.query('SELECT id FROM properties WHERE listing_id = ?', [p.listing_id]);
      if (exists.length) {
        console.log(`Property exists: ${p.listing_id}`);
        continue;
      }

      const [r] = await pool.query(`
        INSERT INTO properties
          (listing_id, title, property_type, status, price,
           bedrooms, bathrooms, size_sqm, description,
           location_id, agent_id, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.listing_id, p.title, p.property_type, p.status, p.price,
          p.bedrooms, p.bathrooms, p.size_sqm, p.description,
          locationIds[p.location], adminId, p.is_featured]);
      const propId = r.insertId;

      await pool.query(`
        INSERT INTO property_images
          (property_id, image_url, image_title, is_featured, display_order)
        VALUES (?, ?, ?, 1, 0)
      `, [propId, p.main_image, p.title]);

      await pool.query(`
        INSERT INTO property_images
          (property_id, image_url, image_title, is_featured, display_order)
        VALUES
          (?, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80', 'Interior', 0, 1),
          (?, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80', 'Living room', 0, 2)
      `, [propId, propId]);

      await pool.query(`
        INSERT INTO property_rooms (property_id, room_type, room_name, area_sqm, display_order)
        VALUES
          (?, 'Bedroom',    'Master Suite',  30, 0),
          (?, 'Kitchen',    'Modern Kitchen',18, 1),
          (?, 'Living Room','Main Lounge',   40, 2)
      `, [propId, propId, propId]);

      await pool.query(`
        INSERT INTO property_amenities (property_id, amenity_name, amenity_icon)
        VALUES
          (?, 'Swimming Pool', 'swimmer'),
          (?, 'Garden',        'tree'),
          (?, 'Parking',       'car'),
          (?, '24/7 Security', 'shield-alt')
      `, [propId, propId, propId, propId]);

      console.log(`Seeded property: ${p.listing_id}`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
