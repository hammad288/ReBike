require("dotenv").config();
const sendOrderConfirmationSMS = require("../services/smsService");

(async () => {
  const result = await sendOrderConfirmationSMS(
    "YOUR_10_DIGIT_NUMBER",
    "Royal Enfield Classic 350",
    "TEST123"
  );

  console.log("🚀 FINAL RESULT:", result);
})();