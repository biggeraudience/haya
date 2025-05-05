const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Reuse the multer configuration for file uploads
const { createBespokeOrder } = require('../controllers/bespokeOrderController');
const { protect } = require('../middlewares/authMiddleware');

// Route to create a new bespoke fabric order.
// This route expects form data including measurements, fabric details,
// any additional notes, and an optional media file (photo/video).
router.post('/', protect, upload.array('media'), createBespokeOrder);

module.exports = router;
