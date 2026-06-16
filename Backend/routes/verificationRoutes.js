const express = require("express");
const router = express.Router();
const Verification = require("../models/Verification");
const Bike = require("../models/Bike");
const { verifyToken, isSeller, isAdmin } = require("../middleware/authMiddleware");

// ──────────────────────────────────────────────
// SELLER ROUTES
// ──────────────────────────────────────────────

// POST /api/verification
// Submit or re-submit verification documents for a bike
router.post("/", verifyToken, isSeller, async (req, res) => {
  try {
    const {
      bike,
      ownerName,
      rcNumber,
      vehicleRegNumber,
      chassisNumber,
      engineNumber,
      vehicleBrand,
      vehicleModel,
      yearOfRegistration,
      govtIdType,
      govtIdNumber,
      rcFront,
      rcBack,
      insuranceCert,
      pucCert,
      bikeFront,
      bikeBack,
      bikeLeft,
      bikeRight,
      declarationAccepted,
    } = req.body;

    // Ensure the bike belongs to this seller
    const bikeDoc = await Bike.findOne({ _id: bike, seller: req.user.id });
    if (!bikeDoc) {
      return res.status(404).json({
        success: false,
        message: "Bike not found or you are not the owner.",
      });
    }

    // If a previous verification exists for this bike, replace it (re-submission)
    const existing = await Verification.findOne({ bike });
    if (existing) {
      // Reset status back to pending on re-submission
      await Verification.deleteOne({ bike });
    }

    const verification = new Verification({
      bike,
      seller: req.user.id,
      ownerName,
      rcNumber,
      vehicleRegNumber,
      chassisNumber,
      engineNumber,
      vehicleBrand,
      vehicleModel,
      yearOfRegistration: Number(yearOfRegistration),
      govtIdType,
      govtIdNumber,
      rcFront,
      rcBack,
      insuranceCert,
      pucCert: pucCert || "",
      bikeFront,
      bikeBack,
      bikeLeft,
      bikeRight,
      declarationAccepted,
      status: "pending",
      rejectionReason: "",
    });

    await verification.save();

    res.status(201).json({
      success: true,
      message: "Verification documents submitted successfully. Awaiting admin review.",
      verification: {
        _id: verification._id,
        bike: verification.bike,
        status: verification.status,
        createdAt: verification.createdAt,
      },
    });
  } catch (error) {
    console.error("Verification submit error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/verification/my
// Get all verifications submitted by the logged-in seller
router.get("/my", verifyToken, isSeller, async (req, res) => {
  try {
    const verifications = await Verification.find({ seller: req.user.id })
      .select("-rcFront -rcBack -insuranceCert -pucCert -bikeFront -bikeBack -bikeLeft -bikeRight") // exclude heavy images in list
      .populate("bike", "brand model year status")
      .sort({ createdAt: -1 });

    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/verification/my/:bikeId
// Get verification status for a specific bike
router.get("/my/:bikeId", verifyToken, isSeller, async (req, res) => {
  try {
    const verification = await Verification.findOne({
      bike: req.params.bikeId,
      seller: req.user.id,
    }).select("-rcFront -rcBack -insuranceCert -pucCert -bikeFront -bikeBack -bikeLeft -bikeRight");

    if (!verification) {
      return res.json({ success: true, verification: null });
    }

    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ──────────────────────────────────────────────
// ADMIN ROUTES
// ──────────────────────────────────────────────

// GET /api/verification/admin/all
// Get all verifications (light list — no images)
router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const verifications = await Verification.find()
      .select("-rcFront -rcBack -insuranceCert -pucCert -bikeFront -bikeBack -bikeLeft -bikeRight")
      .populate("seller", "name email phone")
      .populate("bike", "brand model year status")
      .sort({ createdAt: -1 });

    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/verification/admin/:id
// Get single verification with all document images (for detail modal)
router.get("/admin/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const verification = await Verification.findById(req.params.id)
      .populate("seller", "name email phone")
      .populate("bike", "brand model year status");

    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/verification/admin/verify/:id
// Approve a verification
router.put("/admin/verify/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const verification = await Verification.findByIdAndUpdate(
      req.params.id,
      { status: "verified", rejectionReason: "", reviewedAt: new Date() },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, message: "Verification approved.", verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/verification/admin/reject/:id
// Reject a verification
router.put("/admin/reject/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const verification = await Verification.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        rejectionReason: reason || "No reason provided.",
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ success: false, message: "Verification not found." });
    }

    res.json({ success: true, message: "Verification rejected.", verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
