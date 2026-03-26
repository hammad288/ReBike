const express = require("express");
const router = express.Router();
const Bike = require("../models/Bike");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");

// Multer — store files in memory, convert to base64 for DB storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// ================= PUBLIC ROUTES =================

// GET all approved bikes (public)
router.get("/approved", async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'approved' })
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN ROUTES =================
// NOTE: These MUST be defined before GET /:id to avoid the wildcard catching them first.

// GET all bikes (admin only)
router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({})
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending bikes (admin only)
router.get("/admin/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'pending' })
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET approved bikes (admin only)
router.get("/admin/approved", verifyToken, isAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'approved' })
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET rejected bikes (admin only)
router.get("/admin/rejected", verifyToken, isAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'rejected' })
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APPROVE bike (admin only)
router.put("/admin/approve/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: null },
      { new: true }
    );
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json({ message: "Bike approved successfully", bike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REJECT bike (admin only)
router.put("/admin/reject/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'No reason provided' },
      { new: true }
    );
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json({ message: "Bike rejected", bike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE bike (admin only)
router.delete("/admin/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE bike (admin only)
router.post("/admin/create", verifyToken, isAdmin, upload.array("images", 10), async (req, res) => {
  try {
    const { brand, model, year, price, kmDriven, location, condition, description } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => {
        const base64 = file.buffer.toString("base64");
        return `data:${file.mimetype};base64,${base64}`;
      });
    }

    const sellerId = req.user._id || req.user.id;

    const bike = new Bike({
      seller: sellerId,
      brand,
      model,
      year: Number(year),
      price: Number(price),
      kmDriven: Number(kmDriven),
      location,
      condition,
      description,
      images,
      status: 'approved',
    });

    await bike.save();
    res.json({ success: true, message: "Bike created successfully", bike });
  } catch (error) {
    console.error("Admin create bike error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE bike (admin only)
router.put("/admin/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { brand, model, year, price, kmDriven, location, condition, description, status } = req.body;
    const bike = await Bike.findByIdAndUpdate(
      req.params.id,
      { brand, model, year, price, kmDriven, location, condition, description, status },
      { new: true }
    );
    if (!bike) {
      return res.status(404).json({ success: false, message: "Bike not found" });
    }
    res.json({ success: true, message: "Bike updated successfully", bike });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= PUBLIC — SINGLE BIKE (must be LAST to avoid catching /admin/* routes) =================

// GET single bike by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate("seller", "name email");
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.json({ success: true, bike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
