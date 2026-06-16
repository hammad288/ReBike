const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Bike  = require("../models/Bike");
const User  = require("../models/User");
const { sendBuyerSMS, sendSellerSMS, sendAdminSMS } = require("../services/smsService");

// POST /api/orders/place-order - Place a COD order
router.post("/place-order", verifyToken, async (req, res) => {
  try {
    const { bikeIds } = req.body;

    if (!bikeIds || bikeIds.length === 0) {
      return res.status(400).json({ success: false, error: "No bikes provided" });
    }

    // Verify bikes exist + populate seller info
    const bikes = await Bike.find({ _id: { $in: bikeIds } }).populate("seller", "name phone");

    if (bikes.length === 0) {
      return res.status(404).json({ success: false, error: "Bikes not found" });
    }

    // Create order
    const order = new Order({
      buyer: req.user.id,
      bikes: bikeIds,
      payment: { success: false, transactionId: null },
      status: "Not Processed",
    });

    await order.save();

    // ── Send SMS notifications (non-blocking — runs after response) ────────
    setImmediate(async () => {
      try {
        // Fetch buyer + all admins in parallel
        const [buyer, admins] = await Promise.all([
          User.findById(req.user.id).select("name phone"),
          User.find({ role: "admin" }).select("name phone"),
        ]);

        const bike      = bikes[0];
        const bikeName  = bike ? `${bike.brand} ${bike.model}` : "a bike";
        const seller    = bike?.seller;      // populated above
        const buyerName = buyer?.name  || "A user";
        const buyerPhone= buyer?.phone || "";

        // Run all SMS sends in parallel — failure of one doesn't stop others
        const tasks = [];

        // 1️⃣ Buyer SMS
        if (buyer?.phone) {
          tasks.push(
            sendBuyerSMS(buyer.phone, bikeName, order._id.toString())
              .then(() => console.log("✅ Buyer SMS sent"))
              .catch(e => console.error("❌ Buyer SMS failed:", e.message))
          );
        }

        // 2️⃣ Seller SMS
        if (seller?.phone) {
          tasks.push(
            sendSellerSMS(seller.phone, bikeName, buyerName, buyerPhone)
              .then(() => console.log("✅ Seller SMS sent"))
              .catch(e => console.error("❌ Seller SMS failed:", e.message))
          );
        } else {
          console.log("⚠️ Seller phone not found — seller SMS skipped");
        }

        // 3️⃣ Admin SMS (all admins)
        if (admins?.length > 0) {
          admins.forEach(admin => {
            if (admin.phone) {
              tasks.push(
                sendAdminSMS(admin.phone, bikeName, buyerName, seller?.name || "Unknown Seller")
                  .then(() => console.log(`✅ Admin SMS sent to ${admin.name}`))
                  .catch(e => console.error(`❌ Admin SMS failed for ${admin.name}:`, e.message))
              );
            }
          });
        } else {
          console.log("⚠️ No admins found — admin SMS skipped");
        }

        await Promise.allSettled(tasks);
        console.log("📱 All SMS notifications processed");
      } catch (smsErr) {
        console.error("❌ SMS notification block error:", smsErr.message);
      }
    });
    // ── End SMS block ──────────────────────────────────────────────────────

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// GET /api/orders/all - Admin: get all orders with buyer + bike data
router.get("/all", verifyToken, require("../middleware/authMiddleware").isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("buyer", "name email")
      .populate("bikes", "brand model year price")  // no images — saves huge bandwidth
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/orders/:id/status - Admin: update order status
router.patch("/:id/status", verifyToken, require("../middleware/authMiddleware").isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;