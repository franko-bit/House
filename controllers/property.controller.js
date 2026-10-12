// controllers/property.controller.js
const pool = require('../config/db');
const { generateListingId } = require('../utils/listingId');
const { cloudinary } = require('../config/cloudinary');

exports.list = async (req, res, next) => {
  try {
    const { type, status, location, minPrice, maxPrice,
            bedrooms, featured, limit = 100, offset = 0 } = req.query;

    let sql = `
      SELECT
        p.id, p.listing_id, p.title, p.property_type, p.status,
        p.price, p.bedrooms, p.bathrooms, p.size_sqm, p.description,
        p.is_featured, p.created_at,
        l.city, l.neighborhood,
        a.id AS agent_id, a.name AS agent_name, a.phone_number,
        (SELECT image_url FROM property_images
          WHERE property_id = p.id AND is_featured = 1
          ORDER BY display_order LIMIT 1) AS main_image,
        (SELECT COUNT(*) FROM property_images WHERE property_id = p.id) AS image_count
      FROM properties p
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN agents    a ON p.agent_id    = a.id
      WHERE 1 = 1
    `;
    const params = [];
    if (type)     { sql += ' AND p.property_type = ?'; params.push(type); }
    if (status)   { sql += ' AND p.status = ?';        params.push(status); }
    if (featured) { sql += ' AND p.is_featured = 1'; }
    if (location) { sql += ' AND (l.city LIKE ? OR l.neighborhood LIKE ?)';
                    params.push(`%${location}%`, `%${location}%`); }
    if (minPrice) { sql += ' AND p.price >= ?';  params.push(minPrice); }
    if (maxPrice) { sql += ' AND p.price <= ?';  params.push(maxPrice); }
    if (bedrooms) { sql += ' AND p.bedrooms >= ?'; params.push(bedrooms); }

    sql += ' ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM properties p');
    res.json({ data: rows, total: countRows[0].total });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    const isNumeric = /^\d+$/.test(idParam);
    const where = isNumeric ? 'p.id = ?' : 'p.listing_id = ?';

    const [properties] = await pool.query(`
      SELECT p.*, l.city, l.neighborhood, l.map_link,
        a.id AS agent_id, a.name AS agent_name, a.phone_number,
        a.email AS agent_email, a.profile_image_url, a.bio, a.rating
      FROM properties p
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN agents    a ON p.agent_id    = a.id
      WHERE ${where}
    `, [idParam]);

    if (!properties.length) return res.status(404).json({ error: 'Property not found' });

    const property = properties[0];

    const [images] = await pool.query(`
      SELECT id, image_url, image_title, image_description,
             room_type, is_featured, display_order
      FROM property_images WHERE property_id = ?
      ORDER BY is_featured DESC, display_order ASC
    `, [property.id]);

    const [rooms] = await pool.query(`
      SELECT room_type, room_name, description, area_sqm, display_order
      FROM property_rooms WHERE property_id = ? ORDER BY display_order ASC
    `, [property.id]);

    const [amenities] = await pool.query(`
      SELECT amenity_name, amenity_icon
      FROM property_amenities WHERE property_id = ?
    `, [property.id]);

    res.json({ ...property, images, rooms, amenities });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const { title, property_type, status = 'For Sale', price,
            bedrooms = 0, bathrooms = 0, size_sqm = 0,
            description, city, neighborhood, map_link,
            rooms, amenities, is_featured = false } = req.body;

    if (!title || !property_type || !price) {
      await conn.rollback(); conn.release();
      return res.status(400).json({ error: 'title, property_type and price are required' });
    }

    let locationId = null;
    if (city && neighborhood) {
      const [existing] = await conn.query(
        'SELECT id FROM locations WHERE city = ? AND neighborhood = ? LIMIT 1',
        [city, neighborhood]
      );
      if (existing.length) locationId = existing[0].id;
      else {
        const [r] = await conn.query(
          'INSERT INTO locations (city, neighborhood, map_link) VALUES (?, ?, ?)',
          [city, neighborhood, map_link || null]
        );
        locationId = r.insertId;
      }
    }

    const listing_id = generateListingId(property_type);
    const [propResult] = await conn.query(`
      INSERT INTO properties
        (listing_id, title, property_type, status, price,
         bedrooms, bathrooms, size_sqm, description,
         location_id, agent_id, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [listing_id, title, property_type, status, price,
        bedrooms, bathrooms, size_sqm, description || null,
        locationId, req.user.agentId, is_featured ? 1 : 0]);
    const propertyId = propResult.insertId;

    if (req.files && req.files.length) {
      const values = req.files.map((file, idx) => [
        propertyId, file.path, file.originalname, idx === 0 ? 1 : 0, idx,
      ]);
      await conn.query(
        `INSERT INTO property_images
           (property_id, image_url, image_title, is_featured, display_order)
         VALUES ?`, [values]
      );
    }

    if (rooms) {
      const arr = typeof rooms === 'string' ? JSON.parse(rooms) : rooms;
      if (arr.length) {
        const values = arr.map((r, i) => [
          propertyId, r.room_type, r.room_name || null,
          r.description || null, r.area_sqm || null, i,
        ]);
        await conn.query(
          `INSERT INTO property_rooms
             (property_id, room_type, room_name, description, area_sqm, display_order)
           VALUES ?`, [values]
        );
      }
    }

    if (amenities) {
      const arr = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      if (arr.length) {
        const values = arr.map(a => [propertyId, a.amenity_name, a.amenity_icon || 'check']);
        await conn.query(
          `INSERT INTO property_amenities
             (property_id, amenity_name, amenity_icon) VALUES ?`, [values]
        );
      }
    }

    await conn.commit(); conn.release();
    res.status(201).json({
      message: 'Property created',
      propertyId, listing_id,
      images: (req.files || []).map(f => f.path),
    });
  } catch (err) {
    await conn.rollback(); conn.release(); next(err);
  }
};

exports.update = async (req, res, next) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id } = req.params;
    const { title, property_type, status, price,
            bedrooms, bathrooms, size_sqm, description,
            city, neighborhood, map_link, is_featured } = req.body;

    const [existing] = await conn.query('SELECT id FROM properties WHERE id = ?', [id]);
    if (!existing.length) {
      await conn.rollback(); conn.release();
      return res.status(404).json({ error: 'Property not found' });
    }

    let locationId = null;
    if (city && neighborhood) {
      const [loc] = await conn.query(
        'SELECT id FROM locations WHERE city = ? AND neighborhood = ? LIMIT 1',
        [city, neighborhood]
      );
      if (loc.length) locationId = loc[0].id;
      else {
        const [r] = await conn.query(
          'INSERT INTO locations (city, neighborhood, map_link) VALUES (?, ?, ?)',
          [city, neighborhood, map_link || null]
        );
        locationId = r.insertId;
      }
    }

    await conn.query(`
      UPDATE properties SET
        title = COALESCE(?, title),
        property_type = COALESCE(?, property_type),
        status = COALESCE(?, status),
        price = COALESCE(?, price),
        bedrooms = COALESCE(?, bedrooms),
        bathrooms = COALESCE(?, bathrooms),
        size_sqm = COALESCE(?, size_sqm),
        description = COALESCE(?, description),
        location_id = COALESCE(?, location_id),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `, [title, property_type, status, price,
        bedrooms, bathrooms, size_sqm, description,
        locationId,
        is_featured === undefined ? null : (is_featured ? 1 : 0),
        id]);

    if (req.files && req.files.length) {
      const [maxOrder] = await conn.query(
        'SELECT COALESCE(MAX(display_order), -1) + 1 AS next FROM property_images WHERE property_id = ?',
        [id]
      );
      const start = maxOrder[0].next;
      const values = req.files.map((file, idx) => [id, file.path, file.originalname, 0, start + idx]);
      await conn.query(
        `INSERT INTO property_images
           (property_id, image_url, image_title, is_featured, display_order)
         VALUES ?`, [values]
      );
    }

    await conn.commit(); conn.release();
    res.json({ message: 'Property updated', id });
  } catch (err) {
    await conn.rollback(); conn.release(); next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [images] = await pool.query(
      'SELECT image_url FROM property_images WHERE property_id = ?', [id]
    );
    for (const img of images) {
      const match = img.image_url.match(/homeline\/properties\/([^.\/]+)/);
      if (match) cloudinary.uploader.destroy(`homeline/properties/${match[1]}`).catch(() => {});
    }
    await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    res.json({ message: 'Property deleted' });
  } catch (err) { next(err); }
};

exports.removeImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    const [rows] = await pool.query(
      'SELECT image_url FROM property_images WHERE id = ? AND property_id = ?',
      [imageId, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Image not found' });

    const match = rows[0].image_url.match(/homeline\/properties\/([^.\/]+)/);
    if (match) cloudinary.uploader.destroy(`homeline/properties/${match[1]}`).catch(() => {});

    await pool.query('DELETE FROM property_images WHERE id = ?', [imageId]);
    res.json({ message: 'Image deleted' });
  } catch (err) { next(err); }
};
