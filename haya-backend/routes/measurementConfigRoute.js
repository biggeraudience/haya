// routes/measurementConfigRoute.js
const express = require('express');
const router = express.Router();
const measurementConfig = require('../config/measurementConfig');

router.get('/', (req, res) => {
  // Optional: prevent caching issues
  res.set('Cache-Control', 'no-store');
  res.json(measurementConfig);
});

module.exports = router;
