const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const suggestionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const crapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minLength: 3, maxLength: 255 },
    description: { type: String, required: true, minLength: 3, maxLength: 255 },
    location: { type: pointSchema, required: true },
    images: {
      type: [String],
      validate: [(urls) => urls.length > 0, "empty!! Please insert an image"],
    },
    status: {
      type: String,
      enum: [
        "available",
        "interested",
        "scheduled",
        "agree",
        "disagree",
        "reset",
        "flush",
      ],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    suggestion: { type: suggestionSchema },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crap", crapSchema);
