const PptxGenJS = require("pptxgenjs");

const prs = new PptxGenJS();

// ─── Theme Colors ───────────────────────────────────────────────
const DARK_BG   = "0D0D0D";
const ACCENT    = "FF6B00";   // orange
const ACCENT2   = "FF9E45";   // light orange
const WHITE     = "FFFFFF";
const GRAY      = "AAAAAA";
const CARD_BG   = "1A1A1A";

prs.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 inches

// ════════════════════════════════════════════════════════════════
// SLIDE 1 — Title Slide
// ════════════════════════════════════════════════════════════════
let slide = prs.addSlide();
slide.background = { color: DARK_BG };

// orange left bar
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

// big title
slide.addText("🏍️ ReBike", {
  x: 0.4, y: 1.6, w: 12.5, h: 1.4,
  fontSize: 72, bold: true, color: ACCENT,
  fontFace: "Segoe UI", align: "center",
});

// tagline
slide.addText("Used Bike Marketplace — Buy. Sell. Ride.", {
  x: 0.4, y: 3.1, w: 12.5, h: 0.7,
  fontSize: 26, color: WHITE, fontFace: "Segoe UI Light", align: "center",
});

// divider
slide.addShape(prs.ShapeType.rect, { x: 4.5, y: 3.95, w: 4.3, h: 0.06, fill: { color: ACCENT } });

// subtitle
slide.addText("Full-Stack Web Application  |  MERN Stack", {
  x: 0.4, y: 4.2, w: 12.5, h: 0.5,
  fontSize: 17, color: GRAY, fontFace: "Segoe UI", align: "center",
});

slide.addText("Presented by: Hammad", {
  x: 0.4, y: 6.6, w: 12.5, h: 0.4,
  fontSize: 14, color: ACCENT2, fontFace: "Segoe UI", align: "center",
});

// ════════════════════════════════════════════════════════════════
// SLIDE 2 — Problem Statement
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("❓ Problem Statement", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 4.5, h: 0.06, fill: { color: ACCENT } });

const problems = [
  { icon: "🔍", title: "No Trusted Platform", desc: "Used bike sellers have no dedicated, reliable marketplace to list their bikes." },
  { icon: "💸", title: "No Secure Payment", desc: "Buyers have no secure online payment option — only unsafe cash deals." },
  { icon: "🚫", title: "No Quality Control", desc: "Anyone can post fake listings — no verification or admin approval process." },
  { icon: "📵", title: "No Communication", desc: "Buyers & sellers get no instant notifications when a deal is made." },
];

problems.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.4 + col * 6.5;
  const y = 1.6 + row * 2.6;

  slide.addShape(prs.ShapeType.roundRect, { x, y, w: 6.1, h: 2.2, rectRadius: 0.15, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1.5 } });
  slide.addText(p.icon + "  " + p.title, { x: x + 0.22, y: y + 0.2, w: 5.7, h: 0.55, fontSize: 18, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
  slide.addText(p.desc, { x: x + 0.22, y: y + 0.8, w: 5.7, h: 1.2, fontSize: 14, color: WHITE, fontFace: "Segoe UI", wrap: true });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 3 — Solution & Objectives
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("✅ Solution — ReBike", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 4.0, h: 0.06, fill: { color: ACCENT } });

slide.addText("ReBike is a full-stack web platform that connects used bike sellers and buyers in a secure, admin-verified environment.", {
  x: 0.4, y: 1.45, w: 12.5, h: 0.7,
  fontSize: 16, color: GRAY, fontFace: "Segoe UI Italic", wrap: true,
});

const solutions = [
  "🛒  Buyers can browse, filter by brand/price, add to cart & pay online securely",
  "📝  Sellers can list their bikes — goes live only after Admin approval",
  "🔐  JWT-based authentication ensures secure role-based access",
  "💳  Braintree payment gateway for secure credit card transactions",
  "📱  Automatic SMS notifications to Buyer, Seller & Admin on every purchase",
  "🛡️  Admin panel to manage all bikes, users & orders from one place",
];

solutions.forEach((s, i) => {
  slide.addShape(prs.ShapeType.roundRect, { x: 0.4, y: 2.3 + i * 0.76, w: 12.2, h: 0.65, rectRadius: 0.1, fill: { color: i % 2 === 0 ? "111111" : CARD_BG } });
  slide.addText(s, { x: 0.7, y: 2.37 + i * 0.76, w: 11.9, h: 0.52, fontSize: 15, color: WHITE, fontFace: "Segoe UI" });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 4 — 3 User Roles
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("👥 3 User Roles", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 2.8, h: 0.06, fill: { color: ACCENT } });

const roles = [
  {
    icon: "🛒", role: "Buyer (User)", color: "1A3A5C",
    points: ["Browse all approved bikes", "Filter by brand, price, condition", "Add to cart, checkout securely", "Track order history", "Get SMS on purchase"],
  },
  {
    icon: "🏪", role: "Seller", color: "1A3A1A",
    points: ["Register as Seller", "Add bike with photos & details", "Bike goes PENDING for review", "Admin approves → goes LIVE", "Get SMS when bike is sold"],
  },
  {
    icon: "🛡️", role: "Admin", color: "3A1A1A",
    points: ["Approve or reject bike listings", "View rejection reason per bike", "Manage all orders & statuses", "View & manage all users", "Get SMS on every new order"],
  },
];

roles.forEach((r, i) => {
  const x = 0.35 + i * 4.35;
  slide.addShape(prs.ShapeType.roundRect, { x, y: 1.5, w: 4.1, h: 5.6, rectRadius: 0.2, fill: { color: r.color }, line: { color: ACCENT, width: 1.5 } });
  slide.addText(r.icon, { x, y: 1.65, w: 4.1, h: 0.7, fontSize: 32, align: "center" });
  slide.addText(r.role, { x, y: 2.4, w: 4.1, h: 0.55, fontSize: 19, bold: true, color: ACCENT2, fontFace: "Segoe UI", align: "center" });
  slide.addShape(prs.ShapeType.rect, { x: x + 0.5, y: 3.0, w: 3.1, h: 0.05, fill: { color: ACCENT } });
  r.points.forEach((pt, j) => {
    slide.addText("• " + pt, { x: x + 0.2, y: 3.15 + j * 0.6, w: 3.7, h: 0.55, fontSize: 13, color: WHITE, fontFace: "Segoe UI", wrap: true });
  });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 5 — Tech Stack
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("🛠️ Tech Stack", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 2.6, h: 0.06, fill: { color: ACCENT } });

const techs = [
  { icon: "⚛️",  name: "React.js",    cat: "Frontend",  desc: "Dynamic UI with component-based architecture, React Router for navigation, Context API for auth state" },
  { icon: "🟢",  name: "Node.js +\nExpress.js", cat: "Backend", desc: "RESTful API server with JWT authentication middleware and role-based route protection" },
  { icon: "🍃",  name: "MongoDB\n(Atlas)", cat: "Database", desc: "Cloud NoSQL database with Mongoose ODM, indexed queries for fast performance" },
  { icon: "💳",  name: "Braintree",   cat: "Payments",  desc: "Secure credit card payment processing with Drop-in UI and transaction management" },
  { icon: "📱",  name: "Fast2SMS",    cat: "Notifications", desc: "SMS alerts sent to Buyer, Seller and Admin on every successful bike purchase" },
  { icon: "🔐",  name: "JWT",         cat: "Auth",      desc: "JSON Web Tokens for secure, stateless authentication stored in localStorage" },
];

techs.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.35 + col * 4.35;
  const y = 1.5 + row * 2.85;
  slide.addShape(prs.ShapeType.roundRect, { x, y, w: 4.1, h: 2.6, rectRadius: 0.15, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 } });
  slide.addText(t.icon + "  " + t.name, { x: x + 0.15, y: y + 0.15, w: 3.8, h: 0.7, fontSize: 17, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
  slide.addText("[ " + t.cat + " ]", { x: x + 0.15, y: y + 0.85, w: 3.8, h: 0.35, fontSize: 11, color: ACCENT, fontFace: "Segoe UI", bold: true });
  slide.addText(t.desc, { x: x + 0.15, y: y + 1.2, w: 3.8, h: 1.25, fontSize: 12, color: GRAY, fontFace: "Segoe UI", wrap: true });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 6 — System Flow
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("🔄 System Flow", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 3.0, h: 0.06, fill: { color: ACCENT } });

// Buyer flow
slide.addText("🛒 Buyer Flow", { x: 0.4, y: 1.45, w: 5.8, h: 0.5, fontSize: 17, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
const buyerSteps = ["Register / Login", "Browse & Filter Bikes", "Bike Detail Page", "Add to Cart", "Braintree Payment", "Order Created + SMS Sent", "Order Confirmation Page"];
buyerSteps.forEach((s, i) => {
  slide.addShape(prs.ShapeType.roundRect, { x: 0.4, y: 2.0 + i * 0.72, w: 3.2, h: 0.6, rectRadius: 0.1, fill: { color: i === buyerSteps.length - 1 ? "1A3A1A" : CARD_BG }, line: { color: ACCENT, width: 1 } });
  slide.addText((i + 1) + ".  " + s, { x: 0.55, y: 2.07 + i * 0.72, w: 2.9, h: 0.46, fontSize: 13, color: WHITE, fontFace: "Segoe UI" });
  if (i < buyerSteps.length - 1) {
    slide.addText("↓", { x: 0.4, y: 2.58 + i * 0.72, w: 3.2, h: 0.18, fontSize: 12, color: ACCENT, align: "center" });
  }
});

// Seller flow
slide.addText("🏪 Seller Flow", { x: 4.8, y: 1.45, w: 5.8, h: 0.5, fontSize: 17, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
const sellerSteps = ["Register as Seller", "Add Bike (photos + details)", "Status: PENDING", "Admin Reviews", "APPROVED → Live on /bikes", "Bike Sold → SMS Received"];
sellerSteps.forEach((s, i) => {
  const clr = s.includes("APPROVED") ? "1A3A1A" : s.includes("PENDING") ? "362000" : CARD_BG;
  slide.addShape(prs.ShapeType.roundRect, { x: 4.8, y: 2.0 + i * 0.83, w: 3.4, h: 0.7, rectRadius: 0.1, fill: { color: clr }, line: { color: ACCENT, width: 1 } });
  slide.addText((i + 1) + ".  " + s, { x: 4.95, y: 2.08 + i * 0.83, w: 3.1, h: 0.54, fontSize: 13, color: WHITE, fontFace: "Segoe UI" });
  if (i < sellerSteps.length - 1) {
    slide.addText("↓", { x: 4.8, y: 2.68 + i * 0.83, w: 3.4, h: 0.2, fontSize: 12, color: ACCENT, align: "center" });
  }
});

// Admin flow
slide.addText("🛡️ Admin Flow", { x: 9.3, y: 1.45, w: 3.8, h: 0.5, fontSize: 17, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
const adminSteps = ["Login as Admin", "View Pending Bikes", "Approve / Reject", "Manage All Orders", "Manage Users", "SMS on New Orders"];
adminSteps.forEach((s, i) => {
  slide.addShape(prs.ShapeType.roundRect, { x: 9.3, y: 2.0 + i * 0.83, w: 3.6, h: 0.7, rectRadius: 0.1, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1 } });
  slide.addText((i + 1) + ".  " + s, { x: 9.45, y: 2.08 + i * 0.83, w: 3.3, h: 0.54, fontSize: 13, color: WHITE, fontFace: "Segoe UI" });
  if (i < adminSteps.length - 1) {
    slide.addText("↓", { x: 9.3, y: 2.68 + i * 0.83, w: 3.6, h: 0.2, fontSize: 12, color: ACCENT, align: "center" });
  }
});

// ════════════════════════════════════════════════════════════════
// SLIDE 7 — Key Features
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("⚡ Key Features", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 3.0, h: 0.06, fill: { color: ACCENT } });

const features = [
  { icon: "🔐", title: "JWT Authentication",    desc: "Secure login with role-based access (User / Seller / Admin)" },
  { icon: "🏍️", title: "Bike Listings",          desc: "Filter by brand, price, year, condition & location" },
  { icon: "✅", title: "Admin Approval System",  desc: "All seller bikes go through admin review before going live" },
  { icon: "🛒", title: "Shopping Cart",           desc: "Add multiple bikes, view total, proceed to checkout" },
  { icon: "💳", title: "Online Payment",          desc: "Braintree Drop-in UI for secure credit card transactions" },
  { icon: "📱", title: "SMS Notifications",       desc: "Auto SMS to Buyer, Seller & Admin on every purchase" },
  { icon: "📦", title: "Order Management",        desc: "Track order status from 'Not Processed' to 'Delivered'" },
  { icon: "🏪", title: "Seller Dashboard",        desc: "Sellers manage their own bike listings & view status" },
];

features.forEach((f, i) => {
  const col = i % 2;
  const row = Math.floor(i / 4) * 4 + (i % 4);
  const x = 0.35 + col * 6.5;
  const y = 1.5 + (i % 4) * 1.45;
  slide.addShape(prs.ShapeType.roundRect, { x, y, w: 6.1, h: 1.28, rectRadius: 0.12, fill: { color: CARD_BG }, line: { color: col === 0 ? ACCENT : "FF9E45", width: 1 } });
  slide.addText(f.icon + "  " + f.title, { x: x + 0.18, y: y + 0.1, w: 5.7, h: 0.48, fontSize: 16, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
  slide.addText(f.desc, { x: x + 0.18, y: y + 0.58, w: 5.7, h: 0.6, fontSize: 13, color: GRAY, fontFace: "Segoe UI", wrap: true });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 8 — Database Design
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("🗄️ Database Design (MongoDB)", {
  x: 0.4, y: 0.4, w: 12.5, h: 0.8,
  fontSize: 36, bold: true, color: ACCENT, fontFace: "Segoe UI",
});
slide.addShape(prs.ShapeType.rect, { x: 0.4, y: 1.25, w: 5.5, h: 0.06, fill: { color: ACCENT } });

const models = [
  {
    name: "👤 User", x: 0.4, y: 1.5, w: 4.1,
    fields: ["_id", "name", "email", "password (hashed)", "role: user/seller/admin", "phone", "address", "createdAt"],
  },
  {
    name: "🏍️ Bike", x: 4.75, y: 1.5, w: 4.1,
    fields: ["_id", "brand, model, price, year", "kmDriven, fuelType, owner", "location, condition", "description", "images: [Base64]", "seller → ref: User", "status: pending/approved/rejected", "rejectionReason"],
  },
  {
    name: "📦 Order", x: 9.1, y: 1.5, w: 4.1,
    fields: ["_id", "buyer → ref: User", "bikes → [ref: Bike]", "totalAmount", "paymentMethod: COD/card/online", "payment: { success, transactionId }", "status: Not Processed→Delivered", "createdAt"],
  },
];

models.forEach((m) => {
  const h = 0.56 * m.fields.length + 0.8;
  slide.addShape(prs.ShapeType.roundRect, { x: m.x, y: m.y, w: m.w, h, rectRadius: 0.15, fill: { color: CARD_BG }, line: { color: ACCENT, width: 1.5 } });
  slide.addText(m.name, { x: m.x + 0.15, y: m.y + 0.1, w: m.w - 0.3, h: 0.5, fontSize: 17, bold: true, color: ACCENT2, fontFace: "Segoe UI" });
  slide.addShape(prs.ShapeType.rect, { x: m.x + 0.15, y: m.y + 0.62, w: m.w - 0.3, h: 0.04, fill: { color: ACCENT } });
  m.fields.forEach((f, j) => {
    slide.addText("  " + f, { x: m.x + 0.15, y: m.y + 0.75 + j * 0.52, w: m.w - 0.3, h: 0.45, fontSize: 12, color: WHITE, fontFace: "Courier New" });
  });
});

// ════════════════════════════════════════════════════════════════
// SLIDE 9 — Thank You
// ════════════════════════════════════════════════════════════════
slide = prs.addSlide();
slide.background = { color: DARK_BG };
slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });
slide.addShape(prs.ShapeType.rect, { x: 13.21, y: 0, w: 0.12, h: 7.5, fill: { color: ACCENT } });

slide.addText("🏍️", { x: 0, y: 1.8, w: 13.33, h: 1.2, fontSize: 72, align: "center" });

slide.addText("Thank You!", {
  x: 0.4, y: 3.1, w: 12.5, h: 1.1,
  fontSize: 60, bold: true, color: ACCENT, fontFace: "Segoe UI", align: "center",
});

slide.addShape(prs.ShapeType.rect, { x: 4.0, y: 4.3, w: 5.3, h: 0.07, fill: { color: ACCENT } });

slide.addText("ReBike — Buy. Sell. Ride.", {
  x: 0.4, y: 4.5, w: 12.5, h: 0.65,
  fontSize: 24, color: WHITE, fontFace: "Segoe UI Light", align: "center",
});

slide.addText("Questions? 🤔", {
  x: 0.4, y: 5.4, w: 12.5, h: 0.55,
  fontSize: 20, color: GRAY, fontFace: "Segoe UI", align: "center",
});

slide.addText("Built with  ⚛️ React  •  🟢 Node.js  •  🍃 MongoDB  •  💳 Braintree  •  📱 Fast2SMS", {
  x: 0.4, y: 6.7, w: 12.5, h: 0.45,
  fontSize: 13, color: ACCENT2, fontFace: "Segoe UI", align: "center",
});

// ─── Save ────────────────────────────────────────────────────────
prs.writeFile({ fileName: "ReBike_Presentation.pptx" })
  .then(() => console.log("✅ PPT ready: ReBike_Presentation.pptx"))
  .catch((err) => console.error("❌ Error:", err));
