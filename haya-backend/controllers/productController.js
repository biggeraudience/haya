// ~/haya-backend/controllers/productController.js
const getPublicProducts = async (req, res) => {
  try {
    const { id, category, gender, sort } = req.query;
    const filter = {};

    if (id) {
      filter._id = { "$oid": id };
    }

    if (category && category.toLowerCase() !== "all") {
      filter.category = { "$regex": category, "$options": "i" };
    }

    if (gender) {
      filter.gender = { "$regex": gender, "$options": "i" };
    }

    // Build the body for find or findOne
    const body = { filter };
    if (!id && sort) {
      body.sort = sort === "Price: Low to High"
        ? { price: 1 }
        : sort === "Price: High to Low"
          ? { price: -1 }
          : sort === "New Arrivals"
            ? { createdAt: -1 }
            : undefined;
    }

    const action = id ? "findOne" : "find";
    const apiRes = await req.db.call(action, body);

    if (apiRes.error) {
      console.error("Atlas Data API error:", apiRes.error);
      return res.status(502).json({ message: "Database API error", error: apiRes.error });
    }

    const docs = apiRes.documents || apiRes.document;
    if (id && !docs) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(docs);
  } catch (err) {
    console.error("❌ Error in getPublicProducts:", err);
    res.status(500).json({ message: "Error fetching public products", error: err.message });
  }
};

module.exports = {
  getPublicProducts,
  // … your other exports (getAdminProducts, createProduct, etc.)
};
