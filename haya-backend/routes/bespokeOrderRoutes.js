// ../haya-backend/routes/bespokeOrderRoutes.js

const express = require('express');
// Remove the direct require of middleware
// const upload = require('../middlewares/upload');

// Export a factory function that accepts the configured upload middleware
export default (uploadMiddleware) => {
  const router = express.Router();
  const { createBespokeOrder } = require('../controllers/bespokeOrderController');
  const { protect } = require('../middlewares/authMiddleware');

  // Route to create a new bespoke fabric order.
  // Use the uploadMiddleware passed as an argument
  router.post('/', protect, uploadMiddleware.array('media'), createBespokeOrder);

  return router;
};
