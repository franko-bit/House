// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth.routes');
const propertyRoutes  = require('./routes/property.routes');
const inquiryRoutes   = require('./routes/inquiry.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const uploadRoutes    = require('./routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use('/api/auth',       authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries',  inquiryRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/upload',     uploadRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get(/^\/(?!api).*/, (req, res, next) => {
  const requested = req.path;
  if (path.extname(requested)) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`HOMELINE server running on port ${PORT}`);
  console.log(`ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`URL: http://localhost:${PORT}`);
});

module.exports = app;
