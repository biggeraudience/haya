const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Make sure mongoose is imported and connected
const Product = require('../models/Product'); // Make sure your Product model is correctly defined

const getPublicProducts = asyncHandler(async (req, res) => {
  console.log("--- Start getPublicProducts ---"); // Add start log
  console.log("Request Query:", req.query); // Log the incoming query

  try {
    const queryFilter = {};
    console.log("Initial queryFilter:", queryFilter);

    // If an id is provided, add it to the filter.
    if (req.query.id) {
      // Ensure you are matching the _id exactly.
      // NOTE: If req.query.id is a string, Mongoose might need it cast to ObjectId.
      // Consider adding a check here:
        if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            console.warn("Invalid ObjectId provided:", req.query.id);
            // Decide how to handle invalid IDs for public fetch - maybe return 400 or just let the findOne return null
            // For now, we'll add it as is, but be aware this could be an issue if the ID isn't valid.
            queryFilter._id = req.query.id;
        } else {
             queryFilter._id = new mongoose.Types.ObjectId(req.query.id);
        }
    }
    console.log("QueryFilter after ID check:", queryFilter);


    // Only add a category filter if provided and not "all"
    if (req.query.category && req.query.category.toLowerCase() !== "all") {
      queryFilter.category = { $regex: new RegExp(`^<span class="math-inline">\{req\.query\.category\}</span>`, "i") };
        console.log("QueryFilter after category filter:", queryFilter);

      // Infer gender from category if no gender is explicitly provided.
      if (!req.query.gender) {
        if (req.query.category.toLowerCase().includes("men")) {
          queryFilter.gender = { $regex: /^men$/i };
          console.log("Inferred gender 'men':", queryFilter);
        } else if (req.query.category.toLowerCase().includes("women")) {
          queryFilter.gender = { $regex: /^women$/i };
          console.log("Inferred gender 'women':", queryFilter);
        }
      }
    }
    console.log("QueryFilter after category/inferred gender logic:", queryFilter);


    // Always add gender filter if provided.
    if (req.query.gender) {
      queryFilter.gender = { $regex: new RegExp(`^<span class="math-inline">\{req\.query\.gender\}</span>`, "i") };
       console.log("QueryFilter after explicit gender filter:", queryFilter);
    }
     // IMPORTANT: If both inferred gender and explicit gender are present,
     // the explicit gender check will overwrite the inferred one due to object property assignment.
     // This seems intended by the order of your code.
     console.log("QueryFilter after all gender logic:", queryFilter);


    // Loop over additional filters (ignoring sort, category, & gender now)
     console.log("Processing additional filters...");
    for (const key in req.query) {
      if (key !== 'category' && key !== 'sort' && key !== 'gender' && key !== 'id') {
        const values = req.query[key].split(',');
         console.log(`Processing filter key '${key}' with values:`, values);
        if (key === 'brands') {
          queryFilter.brand = { $in: values };
           console.log("Added brand filter:", queryFilter);
        } else {
          // You may update the regex here similarly if needed:
          queryFilter[`attributes.${key}`] = {
            $in: values.map(val => new RegExp(`(^|,)\\s*<span class="math-inline">\{val\}\\\\s\*\(,\|</span>)`, "i"))
          };
           console.log(`Added attribute filter for '${key}':`, queryFilter);
        }
      }
    }

    console.log("Final queryFilter before query execution:", queryFilter);

    // Build and sort the query.
    let query;
    if (req.query.id) {
      console.log("Using findOne for ID query");
      query = Product.findOne(queryFilter);
    } else {
      console.log("Using find for multiple products");
      query = Product.find(queryFilter);
    }

    if (req.query.sort) {
      console.log("Applying sort:", req.query.sort);
      const sortValue = req.query.sort;
      if (sortValue === 'Price: Low to High') {
        query = query.sort({ price: 1 });
      } else if (sortValue === 'Price: High to Low') {
        query = query.sort({ price: -1 });
      } else if (sortValue === 'New Arrivals') {
        query = query.sort({ createdAt: -1 });
      }
       console.log("Query after sort applied:", query);
    } else {
        console.log("No sort applied.");
    }


    console.log("Executing database query...");
    const result = await query;
    console.log("Database query executed. Result:", result); // Log the result

    // If an id was provided but no product was found, return 404.
    if (req.query.id && !result) {
      console.log("Product not found for ID query");
      return res.status(404).json({ message: "Product not found." });
    }

    console.log("Sending 200 response.");
    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Error in getPublicProducts catch block:", error); // The crucial error log
    // Your existing error handling response
    res.status(500).json({ message: "Error fetching public products", error: error.message });
  }
  console.log("--- End getPublicProducts ---"); // Add end log
});

// ... rest of productController.js (getAdminProducts, etc.) ...

module.exports = {
  getPublicProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilterOptions
};
