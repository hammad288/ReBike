const express = require("express");
const router = express.Router();
const Bike = require("../models/Bike");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");

// Multer — store files in memory, convert to base64 for DB storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// ================= PUBLIC ROUTES =================

// GET all approved bikes (public) — supports filtering and pagination
router.get("/approved", async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 12;
    const skip   = (page - 1) * limit;

    // Build filter query
    const filter = { status: 'approved' };

    if (req.query.brand) {
      filter.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
    }
    if (req.query.search) {
      const s = req.query.search;
      filter.$or = [
        { brand: { $regex: s, $options: 'i' } },
        { model: { $regex: s, $options: 'i' } },
      ];
    }
    if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
      filter.price = {};
      if (req.query.minPrice !== undefined) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice !== undefined) filter.price.$lte = Number(req.query.maxPrice);
    }

    const totalCount = await Bike.countDocuments(filter);
    const bikes = await Bike.find(filter)
      .slice('images', 1)
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      bikes,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN ROUTES =================
// NOTE: These MUST be defined before GET /:id to avoid the wildcard catching them first.

// GET all bikes (admin only) — no images sent by default, admin table doesn't need them
// Pass ?withImages=true&page=1&limit=12 for card view that needs images
router.get("/admin/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const withImages = req.query.withImages === 'true';
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 1000; // default: all (no pagination) for table view
    const skip  = (page - 1) * limit;

    const totalCount = await Bike.countDocuments({});
    let query = Bike.find({}).populate("seller", "name email").sort({ createdAt: -1 });

    if (withImages) {
      query = query.slice('images', 1).skip(skip).limit(limit);
    } else {
      query = query.select('-images');
    }

    const bikes = await query;
    res.json({ success: true, bikes, totalCount, currentPage: page, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET pending bikes (admin only)
router.get("/admin/pending", verifyToken, isAdmin, async (req, res) => {
  try {
    const bikes = await Bike.find({ status: 'pending' })
      .select('-images')
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
      .select('-images')
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
      .select('-images')
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
      { returnDocument: 'after' }
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
      { returnDocument: 'after' }
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
      { returnDocument: 'after' }
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
