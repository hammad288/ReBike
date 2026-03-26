const express = require("express");
const router = express.Router();
const braintree = require("braintree");
const { verifyToken } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Bike = require("../models/Bike");
require("dotenv").config();

// ── Gateway Setup ────────────────────────────────────────────────────────────
let gateway;
if (
  process.env.BRAINTREE_MERCHANT_ID &&
  process.env.BRAINTREE_PUBLIC_KEY &&
  process.env.BRAINTREE_PRIVATE_KEY
) {
  gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Change to Production for live
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
}

const gatewayCheck = (res) => {
  if (!gateway) {
    res.status(500).json({
      success: false,
      error: "Payment gateway not configured. Please contact support.",
    });
    return false;
  }
  return true;
};

// ── GET /api/braintree/token ─────────────────────────────────────────────────
// Generate a client token for the Braintree Drop-In UI
router.get("/token", verifyToken, async (req, res) => {
  try {
    if (!gatewayCheck(res)) return;

    const response = await gateway.clientToken.generate({});
    res.json({ success: true, clientToken: response.clientToken });
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate payment token." });
  }
});

// ── POST /api/braintree/payment ──────────────────────────────────────────────
// Process a payment (Credit Card, PayPal, Google Pay, Apple Pay)
router.post("/payment", verifyToken, async (req, res) => {
  try {
    if (!gatewayCheck(res)) return;

    const { nonce, bikeIds, deviceData } = req.body;

    if (!nonce) {
      return res.status(400).json({ success: false, error: "Payment nonce is required." });
    }
    if (!bikeIds || bikeIds.length === 0) {
      return res.status(400).json({ success: false, error: "No bikes provided." });
    }

    // Step 1: Verify bikes and calculate total
    const bikes = await Bike.find({ _id: { $in: bikeIds } });
    if (bikes.length === 0) {
      return res.status(404).json({ success: false, error: "Bikes not found." });
    }

    let totalAmount = 0;
    bikes.forEach((bike) => { totalAmount += Number(bike.price) || 0; });

    if (totalAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid total amount." });
    }

    // Step 2: Submit transaction to Braintree
    const transactionRequest = {
      amount: totalAmount.toFixed(2),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    };

    // Include device data for fraud detection if provided
    if (deviceData) {
      transactionRequest.deviceData = deviceData;
    }

    const result = await gateway.transaction.sale(transactionRequest);

    if (!result.success) {
      // Braintree returned an error — do NOT save order
      const errorMsg =
        result.message ||
        (result.transaction && result.transaction.processorResponseText) ||
        "Payment declined. Please try a different payment method.";

      console.error("Braintree transaction failed:", errorMsg);
      return res.status(402).json({ success: false, error: errorMsg });
    }

    const tx = result.transaction;

    // Step 3: Determine payment method type
    let paymentMethod = "online";
    if (tx.paypalAccount && tx.paypalAccount.payerEmail) {
      paymentMethod = "paypal";
    } else if (tx.androidPayCard || tx.googlePayCard) {
      paymentMethod = "googlepay";
    } else if (tx.applePayCard) {
      paymentMethod = "applepay";
    } else if (tx.venmoAccount) {
      paymentMethod = "venmo";
    } else if (tx.creditCard || tx.debitCard) {
      paymentMethod = "card";
    }

    // Step 4: Store transaction details (safe subset for DB)
    const transactionDetails = {
      transactionType: tx.type,
      status: tx.status,
      amount: tx.amount,
      currencyIsoCode: tx.currencyIsoCode,
      processorResponseCode: tx.processorResponseCode,
      processorResponseText: tx.processorResponseText,
      createdAt: tx.createdAt,
    };

    // Add payment-method-specific details
    if (tx.creditCard && tx.creditCard.last4) {
      transactionDetails.cardType = tx.creditCard.cardType;
      transactionDetails.last4 = tx.creditCard.last4;
      transactionDetails.expirationMonth = tx.creditCard.expirationMonth;
      transactionDetails.expirationYear = tx.creditCard.expirationYear;
    }
    if (tx.paypalAccount && tx.paypalAccount.payerEmail) {
      transactionDetails.paypalEmail = tx.paypalAccount.payerEmail;
    }
    if (tx.googlePayCard && tx.googlePayCard.last4) {
      transactionDetails.googlePayLast4 = tx.googlePayCard.last4;
    }
    if (tx.applePayCard && tx.applePayCard.last4) {
      transactionDetails.applePayLast4 = tx.applePayCard.last4;
    }

    // Step 5: Save order to database
    const order = new Order({
      buyer: req.user.id,
      bikes: bikeIds,
      totalAmount,
      paymentMethod,
      payment: {
        success: true,
        transactionId: tx.id,
        transactionDetails,
      },
      status: "Processing",
    });

    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      transactionId: tx.id,
      paymentMethod,
      amount: tx.amount,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ success: false, error: "Payment processing failed. Please try again." });
  }
});

// ── POST /api/braintree/webhook ──────────────────────────────────────────────
// Handle Braintree webhook notifications
router.post("/webhook", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    if (!gatewayCheck(res)) return;

    const notification = await gateway.webhookNotification.parse(
      req.body["bt_signature"],
      req.body["bt_payload"]
    );

    const kind = notification.kind;
    const tx = notification.transaction;

    if (tx) {
      if (kind === braintree.WebhookNotification.Kind.TransactionSettled) {
        await Order.findOneAndUpdate(
          { "payment.transactionId": tx.id },
          { status: "Processing" }
        );
      } else if (kind === braintree.WebhookNotification.Kind.TransactionSettlementDeclined) {
        await Order.findOneAndUpdate(
          { "payment.transactionId": tx.id },
          { status: "Cancelled", "payment.success": false }
        );
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Webhook processing failed.");
  }
});

// ── GET /api/braintree/orders ────────────────────────────────────────────────
// Get logged-in user's orders (all, including COD)
router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("bikes", "brand model year price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch orders." });
  }
});

module.exports = router;
