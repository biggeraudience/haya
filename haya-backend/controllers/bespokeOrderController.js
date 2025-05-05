const asyncHandler = require('express-async-handler');
const BespokeOrder = require('../models/BespokeOrder');

const createBespokeOrder = asyncHandler(async (req, res) => {
  try {
    // Destructure fields from request body
    const { fabricType, fabricColor, fabricPattern, gender, measurements, additionalNotes, productId } = req.body;
    
    // Validate required fields
    if (!fabricType || !fabricColor || !fabricPattern || !gender || !measurements) {
      return res.status(400).json({ message: "Missing required fields for bespoke order" });
    }
    
    // Map uploaded files (if any)
    const media = req.files ? req.files.map(file => file.path) : [];
    
    // Build the order data
    const orderData = {
      user: req.user.id, // assuming the user is authenticated
      fabricType,
      fabricColor,
      fabricPattern,
      gender,
      measurements, // measurements as an object with keys and { value, fit? }
      notes: additionalNotes,
      media,
    };
    
    if (productId) {
      orderData.product = productId;
    }
    
    // Create and save the order
    const newOrder = new BespokeOrder(orderData);
    const savedOrder = await newOrder.save();
    
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating bespoke order", error: error.message });
  }
});

module.exports = { createBespokeOrder };
