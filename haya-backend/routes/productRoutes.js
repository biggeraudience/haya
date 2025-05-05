const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Ensure multer is properly configured and exported
const { 
  getPublicProducts, 
  getAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFilterOptions
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// Public route: Get all products (for universal products page)
router.get('/public', getPublicProducts);

// Admin routes: Only accessible when logged in as an admin
router.get('/', protect, getAdminProducts);

// Attach multer middleware to process images
router.post('/', protect, upload.array('images'), createProduct);
router.put('/:id', protect, upload.array('images'), updateProduct);
router.delete('/:id', protect, deleteProduct);

// NEW: Route for dynamic filter options
router.get('/filters', getFilterOptions);

module.exports = router;
