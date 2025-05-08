// ~/haya-backend/routes/productRoutes.js
export default (uploadProduct) => {
  const express = require("express");
  const router  = express.Router();

  const {
    getPublicProducts,
    getAdminProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getFilterOptions,
  } = require("../controllers/productController");
  const { protect } = require("../middlewares/authMiddleware");

  // Public
  router.get("/public", getPublicProducts);

  // Admin
  router.get("/", protect, getAdminProducts);
  router.post("/", protect, uploadProduct.array("images"), createProduct);
  router.put("/:id", protect, uploadProduct.array("images"), updateProduct);
  router.delete("/:id", protect, deleteProduct);

  // Filters
  router.get("/filters", getFilterOptions);

  return router;
};
