const mongoose = require('mongoose');

const AdSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // <-- New category field
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);


module.exports = mongoose.model('Ad', AdSchema);
