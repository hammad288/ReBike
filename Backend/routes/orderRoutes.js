const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Bike = require("../models/Bike");

// POST /api/orders/place - Place a COD order
router.post("/place", verifyToken, async (req, res) => {
  try {
    const { bikeIds } = req.body;

    if (!bikeIds || bikeIds.length === 0) {
      return res.status(400).json({ success: false, error: "No bikes provided" });
    }

    // Verify bikes exist
    const bikes = await Bike.find({ _id: { $in: bikeIds } });
    if (bikes.length === 0) {
      return res.status(404).json({ success: false, error: "Bikes not found" });
    }

    const order = new Order({
      buyer: req.user.id,
      bikes: bikeIds,
      payment: {
        success: false,
        transactionId: null,
      },
      status: "Not Processed",
    });

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    console.log("Place order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
