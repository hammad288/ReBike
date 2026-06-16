const express = require("express");
const router = express.Router();
const Bike = require("../models/Bike");
const { verifyToken, isSeller } = require("../middleware/authMiddleware");

// All routes require seller authentication
router.use(verifyToken, isSeller);

// ================= ADD NEW BIKE =================
router.post("/bikes", async (req, res) => {
  try {
    const { images } = req.body;

    // Backend validation — minimum 3, maximum 5 images
    if (!images || !Array.isArray(images) || images.length < 3 || images.length > 5) {
      return res.status(400).json({
        success: false,
        message: `Please upload at least 3 images of the product (max 5). You provided ${images?.length || 0}.`,
      });
    }

    const { brand, model, year, price, kmDriven, location, condition, description, images: imgs } = req.body;

    const bikeData = {
      brand,
      model,
      year: Number(year),
      price: Number(price),
      kmDriven: Number(kmDriven),
      location,
      condition,
      description,
      images: imgs,
      seller: req.user.id,
      status: 'pending',
    };

    const bike = new Bike(bikeData);
    await bike.save();

    res.status(201).json({
      success: true,
      message: "Bike added successfully. Waiting for admin approval.",
      bike,
    });
  } catch (error) {
    console.error('=== ADD BIKE 500 ERROR ===');
    console.error('Name:', error.name);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.errors) console.error('Validation:', JSON.stringify(error.errors));
    res.status(500).json({ success: false, message: error.message, name: error.name });
  }
});

// ================= GET SELLER'S OWN BIKES =================
router.get("/bikes", async (req, res) => {
  try {
    const bikes = await Bike.find({ seller: req.user.id })
      .select('-images')
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bikes.length,
      bikes,
    });
  } catch (error) {
    console.error('Get seller bikes error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// ================= GET SINGLE BIKE =================
router.get("/bikes/:id", async (req, res) => {

  try {
    const bike = await Bike.findOne({
      _id: req.params.id,
      seller: req.user.id, // Ensure seller can only view their own bikes
    }).populate("seller", "name email");

    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.json({ success: true, bike });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= UPDATE BIKE =================
router.put("/bikes/:id", async (req, res) => {
  try {
    const bike = await Bike.findOne({
      _id: req.params.id,
      seller: req.user.id, // Ensure seller can only update their own bikes
    });

    if (!bike) {
      return res.status(404).json({ message: "Bike not found or unauthorized" });
    }

    // Update bike fields — block protected fields that only admin can change
    const protectedKeys = ["seller", "verified", "status", "rejectionReason"];
    Object.keys(req.body).forEach((key) => {
      if (!protectedKeys.includes(key)) {
        bike[key] = req.body[key];
      }
    });

    await bike.save();

    res.json({
      message: "Bike updated successfully",
      bike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= DELETE BIKE =================
router.delete("/bikes/:id", async (req, res) => {
  try {
    const bike = await Bike.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id, // Ensure seller can only delete their own bikes
    });

    if (!bike) {
      return res.status(404).json({ message: "Bike not found or unauthorized" });
    }

    res.json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
