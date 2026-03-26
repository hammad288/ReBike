const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bike",
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "card", "paypal", "googlepay", "applepay", "venmo", "online"],
      default: "COD",
    },
    payment: {
      success: { type: Boolean, default: false },
      transactionId: { type: String, default: null },
      transactionDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
    status: {
      type: String,
      default: "Not Processed",
      enum: ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
