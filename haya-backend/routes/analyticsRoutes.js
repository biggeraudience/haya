// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  recordEvent,
  getAnalytics,
  getPaginatedEvents,
  getTimeseriesData, // import new function
} = require("../controllers/analyticsController");

// Existing routes...
router.post("/events", protect, recordEvent);
router.get("/", protect, getAnalytics);
router.get("/events/paginated", protect, getPaginatedEvents);

// NEW: Route to get timeseries data (e.g., daily revenue)
router.get("/timeseries", protect, getTimeseriesData);

module.exports = router;
