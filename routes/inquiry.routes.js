// routes/inquiry.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/inquiry.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');

router.post('/',            ctrl.create);
router.get('/',             verifyToken, requireAdmin, ctrl.list);
router.patch('/:id/status', verifyToken, requireAdmin, ctrl.updateStatus);

module.exports = router;
