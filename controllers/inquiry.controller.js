// controllers/inquiry.controller.js
const pool = require('../config/db');

exports.create = async (req, res, next) => {
  try {
    const { property_id, name, email, phone, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const [r] = await pool.query(
      `INSERT INTO inquiries (property_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)`,
      [property_id || null, name, email, phone || null, message || null]
    );
    res.status(201).json({ id: r.insertId, message: 'Inquiry submitted' });
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT i.*, p.title AS property_title, p.listing_id
      FROM inquiries i
      LEFT JOIN properties p ON i.property_id = p.id
      ORDER BY i.created_at DESC LIMIT 200
    `);
    res.json(rows);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['New', 'Read', 'Replied'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await pool.query('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
};
