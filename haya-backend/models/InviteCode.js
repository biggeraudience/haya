const mongoose = require("mongoose");

const inviteCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperAdmin", required: true },
    // Fields to be filled when an admin uses the code:
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    adminEmail: { type: String },
    adminName: { type: String },
    brand: { type: String },
    departments: { type: String }, // or an array if preferred: [String]
    dateJoined: { type: Date },
    role: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InviteCode", inviteCodeSchema);
