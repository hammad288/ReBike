const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
    },
    kmDriven: {
      type: Number,
    },
    fuelType: {
      type: String,
    },
    owner: {
      type: String,
    },
    location: {
      type: String,
    },
    condition: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

// 🔥 INDEXES — speed up all bike queries
bikeSchema.index({ createdAt: -1 });
bikeSchema.index({ seller: 1, createdAt: -1 });
bikeSchema.index({ status: 1, createdAt: -1 }); // most used: filter by status + sort by date

module.exports = mongoose.models.Bike || mongoose.model("Bike", bikeSchema);