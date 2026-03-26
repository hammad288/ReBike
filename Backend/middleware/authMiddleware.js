const jwt = require("jsonwebtoken");

// Verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Check if user is seller
const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({ message: "Access denied. Seller only." });
  }
  next();
};

// Check if user is seller OR admin
const isSellerOrAdmin = (req, res, next) => {
  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Seller or Admin only." });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isSeller, isSellerOrAdmin };
