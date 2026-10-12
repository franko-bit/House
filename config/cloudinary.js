// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const {
  ALLOWED_IMAGE_FORMATS,
  MAX_IMAGE_SIZE_BYTES,
  CLOUDINARY_FOLDER,
} = require('./constants');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const baseName = file.originalname
      .split('.')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40);

    return {
      folder: CLOUDINARY_FOLDER,
      allowed_formats: ALLOWED_IMAGE_FORMATS,
      resource_type: 'image',
      transformation: [
        { width: 1600, height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ],
      public_id: `${Date.now()}-${baseName}`,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ALLOWED_IMAGE_FORMATS.includes(ext)) return cb(null, true);
    cb(new Error(`Only ${ALLOWED_IMAGE_FORMATS.join(', ')} images are allowed`));
  },
});

module.exports = { cloudinary, upload };
