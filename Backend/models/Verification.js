const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
      unique: true, // one verification per bike listing
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Owner & Vehicle Details ──
    ownerName: { type: String, required: true, trim: true },
    rcNumber: { type: String, required: true, trim: true },
    vehicleRegNumber: { type: String, required: true, trim: true },
    chassisNumber: { type: String, required: true, trim: true },
    engineNumber: { type: String, required: true, trim: true },
    vehicleBrand: { type: String, required: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    yearOfRegistration: { type: Number, required: true },
    govtIdType: {
      type: String,
      required: true,
      enum: ["Aadhaar", "PAN", "Driving License"],
    },
    govtIdNumber: { type: String, required: true, trim: true },

    // ── Document Images (base64) ──
    rcFront: { type: String, required: true },
    rcBack: { type: String, required: true },
    insuranceCert: { type: String, required: true },
    pucCert: { type: String, default: "" }, // optional

    // ── Bike Photos ──
    bikeFront: { type: String, required: true },
    bikeBack: { type: String, required: true },
    bikeLeft: { type: String, required: true },
    bikeRight: { type: String, required: true },

    // ── Legal ──
    declarationAccepted: {
      type: Boolean,
      required: true,
      validate: {
        validator: (v) => v === true,
        message: "Declaration must be accepted.",
      },
    },

    // ── Admin Decision ──
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// Speed up admin list queries
verificationSchema.index({ status: 1, createdAt: -1 });
verificationSchema.index({ seller: 1, createdAt: -1 });

module.exports =
  mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);
