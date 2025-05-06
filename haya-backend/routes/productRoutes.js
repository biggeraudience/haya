// ../haya-backend/routes/productRoutes.js

// Do NOT require upload middleware here at the top level
// const upload = require('../middlewares/upload'); // This was likely importing the wrong middleware anyway

// Export a function that takes the configured uploadProduct middleware as an argument
export default (uploadProduct) => { // Accepts the product upload middleware
  const express = require('express'); // Require express inside the factory function
  const router = express.Router();

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

  // Attach multer middleware to process images - Use the uploadProduct middleware passed as an argument
  router.post('/', protect, uploadProduct.array('images'), createProduct);
  router.put('/:id', protect, uploadProduct.array('images'), updateProduct);
  router.delete('/:id', protect, deleteProduct);

  // NEW: Route for dynamic filter options
  router.get('/filters', getFilterOptions);

  return router; // Export the configured router
};
