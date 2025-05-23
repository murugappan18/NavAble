const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // New field
  description: { type: String }, // Optional
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  facilities: [{ type: String }],
  photos: [{ type: String }], // For storing file paths or URLs
  status: { type: String, enum: ["pending", "approved"], default: "pending" },
});

module.exports = mongoose.model("Place", placeSchema);