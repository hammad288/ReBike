const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const dns = require("dns");
// Set fallback DNS servers (Google/Cloudflare) for Node.js SRV queries on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    if (err.code === 'ENOTFOUND' || err.message.includes('querySrv')) {
      console.error("\n[Tip] DNS resolution failed for MongoDB Atlas URL.");
      console.error("1. Check if your MongoDB Atlas cluster is paused or active at https://cloud.mongodb.com/");
      console.error("2. Or use local MongoDB in .env: MONGO_URI=mongodb://127.0.0.1:27017/rebike\n");
    }
  });

// Routes
app.use("/api/auth", require("./routes/authRouters"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/bikes", require("./routes/bikeRouters"));
app.use("/api/brand", require("./routes/brandRouters"));
app.use("/api/braintree", require("./routes/braintreeRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/verification", require("./routes/verificationRoutes"));

app.get("/", (req, res) => {
  res.send("ReBike API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

