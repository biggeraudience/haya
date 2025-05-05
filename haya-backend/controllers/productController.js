const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');

const getPublicProducts = asyncHandler(async (req, res) => {
  try {
    const queryFilter = {};

    // If an id is provided, add it to the filter.
    if (req.query.id) {
      // Ensure you are matching the _id exactly.
      queryFilter._id = req.query.id;
    }

    // Only add a category filter if provided and not "all"
    if (req.query.category && req.query.category.toLowerCase() !== "all") {
      queryFilter.category = { $regex: new RegExp(`^${req.query.category}$`, "i") };

      // Infer gender from category if no gender is explicitly provided.
      if (!req.query.gender) {
        if (req.query.category.toLowerCase().includes("men")) {
          queryFilter.gender = { $regex: /^men$/i };
        } else if (req.query.category.toLowerCase().includes("women")) {
          queryFilter.gender = { $regex: /^women$/i };
        }
      }
    }

    // Always add gender filter if provided.
    if (req.query.gender) {
      queryFilter.gender = { $regex: new RegExp(`^${req.query.gender}$`, "i") };
    }

    // Loop over additional filters (ignoring sort, category, & gender now)
    for (const key in req.query) {
      if (key !== 'category' && key !== 'sort' && key !== 'gender' && key !== 'id') {
        const values = req.query[key].split(',');
        if (key === 'brands') {
          queryFilter.brand = { $in: values };
        } else {
          queryFilter[`attributes.${key}`] = {
            $in: values.map(val => new RegExp(`(^|,)\\s*${val}\\s*(,|$)`, "i"))
          };
        }
      }
    }

    // Build and sort the query.
    let query;
    if (req.query.id) {
      // If we're fetching by id, use findOne.
      query = Product.findOne(queryFilter);
    } else {
      query = Product.find(queryFilter);
    }
    
    if (req.query.sort) {
      const sortValue = req.query.sort;
      if (sortValue === 'Price: Low to High') {
        query = query.sort({ price: 1 });
      } else if (sortValue === 'Price: High to Low') {
        query = query.sort({ price: -1 });
      } else if (sortValue === 'New Arrivals') {
        query = query.sort({ createdAt: -1 });
      }
    }

    const result = await query;
    // If an id was provided but no product was found, return 404.
    if (req.query.id && !result) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching public products", error: error.message });
  }
});


// Admin route: Returns only the products posted by the logged‑in admin (with filtering and sorting)
const getAdminProducts = asyncHandler(async (req, res) => {
  try {
    const queryFilter = { admin: req.user.id };

    if (req.query.category) {
      queryFilter.category = req.query.category;
    }

    for (const key in req.query) {
      if (key !== 'category' && key !== 'sort') {
        const values = req.query[key].split(',');
        if (key === 'brands') {
          queryFilter.brand = { $in: values };
        } else {
          // You may update the regex here similarly if needed:
          queryFilter[`attributes.${key}`] = {
            $in: values.map(val => new RegExp(`(^|,)\\s*${val}\\s*(,|$)`, "i"))
          };
        }
      }
    }

    let query = Product.find(queryFilter);

    if (req.query.sort) {
      const sortValue = decodeURIComponent(req.query.sort);
      if (sortValue === 'Price: Low to High') {
        query = query.sort({ price: 1 });
      } else if (sortValue === 'Price: High to Low') {
        query = query.sort({ price: -1 });
      } else if (sortValue === 'New Arrivals') {
        query = query.sort({ createdAt: -1 });
      }
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin products", error: error.message });
  }
});

// Create a new product.
// Create a new product.
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      category,
      gender,
      price,
      brand,
      stock,
      description,
      features,
      careInstructions,
      attributes,
      colors, // Now a comma separated string e.g. "#ff0000,#00ff00"
    } = req.body;

    if (!name || !category || !gender || !price || !stock || !req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Missing required fields or images.' });
    }

    const featuresArray = features ? features.split(',').map(item => item.trim()) : [];
    const careInstructionsArray = careInstructions ? careInstructions.split(',').map(item => item.trim()) : [];
    const images = req.files.map(file => file.path);
    const attributesObject = attributes ? JSON.parse(attributes) : {};
    // Convert the comma separated colors into an array of objects.
    const colorsArray = colors
      ? colors.split(',').map(c => ({ name: c.trim(), additionalPrice: 0 }))
      : [];

    const productData = {
      name,
      category,
      gender,
      price: parseFloat(price),
      brand,
      stock: parseInt(stock, 10),
      description,
      features: featuresArray,
      careInstructions: careInstructionsArray,
      images,
      attributes: attributesObject,
      colors: colorsArray,
      admin: req.user.id,
      shop: req.user.shopId || null,
    };

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});



// In your updateProduct controller
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.user.role !== 'superadmin' && product.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this product." });
    }

    const {
      name,
      category,
      gender,
      price,
      brand,
      stock,
      description,
      features,
      careInstructions,
      attributes,
      colors, // Now a comma separated string
    } = req.body;

    const featuresArray = features ? features.split(',').map(item => item.trim()) : [];
    const careInstructionsArray = careInstructions ? careInstructions.split(',').map(item => item.trim()) : [];
    const images = (req.files && req.files.length > 0)
      ? req.files.map(file => file.path)
      : product.images;
    const attributesObject = attributes ? JSON.parse(attributes) : {};
    const colorsArray = colors 
      ? colors.split(',').map(c => ({ name: c.trim(), additionalPrice: 0 }))
      : product.colors;

    product.name = name || product.name;
    product.category = category || product.category;
    product.gender = gender || product.gender;
    product.price = price ? parseFloat(price) : product.price;
    product.brand = brand || product.brand;
    product.stock = stock ? parseInt(stock, 10) : product.stock;
    product.description = description || product.description;
    product.features = featuresArray.length ? featuresArray : product.features;
    product.careInstructions = careInstructionsArray.length ? careInstructionsArray : product.careInstructions;
    product.images = images;
    product.attributes = Object.keys(attributesObject).length ? attributesObject : product.attributes;
    product.colors = colorsArray;

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});



// Delete a product.
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.user.role !== 'superadmin' && product.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this product." });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});

const getFilterOptions = asyncHandler(async (req, res) => {
  try {
    const { gender, category } = req.query;
    const match = {};

    // Only add a category filter if provided and not "all"
    if (category && category !== "all") {
      // Use a case-insensitive regex for category matching
      match.category = { $regex: new RegExp(`^${category}$`, "i") };

      // If gender is provided, use it; otherwise, infer gender from category.
      if (gender) {
        match.gender = { $regex: new RegExp(`^${gender}$`, "i") };
      } else {
        if (category.toLowerCase().startsWith("mens")) {
          match.gender = { $regex: /^men$/i };
        } else {
          match.gender = { $regex: /^women$/i };
        }
      }
    } else {
      // If no category filter or "all" is specified, still filter by gender if provided.
      if (gender) {
        match.gender = { $regex: new RegExp(`^${gender}$`, "i") };
      }
    }

    // Retrieve products based on the refined filters.
    const products = await Product.find(match);
    const options = {};

    products.forEach(product => {
      // Process brands using the key "brands"
      if (product.brand) {
        options.brands = options.brands || new Set();
        product.brand.split(',').forEach(b => {
          options.brands.add(b.trim());
        });
      }
      // Process other attributes (for example, color, size, etc.)
      if (product.attributes) {
        if (typeof product.attributes.entries === "function") {
          for (let [key, value] of product.attributes.entries()) {
            if (value) {
              // Skip any attribute you don’t want (e.g. price if not needed here)
              if (key.toLowerCase() === "price") continue;
              options[key] = options[key] || new Set();
              value.split(',').forEach(val => {
                options[key].add(val.trim());
              });
            }
          }
        } else {
          Object.entries(product.attributes).forEach(([key, value]) => {
            if (value) {
              if (key.toLowerCase() === "price") return;
              options[key] = options[key] || new Set();
              value.split(',').forEach(val => {
                options[key].add(val.trim());
              });
            }
          });
        }
      }
    });

    // Add static sort options for price and new arrivals.
    // (Sort options here are constant; if you want to change their availability,
    // you can remove this section.)
    options.sort = new Set(["Price: Low to High", "Price: High to Low", "New Arrivals"]);

    // Convert each Set into an Array for frontend usage.
    const result = {};
    for (let key in options) {
      result[key] = Array.from(options[key]);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching filter options", error: error.message });
  }
});



module.exports = { 
  getPublicProducts, 
  getAdminProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFilterOptions  
};
