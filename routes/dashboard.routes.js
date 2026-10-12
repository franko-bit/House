// routes/dashboard.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/dashboard.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.get('/stats',             verifyToken, requireAdmin, ctrl.stats);
router.get('/recent-properties', verifyToken, requireAdmin, ctrl.recentProperties);

module.exports = router;
