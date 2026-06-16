const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  { id: "64abcdef1234567890abcdef", role: "seller" },
  process.env.JWT_SECRET || "123"
);

async function run() {
  try {
    const hugeString = "a".repeat(200 * 1024); // 200 KB
    const res = await axios.post(
      "http://localhost:5000/api/seller/bikes",
      {
        brand: "Honda",
        model: "CBR",
        year: "2021",
        price: "50000",
        kmDriven: "10000",
        location: "Mumbai",
        condition: "excellent",
        description: "Test",
        images: ["data:image/jpeg;base64," + hugeString, "data:image/jpeg;base64," + hugeString, "data:image/jpeg;base64," + hugeString]
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("SUCCESS:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("ERROR STATUS:", err.response.status);
      console.log("ERROR DATA:", err.response.data);
    } else {
      console.log("ERROR:", err.message);
    }
  }
}

run();
