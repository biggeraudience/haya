// routes/predictionRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getSalesPredictionData } = require('../controllers/predictionController');
const { protect } = require('../middlewares/authMiddleware');

/**
 * Endpoint for single-value sales prediction.
 * Expects JSON input like: { "sales_shift": 100.0 }
 */
router.post('/predict-sales', async (req, res) => {
  try {
    const inputData = req.body;
    const response = await axios.post('http://localhost:5001/predict', inputData, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error calling ML service:", err);
    res.status(500).json({ error: "Prediction service error" });
  }
});

/**
 * Endpoint for time-series forecasting.
 * Expects JSON input like: { "historical_data": [value1, value2, ...] }
 */
router.post('/predict-timeseries', async (req, res) => {
  try {
    const inputData = req.body;
    const response = await axios.post('http://localhost:5001/predict-timeseries', inputData, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error calling ML service for timeseries prediction:", err);
    res.status(500).json({ error: "Prediction service error" });
  }
});

/**
 * NEW: Endpoint to fetch robust historical data for sales prediction analytics.
 */
router.get('/sales-prediction-data', protect, getSalesPredictionData);

module.exports = router;
