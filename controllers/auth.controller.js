// controllers/auth.controller.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const signToken = (agent) =>
  jwt.sign(
    { agentId: agent.id, email: agent.email, role: agent.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

exports.signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const [existing] = await pool.query('SELECT id FROM agents WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO agents (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name || email.split('@')[0], email, hash, 'agent']
    );
    res.status(201).json({ id: result.insertId, message: 'Signup successful. Please log in.' });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const [rows] = await pool.query('SELECT * FROM agents WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const agent = rows[0];
    const ok = await bcrypt.compare(password, agent.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(agent);
    res.json({
      token,
      agent: {
        id: agent.id, name: agent.name, email: agent.email,
        role: agent.role, profile_image_url: agent.profile_image_url,
      },
    });
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone_number, profile_image_url, rating FROM agents WHERE id = ?',
      [req.user.agentId]
    );
    if (!rows.length) return res.status(404).json({ error: 'Agent not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};
