const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    googleId: { type: String, required: true, unique: true, select: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
