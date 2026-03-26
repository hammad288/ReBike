const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email }).select("-password");

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Use provided role or default to 'user'
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userWithPassword = await User.findOne({ email });
    if (!userWithPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: userWithPassword._id, role: userWithPassword.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const user = await User.findById(userWithPassword._id).select("-password");

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= ADMIN AUTH CHECK =================
router.get("/admin-auth", require("../middleware/authMiddleware").verifyToken, (req, res) => {
  if (req.user.role === "admin") {
    res.status(200).json({ ok: true });
  } else {
    res.status(403).json({ ok: false, message: "Not authorized as admin" });
  }
});

// ================= SELLER AUTH CHECK =================
router.get("/seller-auth", require("../middleware/authMiddleware").verifyToken, (req, res) => {
  if (req.user.role === "seller") {
    res.status(200).json({ ok: true });
  } else {
    res.status(403).json({ ok: false, message: "Not authorized as seller" });
  }
});

// ================= USER AUTH CHECK =================
router.get("/user-auth", require("../middleware/authMiddleware").verifyToken, (req, res) => {
  if (req.user.role === "user") {
    res.status(200).json({ ok: true });
  } else {
    res.status(403).json({ ok: false, message: "Not authorized as user" });
  }
});

// ================= ADMIN: DASHBOARD STATS =================
router.get(
  "/stats",
  require("../middleware/authMiddleware").verifyToken,
  require("../middleware/authMiddleware").isAdmin,
  async (req, res) => {
    try {
      const Bike = require("../models/Bike");

      const [totalUsers, totalBikes, pendingBikes, approvedBikes, rejectedBikes] =
        await Promise.all([
          User.countDocuments(),
          Bike.countDocuments(),
          Bike.countDocuments({ status: "pending" }),
          Bike.countDocuments({ status: "approved" }),
          Bike.countDocuments({ status: "rejected" }),
        ]);

      const totalSellers = await User.countDocuments({ role: "seller" });
      const totalAdmins = await User.countDocuments({ role: "admin" });

      res.json({
        success: true,
        stats: {
          totalUsers,
          totalSellers,
          totalAdmins,
          totalBikes,
          pendingBikes,
          approvedBikes,
          rejectedBikes,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= ADMIN: GET ALL USERS =================
router.get(
  "/users",
  require("../middleware/authMiddleware").verifyToken,
  require("../middleware/authMiddleware").isAdmin,
  async (req, res) => {
    try {
      const users = await User.find({}).select("-password").sort({ createdAt: -1 });
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= ADMIN: UPDATE USER ROLE =================
router.patch(
  "/users/:id/role",
  require("../middleware/authMiddleware").verifyToken,
  require("../middleware/authMiddleware").isAdmin,
  async (req, res) => {
    try {
      const { role } = req.body;
      if (!["user", "seller", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ================= ADMIN: DELETE USER =================
router.delete(
  "/users/:id",
  require("../middleware/authMiddleware").verifyToken,
  require("../middleware/authMiddleware").isAdmin,
  async (req, res) => {
    try {
      // Prevent deleting yourself
      if (req.user.id === req.params.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
