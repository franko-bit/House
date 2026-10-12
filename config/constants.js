// config/constants.js
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  LISTING_PREFIXES: {
    Apartment:  'AP',
    House:      'HS',
    Villa:      'VL',
    Land:       'PL',
    Townhouse:  'TH',
    Bungalow:   'BG',
    Residence:  'RS',
    Loft:       'LF',
    Office:     'OF',
    Commercial: 'CM',
  },

  PROPERTY_TYPES: [
    'House', 'Apartment', 'Villa', 'Land',
    'Townhouse', 'Bungalow', 'Residence',
    'Loft', 'Office', 'Commercial',
  ],

  PROPERTY_STATUSES: ['For Sale', 'For Rent', 'Sold', 'Draft'],

  ALLOWED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_IMAGES_PER_PROPERTY: 20,

  CLOUDINARY_FOLDER: 'homeline/properties',
};
