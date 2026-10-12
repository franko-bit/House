// routes/upload.routes.js
const router = require('express').Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', verifyToken, requireAdmin, upload.array('images', 20), (req, res) => {
  res.json({ urls: (req.files || []).map(f => f.path) });
});

module.exports = router;
