// utils/listingId.js
const { LISTING_PREFIXES } = require('../config/constants');

const generateListingId = (propertyType) => {
  const prefix = LISTING_PREFIXES[propertyType] || 'PR';
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${year}-${rand}`;
};

module.exports = { generateListingId };
