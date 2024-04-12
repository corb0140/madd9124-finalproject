const mongoose = require("mongoose");

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: [(coord) => coord.length === 2],
    },
  },
  { _id: false }
);

pointSchema.index({ coordinates: "2dsphere" });

const suggestionSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
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
      enum: ["AVAILABLE", "INTERESTED", "SCHEDULED", "AGREED", "FLUSHED"],

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

crapSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Crap", crapSchema);
