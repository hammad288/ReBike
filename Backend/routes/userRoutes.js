const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Bike = require("../models/Bike");
const { verifyToken } = require("../middleware/authMiddleware");

// ================= UPDATE PROFILE =================
router.put("/profileUpdate", verifyToken, async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name) return res.json({ error: "Name is required" });
    if (!email) return res.json({ error: "Email is required" });
    if (password && password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters" });
    }

    // Build update object
    const updateData = { name, email, phone, address };

    // Only hash and update password if a new one was provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: 'after' }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// ================= PLACE ORDER =================
router.post("/placeOrder", verifyToken, async (req, res) => {
  try {
    const { bikeIds } = req.body;
    if (!bikeIds || bikeIds.length === 0) {
      return res.status(400).json({ error: "No bikes provided" });
    }

    const order = new Order({
      buyer: req.user.id,
      bikes: bikeIds,
      payment: { success: false, transactionId: null },
      status: "Not Processed",
    });

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

// ================= GET USER ORDERS =================
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("buyer", "name email")
      .populate("bikes")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

module.exports = router;
