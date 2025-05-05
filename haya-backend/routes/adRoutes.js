const express = require('express');
const upload = require('../middlewares/upload'); // Multer middleware
const {
  createAd,
  getAllAds,
  updateAd,
  deleteAd,
  deleteAllAds  // Import the new controller function
} = require('../controllers/adController');

const router = express.Router();

// Routes
router.post('/', upload.array('images', 5), createAd); // Upload up to 5 images
router.get('/', getAllAds);
router.put('/:id', upload.array('images', 5), updateAd);

// Place the delete-all route BEFORE the delete single route.
router.delete('/all', deleteAllAds);
router.delete('/:id', deleteAd);

module.exports = router;
