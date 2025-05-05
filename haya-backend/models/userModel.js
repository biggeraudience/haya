// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    role: { type: String, enum: ["user"], default: "user" },
    // Fields for regular users (e.g. orders, addresses, etc.) can go here.
    profile: {
      personalInfo: {
        firstName: { type: String },
        lastName: { type: String },
        phone: { type: String }
      },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
      },
      cards: [
        {
          cardHolder: { type: String },
          cardNumber: { type: String },
          expirationDate: { type: String },
          cvv: { type: String }
        }
      ]
    },
    activeSessions: [{ sessionId: String, createdAt: Date, expiresAt: Date }]
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!enteredPassword) {
    throw new Error("Password is required");
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
