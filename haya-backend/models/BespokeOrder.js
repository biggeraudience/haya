const mongoose = require('mongoose');

const measurementSubSchema = new mongoose.Schema({
  value: { type: String, required: false },
  fit: { type: [String], default: [] }
}, { _id: false });

const bespokeOrderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    // Optionally reference a product; set to required: true if needed
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: false 
    },
    // Fabric details
    fabricType: { type: String, required: true },
    fabricColor: { type: String, required: true },
    fabricPattern: { type: String, required: true },
    // Gender field added so we know which measurement configuration to use
    gender: { type: String, required: true },
    // Measurements stored as a Map with measurement name as key
    measurements: { 
      type: Map, 
      of: measurementSubSchema,
      required: true 
    },
    // Merged additional notes
    notes: { type: String },
    // Media files (images or videos) URLs
    media: [String],
    // Order status
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BespokeOrder', bespokeOrderSchema);
