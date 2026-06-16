const axios = require("axios");

// ── Helper: clean + validate Indian phone number ───────────────────────────
const formatPhone = (phone) => {
  if (!phone) return null;
  let p = phone.trim().replace(/\D/g, ""); // strip non-digits
  if (p.startsWith("91") && p.length === 12) p = p.slice(2); // remove country code
  return p.length === 10 ? p : null;
};

// ── Core sender (used internally) ─────────────────────────────────────────
const sendSMS = async (phone, message) => {
  const formatted = formatPhone(phone);
  if (!formatted) {
    console.log("❌ Invalid/missing phone — SMS skipped:", phone);
    return false;
  }

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: formatted,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (response.data.return === true) {
      console.log(`✅ SMS sent to ${formatted}`);
      return true;
    } else {
      console.log("❌ Fast2SMS error:", response.data);
      return false;
    }
  } catch (err) {
    console.error("❌ SMS send failed:", err.message, err.response?.data);
    return false;
  }
};

// ── 1. Buyer confirmation ──────────────────────────────────────────────────
const sendBuyerSMS = (phone, bikeName, orderId) =>
  sendSMS(
    phone,
    `ReBike: Order Confirmed! You bought ${bikeName}. Order ID: ${orderId}. We will contact you shortly.`
  );

// ── 2. Seller notification ────────────────────────────────────────────────
const sendSellerSMS = (phone, bikeName, buyerName, buyerPhone) =>
  sendSMS(
    phone,
    `ReBike: Your bike "${bikeName}" has been purchased by ${buyerName} (${buyerPhone || "N/A"}). Login to ReBike for details.`
  );

// ── 3. Admin notification ─────────────────────────────────────────────────
const sendAdminSMS = (phone, bikeName, buyerName, sellerName) =>
  sendSMS(
    phone,
    `ReBike Admin: ${buyerName} purchased "${bikeName}" from seller ${sellerName}. Check the admin panel for order details.`
  );

module.exports = { sendBuyerSMS, sendSellerSMS, sendAdminSMS };