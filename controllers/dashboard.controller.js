// controllers/dashboard.controller.js
const pool = require('../config/db');

exports.stats = async (req, res, next) => {
  try {
    const [[{ total }]]     = await pool.query('SELECT COUNT(*) AS total FROM properties');
    const [[{ forSale }]]   = await pool.query("SELECT COUNT(*) AS forSale FROM properties WHERE status = 'For Sale'");
    const [[{ forRent }]]   = await pool.query("SELECT COUNT(*) AS forRent FROM properties WHERE status = 'For Rent'");
    const [[{ sold }]]      = await pool.query("SELECT COUNT(*) AS sold FROM properties WHERE status = 'Sold'");
    const [[{ draft }]]     = await pool.query("SELECT COUNT(*) AS draft FROM properties WHERE status = 'Draft'");
    const [[{ agents }]]    = await pool.query('SELECT COUNT(*) AS agents FROM agents');
    const [[{ inquiries }]] = await pool.query("SELECT COUNT(*) AS inquiries FROM inquiries WHERE status = 'New'");
    const [[{ images }]]    = await pool.query('SELECT COUNT(*) AS images FROM property_images');
    res.json({ total, forSale, forRent, sold, draft, agents, inquiries, images });
  } catch (err) { next(err); }
};

exports.recentProperties = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, listing_id, title, property_type, status, price, created_at
      FROM properties ORDER BY created_at DESC LIMIT 10
    `);
    res.json(rows);
  } catch (err) { next(err); }
};
