// routes/property.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/property.controller');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/',    ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/',     verifyToken, requireAdmin, upload.array('images', 20), ctrl.create);
router.put('/:id',   verifyToken, requireAdmin, upload.array('images', 20), ctrl.update);
router.delete('/:id', verifyToken, requireAdmin, ctrl.remove);
router.delete('/:id/images/:imageId', verifyToken, requireAdmin, ctrl.removeImage);

module.exports = router;
