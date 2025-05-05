// src/models/Product.js
const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "#ff0000"
  additionalPrice: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    gender: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    features: [String],
    careInstructions: [String],
    images: [String],
    attributes: { type: Map, of: String },
    colors: [colorSchema], // <-- NEW field for colors
    admin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Admin', 
      required: true 
    },
    shop: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Shop' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
