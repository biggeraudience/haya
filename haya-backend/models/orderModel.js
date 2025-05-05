// models/orderModel.js
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    color: { type: String },
    brand: { type: String },
    size: { type: String },
    length: { type: Number },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const trackingSchema = new mongoose.Schema(
  {
    carrier: { type: String },
    trackingNumber: { type: String },
    estimatedDelivery: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
    orderStatus: {
      type: String,
      enum: ["PROCESSING", "ON IT'S WAY!", "PENDING", "DELIVERED", "DECLINED", "RETURNED"],
      default: "PROCESSING",
    },
    tracking: trackingSchema,
    // Added deliveryAddress for admin to see shipping info
    deliveryAddress: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    this.orderId = "ORD_" + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
