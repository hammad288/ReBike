const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>ReBike — Data Dictionary</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary:   #6C63FF;
    --accent:    #FF6584;
    --teal:      #43C6AC;
    --dark:      #0D0D1A;
    --surface:   #151528;
    --card:      #1E1E38;
    --border:    #2E2E55;
    --text:      #E2E2F0;
    --muted:     #8888AA;
    --success:   #4FFFB0;
    --warning:   #FFD166;
    --danger:    #FF6B6B;
    --info:      #74B9FF;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--dark);
    color: var(--text);
  }

  /* ─── Each slide = one PDF page ─── */
  .slide {
    width: 297mm;
    min-height: 210mm;
    max-height: 210mm;
    overflow: hidden;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    page-break-after: always;
    position: relative;
  }

  /* Gradient accent bar at top */
  .slide::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--teal), var(--accent));
  }

  /* ─── Cover Slide ─── */
  .cover {
    background: radial-gradient(ellipse at 20% 50%, #1a1040 0%, var(--dark) 60%);
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 18px;
  }
  .cover .logo-ring {
    width: 90px; height: 90px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 40px;
    box-shadow: 0 0 40px rgba(108,99,255,0.5);
    margin-bottom: 10px;
  }
  .cover h1 { font-size: 48px; font-weight: 900; letter-spacing: -1px;
    background: linear-gradient(135deg, #fff 0%, var(--primary) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .cover .subtitle { font-size: 20px; color: var(--muted); font-weight: 300; }
  .cover .meta { font-size: 13px; color: var(--primary); letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }
  .cover .pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(108,99,255,.15); border: 1px solid rgba(108,99,255,.4);
    padding: 6px 16px; border-radius: 999px; font-size: 13px; color: var(--primary);
  }

  /* ─── Section Header Slide ─── */
  .section-slide {
    align-items: flex-start;
    justify-content: flex-end;
    padding: 36px 56px;
    background: linear-gradient(135deg, #0f0f28 0%, #1a1040 100%);
  }
  .section-slide .section-label {
    font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
    color: var(--primary); margin-bottom: 10px;
  }
  .section-slide h2 { font-size: 42px; font-weight: 800; line-height: 1.1; }
  .section-slide .desc { font-size: 16px; color: var(--muted); margin-top: 12px; max-width: 500px; }
  .section-slide .accent-blob {
    position: absolute; right: -60px; top: -60px;
    width: 320px; height: 320px; border-radius: 50%;
    background: radial-gradient(circle, rgba(108,99,255,.2) 0%, transparent 70%);
  }
  .section-slide .num {
    position: absolute; right: 56px; bottom: 36px;
    font-size: 120px; font-weight: 900; opacity: .05; line-height: 1;
  }

  /* ─── Content slide ─── */
  .content-slide { padding: 30px 48px 28px; gap: 16px; }
  .content-slide .slide-title {
    font-size: 22px; font-weight: 700;
    border-left: 4px solid var(--primary);
    padding-left: 14px; line-height: 1;
  }
  .content-slide .slide-title span { color: var(--primary); }

  /* ─── Tables ─── */
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  thead tr { background: linear-gradient(90deg, rgba(108,99,255,.25), rgba(67,198,172,.15)); }
  thead th { padding: 9px 12px; text-align: left; font-weight: 700; font-size: 10.5px;
    letter-spacing: .8px; text-transform: uppercase; color: var(--primary);
    border-bottom: 2px solid var(--border); }
  tbody tr { border-bottom: 1px solid rgba(255,255,255,.05); transition: background .2s; }
  tbody tr:nth-child(even) { background: rgba(255,255,255,.025); }
  tbody td { padding: 7px 12px; color: var(--text); vertical-align: top; line-height: 1.4; }

  /* badges */
  .badge { display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; }
  .badge-req  { background: rgba(79,255,176,.15); color: var(--success); border: 1px solid rgba(79,255,176,.35); }
  .badge-auto { background: rgba(116,185,255,.15); color: var(--info);    border: 1px solid rgba(116,185,255,.35); }
  .badge-no   { background: rgba(255,255,255,.07);  color: var(--muted);   border: 1px solid var(--border); }
  .badge-yes  { background: rgba(79,255,176,.15); color: var(--success); border: 1px solid rgba(79,255,176,.35); }
  .badge-x    { background: rgba(255,107,107,.15); color: var(--danger);  border: 1px solid rgba(255,107,107,.35); }

  code { background: rgba(108,99,255,.2); color: #c4b5ff;
    padding: 1px 6px; border-radius: 4px; font-size: 10.5px; font-family: monospace; }

  /* ─── Cards grid ─── */
  .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    padding: 18px 16px; display: flex; flex-direction: column; gap: 8px;
  }
  .card .card-icon { font-size: 28px; }
  .card .card-title { font-size: 13px; font-weight: 700; color: var(--text); }
  .card .card-desc { font-size: 11px; color: var(--muted); line-height: 1.5; }
  .card .card-tag { font-size: 10px; color: var(--primary); font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }

  /* ─── Lifecycle flow ─── */
  .flow { display: flex; align-items: center; gap: 0; flex-wrap: wrap; }
  .flow-step {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 10px 18px;
    font-size: 12px; font-weight: 700; white-space: nowrap;
  }
  .flow-arrow { font-size: 18px; color: var(--primary); padding: 0 8px; }
  .pending  { border-color: rgba(255,209,102,.5);  color: var(--warning); }
  .approved { border-color: rgba(79,255,176,.5);   color: var(--success); }
  .rejected { border-color: rgba(255,107,107,.5);  color: var(--danger);  }
  .processing { border-color: rgba(116,185,255,.5); color: var(--info); }
  .shipped    { border-color: rgba(108,99,255,.5);  color: var(--primary); }
  .delivered  { border-color: rgba(79,255,176,.5);  color: var(--success); }
  .not-proc   { border-color: rgba(255,255,255,.2); color: var(--muted); }
  .cancelled  { border-color: rgba(255,107,107,.5); color: var(--danger); }

  /* ─── Role matrix ─── */
  .matrix-check { color: var(--success); font-size: 16px; }
  .matrix-x     { color: var(--danger);  font-size: 16px; }

  /* ─── API table method badges ─── */
  .method { display: inline-block; padding: 2px 7px; border-radius: 4px;
    font-size: 9.5px; font-weight: 800; letter-spacing: .5px; }
  .get    { background: rgba(79,255,176,.15); color: var(--success); }
  .post   { background: rgba(255,209,102,.15); color: var(--warning); }
  .put    { background: rgba(116,185,255,.15); color: var(--info); }
  .patch  { background: rgba(108,99,255,.2); color: var(--primary); }
  .delete { background: rgba(255,107,107,.15); color: var(--danger); }

  /* ─── Env table ─── */
  .env-key { font-family: monospace; font-size: 11px; color: var(--teal); }

  /* ─── Footer strip ─── */
  .footer {
    margin-top: auto; padding: 8px 48px;
    border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    font-size: 10px; color: var(--muted);
  }
  .footer .brand { color: var(--primary); font-weight: 700; }

  /* ─── Two-col ─── */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

  .index-pill {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(67,198,172,.1); border: 1px solid rgba(67,198,172,.3);
    padding: 4px 12px; border-radius: 6px; font-size: 11px;
    margin-bottom: 6px; font-family: monospace;
  }
  .index-pill .idx-name { color: var(--teal); font-weight: 700; }
  .index-pill .idx-fields { color: var(--muted); }

  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
  .tag {
    padding: 3px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 600;
    background: rgba(108,99,255,.15); border: 1px solid rgba(108,99,255,.3); color: var(--primary);
  }

  .note-box {
    background: rgba(116,185,255,.07); border-left: 3px solid var(--info);
    border-radius: 0 8px 8px 0; padding: 10px 14px;
    font-size: 11.5px; color: var(--muted); line-height: 1.5;
  }
  .note-box strong { color: var(--info); }

  /* ─── Summary stat cards ─── */
  .stat-cards { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
  .stat-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 12px;
    padding: 20px 18px; text-align: center;
  }
  .stat-card .s-num { font-size: 36px; font-weight: 900; background: linear-gradient(135deg, var(--primary), var(--teal));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .stat-card .s-label { font-size: 11px; color: var(--muted); margin-top: 4px; }

  .highlight-row td:first-child { color: var(--primary); font-weight: 700; }
</style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 1  — COVER
═══════════════════════════════════════════════════════════════════ -->
<div class="slide cover">
  <div class="logo-ring">🏍️</div>
  <h1>ReBike</h1>
  <p class="subtitle">Data Dictionary &amp; System Documentation</p>
  <p class="meta">Used Motorcycle Marketplace Platform</p>
  <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:center;">
    <span class="pill">📦 4 Collections</span>
    <span class="pill">🔗 MongoDB · Mongoose</span>
    <span class="pill">🔐 JWT Auth</span>
    <span class="pill">💳 Braintree Payments</span>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 2  — OVERVIEW
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">Platform <span>Overview</span></div>

  <div class="stat-cards">
    <div class="stat-card">
      <div class="s-num">4</div>
      <div class="s-label">MongoDB Collections</div>
    </div>
    <div class="stat-card">
      <div class="s-num">35+</div>
      <div class="s-label">API Endpoints</div>
    </div>
    <div class="stat-card">
      <div class="s-num">3</div>
      <div class="s-label">User Roles</div>
    </div>
    <div class="stat-card">
      <div class="s-num">7</div>
      <div class="s-label">Payment Methods</div>
    </div>
  </div>

  <div class="cards" style="margin-top:4px;">
    <div class="card">
      <div class="card-icon">👤</div>
      <div class="card-title">users</div>
      <div class="card-desc">All accounts — buyers, sellers &amp; admins. Role-based access control.</div>
      <div class="card-tag">8 fields</div>
    </div>
    <div class="card">
      <div class="card-icon">🏍️</div>
      <div class="card-title">bikes</div>
      <div class="card-desc">Used-bike listings with images, specs &amp; approval workflow.</div>
      <div class="card-tag">15 fields · 3 indexes</div>
    </div>
    <div class="card">
      <div class="card-icon">🛒</div>
      <div class="card-title">orders</div>
      <div class="card-desc">Purchase records. Supports COD &amp; online payments via Braintree.</div>
      <div class="card-tag">10 fields</div>
    </div>
    <div class="card">
      <div class="card-icon">🏷️</div>
      <div class="card-title">brands</div>
      <div class="card-desc">Manufacturer catalogue with logo images stored as base64.</div>
      <div class="card-tag">6 fields</div>
    </div>
  </div>

  <div class="note-box">
    <strong>Storage:</strong> MongoDB Atlas cluster <code>rebike</code> · Images stored inline as <code>base64 data URIs</code> · JWT expiry 1 day · Passwords hashed with bcrypt (10 rounds)
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — Overview</span><span>Slide 2</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 3  — SECTION: USERS
═══════════════════════════════════════════════════════════════════ -->
<div class="slide section-slide">
  <div class="accent-blob"></div>
  <div class="num">01</div>
  <p class="section-label">Collection 01 / 04</p>
  <h2>users <br/>Collection</h2>
  <p class="desc">Stores every registered account on the platform. A single <code>role</code> field governs all access control across the entire API.</p>
  <div class="footer" style="margin-top:24px;"><span class="brand">ReBike</span><span>Data Dictionary — users</span><span>Slide 3</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 4  — USERS FIELD TABLE
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title"><span>users</span> — Field Reference</div>
  <div class="note-box" style="margin-bottom:4px;"><strong>Model:</strong> <code>backend/models/User.js</code> &nbsp;·&nbsp; <strong>Timestamps:</strong> createdAt &amp; updatedAt auto-managed by Mongoose</div>

  <table>
    <thead>
      <tr>
        <th>Field</th><th>Type</th><th>Required</th><th>Default</th><th>Constraints / Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr><td><code>_id</code></td><td>ObjectId</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>MongoDB primary key, auto-generated</td></tr>
      <tr><td><code>name</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>Full display name of the account holder</td></tr>
      <tr><td><code>email</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td><strong>Unique</strong> constraint. Used as login identifier</td></tr>
      <tr><td><code>password</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>Stored as <strong>bcrypt hash</strong> (10 rounds). Never returned in API responses via <code>.select("-password")</code></td></tr>
      <tr><td><code>role</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>"user"</code></td><td>Enum: <code>"user"</code> · <code>"seller"</code> · <code>"admin"</code>. Admin-only endpoint to promote/demote roles</td></tr>
      <tr><td><code>phone</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>""</code></td><td>Mobile number. <strong>Required at order time</strong> for sellers to receive SMS sale notifications via Fast2SMS</td></tr>
      <tr><td><code>address</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>""</code></td><td>Delivery / contact address. Editable via profile update</td></tr>
      <tr><td><code>createdAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Set at document creation by Mongoose timestamps</td></tr>
      <tr><td><code>updatedAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Updated on every save() / findByIdAndUpdate()</td></tr>
    </tbody>
  </table>

  <div style="margin-top:10px;">
    <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">JWT Payload (signed on login)</div>
    <div class="tag-row">
      <span class="tag">id: ObjectId</span>
      <span class="tag">role: String</span>
      <span class="tag">expires: 1 day</span>
      <span class="tag">algorithm: HS256</span>
    </div>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — users</span><span>Slide 4</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 5  — ROLE PERMISSIONS MATRIX
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">Role <span>Permissions</span> Matrix</div>

  <table>
    <thead>
      <tr>
        <th>Capability</th>
        <th style="text-align:center;">user</th>
        <th style="text-align:center;">seller</th>
        <th style="text-align:center;">admin</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Browse approved bike listings (public catalog)</td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Add bikes to cart &amp; initiate purchase</td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td></tr>
      <tr><td>Place COD orders &amp; online payments</td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td></tr>
      <tr><td>View own order history</td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Submit new bike listings</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Manage own bike listings (edit / delete)</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Approve or reject pending listings</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>View all bikes (including pending &amp; rejected)</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Manage all users (view, change role, delete)</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Create &amp; manage brand catalogue</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>View all orders &amp; update order status</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
      <tr><td>Access dashboard statistics</td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-x">✗</span></td><td style="text-align:center;"><span class="matrix-check">✓</span></td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — users</span><span>Slide 5</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 6  — SECTION: BIKES
═══════════════════════════════════════════════════════════════════ -->
<div class="slide section-slide">
  <div class="accent-blob"></div>
  <div class="num">02</div>
  <p class="section-label">Collection 02 / 04</p>
  <h2>bikes <br/>Collection</h2>
  <p class="desc">Core entity of the platform. Every listing goes through an admin approval workflow before becoming publicly visible in the marketplace.</p>
  <div class="footer" style="margin-top:24px;"><span class="brand">ReBike</span><span>Data Dictionary — bikes</span><span>Slide 6</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 7  — BIKES FIELD TABLE (Part 1)
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title"><span>bikes</span> — Field Reference (1/2)</div>
  <div class="note-box" style="margin-bottom:4px;"><strong>Model:</strong> <code>backend/models/Bike.js</code> &nbsp;·&nbsp; <strong>Ref:</strong> <code>seller → users._id</code></div>

  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Default</th><th>Constraints / Notes</th></tr>
    </thead>
    <tbody>
      <tr><td><code>_id</code></td><td>ObjectId</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>MongoDB primary key</td></tr>
      <tr><td><code>brand</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>Manufacturer name e.g. <code>"Yamaha"</code>, <code>"KTM"</code>, <code>"Bajaj"</code></td></tr>
      <tr><td><code>model</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>Model name e.g. <code>"R15 V4"</code>, <code>"Duke 200"</code></td></tr>
      <tr><td><code>price</code></td><td>Number</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>Asking price. Used to calculate <code>Order.totalAmount</code></td></tr>
      <tr><td><code>year</code></td><td>Number</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>Manufacturing year e.g. <code>2021</code></td></tr>
      <tr><td><code>kmDriven</code></td><td>Number</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>Odometer reading in kilometres</td></tr>
      <tr><td><code>fuelType</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>e.g. <code>"Petrol"</code>, <code>"Electric"</code></td></tr>
      <tr><td><code>owner</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>Ownership history e.g. <code>"1st Owner"</code>, <code>"2nd Owner"</code></td></tr>
      <tr><td><code>location</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>City or region of the seller e.g. <code>"Karachi"</code></td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — bikes</span><span>Slide 7</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 8  — BIKES FIELD TABLE (Part 2)
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title"><span>bikes</span> — Field Reference (2/2)</div>

  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Default</th><th>Constraints / Notes</th></tr>
    </thead>
    <tbody>
      <tr><td><code>condition</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>e.g. <code>"Excellent"</code>, <code>"Good"</code>, <code>"Fair"</code></td></tr>
      <tr><td><code>description</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>Free-text seller description of the bike</td></tr>
      <tr><td><code>images</code></td><td>[String]</td><td><span class="badge badge-no">Optional</span></td><td><code>[]</code></td><td><strong>Array of base64 data URIs.</strong> Seller: min 3, max 5. Admin: max 10. <em>Only first image</em> returned in list views to save bandwidth</td></tr>
      <tr><td><code>seller</code></td><td>ObjectId → User</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>References the listing owner. Populated with <code>name</code> + <code>email</code> in API responses</td></tr>
      <tr><td><code>status</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>"pending"</code></td><td>Enum: <code>"pending"</code> · <code>"approved"</code> · <code>"rejected"</code>. Only <code>approved</code> bikes are publicly visible</td></tr>
      <tr><td><code>rejectionReason</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>Admin-provided rejection note. Set when status → rejected. Cleared (<code>null</code>) on approval</td></tr>
      <tr><td><code>createdAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps. Used in all sort queries (<code>createdAt: -1</code>)</td></tr>
      <tr><td><code>updatedAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps</td></tr>
    </tbody>
  </table>

  <div style="margin-top:10px;">
    <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">Compound Indexes</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <div class="index-pill"><span class="idx-name">idx_date</span><span class="idx-fields">{ createdAt: -1 }</span></div>
      <div class="index-pill"><span class="idx-name">idx_seller_date</span><span class="idx-fields">{ seller: 1, createdAt: -1 }</span></div>
      <div class="index-pill"><span class="idx-name">idx_status_date</span><span class="idx-fields">{ status: 1, createdAt: -1 }</span></div>
    </div>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — bikes</span><span>Slide 8</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 9  — LISTING LIFECYCLE
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">Bike Listing <span>Approval Lifecycle</span></div>

  <div style="margin:20px 0 18px;">
    <div style="margin-bottom:12px;font-size:12px;color:var(--muted);">Seller Submission Path:</div>
    <div class="flow">
      <div class="flow-step" style="background:rgba(108,99,255,.1);border-color:var(--primary);color:var(--text);">Seller Submits Bike</div>
      <div class="flow-arrow">→</div>
      <div class="flow-step pending">⏳ pending</div>
      <div class="flow-arrow">→</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div class="flow" style="gap:0;">
          <div class="flow-arrow" style="padding-left:0;">↗</div>
          <div class="flow-step approved">✅ approved</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step" style="background:rgba(79,255,176,.08);border-color:rgba(79,255,176,.3);color:var(--success);">📢 Publicly Visible</div>
        </div>
        <div class="flow" style="gap:0;margin-top:4px;">
          <div class="flow-arrow" style="padding-left:0;">↘</div>
          <div class="flow-step rejected">❌ rejected</div>
          <div class="flow-arrow">→</div>
          <div class="flow-step" style="background:rgba(255,107,107,.08);border-color:rgba(255,107,107,.3);color:var(--danger);">rejectionReason set</div>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-bottom:12px;font-size:12px;color:var(--muted);">Admin Direct-Create Path:</div>
  <div class="flow" style="margin-bottom:20px;">
    <div class="flow-step" style="background:rgba(108,99,255,.1);border-color:var(--primary);color:var(--text);">Admin Creates Bike</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step approved">✅ approved</div>
    <div class="flow-arrow">→</div>
    <div class="flow-step" style="background:rgba(79,255,176,.08);border-color:rgba(79,255,176,.3);color:var(--success);">📢 Instantly Visible</div>
  </div>

  <table>
    <thead><tr><th>Status</th><th>Visible to Public?</th><th>Who Can Set?</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td><span class="badge" style="background:rgba(255,209,102,.15);color:var(--warning);border-color:rgba(255,209,102,.4);">pending</span></td><td>No</td><td>System (auto on submit)</td><td>Default status for all seller submissions</td></tr>
      <tr><td><span class="badge" style="background:rgba(79,255,176,.15);color:var(--success);border-color:rgba(79,255,176,.4);">approved</span></td><td><strong>Yes</strong></td><td>Admin only</td><td>Clears rejectionReason. Appears in public catalog</td></tr>
      <tr><td><span class="badge" style="background:rgba(255,107,107,.15);color:var(--danger);border-color:rgba(255,107,107,.4);">rejected</span></td><td>No</td><td>Admin only</td><td>rejectionReason required. Hidden from all users</td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — bikes</span><span>Slide 9</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 10  — SECTION: ORDERS
═══════════════════════════════════════════════════════════════════ -->
<div class="slide section-slide">
  <div class="accent-blob"></div>
  <div class="num">03</div>
  <p class="section-label">Collection 03 / 04</p>
  <h2>orders <br/>Collection</h2>
  <p class="desc">Records every purchase transaction. Supports both Cash-on-Delivery and fully online card/digital-wallet payments processed through Braintree's gateway.</p>
  <div class="footer" style="margin-top:24px;"><span class="brand">ReBike</span><span>Data Dictionary — orders</span><span>Slide 10</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 11  — ORDERS FIELD TABLE
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title"><span>orders</span> — Field Reference</div>
  <div class="note-box" style="margin-bottom:4px;"><strong>Model:</strong> <code>backend/models/Order.js</code> &nbsp;·&nbsp; <strong>Refs:</strong> <code>buyer → users._id</code> · <code>bikes[] → bikes._id</code></div>

  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Default</th><th>Constraints / Notes</th></tr>
    </thead>
    <tbody>
      <tr><td><code>_id</code></td><td>ObjectId</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>MongoDB primary key</td></tr>
      <tr><td><code>buyer</code></td><td>ObjectId → User</td><td><span class="badge badge-req">Required</span></td><td>—</td><td>The customer who placed the order. Populated with name + email in admin views</td></tr>
      <tr><td><code>bikes</code></td><td>[ObjectId → Bike]</td><td><span class="badge badge-no">Optional</span></td><td><code>[]</code></td><td>Array of purchased bike references. Supports multi-bike cart checkout</td></tr>
      <tr><td><code>totalAmount</code></td><td>Number</td><td><span class="badge badge-no">Optional</span></td><td><code>0</code></td><td>Sum of all bike prices. Calculated at checkout. Used by Braintree as transaction amount</td></tr>
      <tr><td><code>paymentMethod</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>"COD"</code></td><td>Enum: <code>COD</code> · <code>card</code> · <code>paypal</code> · <code>googlepay</code> · <code>applepay</code> · <code>venmo</code> · <code>online</code></td></tr>
      <tr><td><code>payment.success</code></td><td>Boolean</td><td><span class="badge badge-no">Optional</span></td><td><code>false</code></td><td>Set to <code>true</code> once Braintree confirms the transaction settlement</td></tr>
      <tr><td><code>payment.transactionId</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>null</code></td><td>Braintree-issued transaction ID. Used for webhook lookups</td></tr>
      <tr><td><code>payment.transactionDetails</code></td><td>Mixed</td><td><span class="badge badge-no">Optional</span></td><td><code>null</code></td><td>Safe subset of Braintree response (see next slide). <code>null</code> for COD orders</td></tr>
      <tr><td><code>status</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>"Not Processed"</code></td><td>Enum: Not Processed · Processing · Shipped · Delivered · Cancelled</td></tr>
      <tr><td><code>createdAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps</td></tr>
      <tr><td><code>updatedAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps</td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — orders</span><span>Slide 11</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 12  — ORDER LIFECYCLE + PAYMENT DETAILS
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">Order Status <span>Lifecycle</span> &amp; Payment Sub-fields</div>

  <div class="two-col">
    <div>
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">Order Status Flow</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px;">COD Path:</div>
          <div class="flow" style="gap:6px;flex-wrap:wrap;">
            <div class="flow-step not-proc" style="font-size:10.5px;padding:6px 12px;">Not Processed</div>
            <div class="flow-arrow" style="font-size:14px;">→</div>
            <div class="flow-step processing" style="font-size:10.5px;padding:6px 12px;">Processing</div>
            <div class="flow-arrow" style="font-size:14px;">→</div>
            <div class="flow-step shipped" style="font-size:10.5px;padding:6px 12px;">Shipped</div>
            <div class="flow-arrow" style="font-size:14px;">→</div>
            <div class="flow-step delivered" style="font-size:10.5px;padding:6px 12px;">Delivered</div>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:4px;">Online Payment Path:</div>
          <div class="flow" style="gap:6px;">
            <div class="flow-step processing" style="font-size:10.5px;padding:6px 12px;">Processing</div>
            <div class="flow-arrow" style="font-size:14px;">→</div>
            <div class="flow-step shipped" style="font-size:10.5px;padding:6px 12px;">Shipped</div>
            <div class="flow-arrow" style="font-size:14px;">→</div>
            <div class="flow-step delivered" style="font-size:10.5px;padding:6px 12px;">Delivered</div>
          </div>
        </div>
        <div>
          <div class="flow" style="gap:6px;">
            <div style="font-size:11px;color:var(--muted);">Any stage →</div>
            <div class="flow-step cancelled" style="font-size:10.5px;padding:6px 12px;">Cancelled</div>
            <span style="font-size:10.5px;color:var(--muted);">(Admin action)</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">payment.transactionDetails Sub-fields</div>
      <table style="font-size:10.5px;">
        <thead><tr><th>Sub-field</th><th>Type</th><th>When</th></tr></thead>
        <tbody>
          <tr><td><code>transactionType</code></td><td>String</td><td>All online</td></tr>
          <tr><td><code>status</code></td><td>String</td><td>All online</td></tr>
          <tr><td><code>amount</code></td><td>String</td><td>All online</td></tr>
          <tr><td><code>currencyIsoCode</code></td><td>String</td><td>All online</td></tr>
          <tr><td><code>processorResponseCode</code></td><td>String</td><td>All online</td></tr>
          <tr><td><code>cardType</code> / <code>last4</code></td><td>String</td><td>Card only</td></tr>
          <tr><td><code>paypalEmail</code></td><td>String</td><td>PayPal only</td></tr>
          <tr><td><code>googlePayLast4</code></td><td>String</td><td>Google Pay</td></tr>
          <tr><td><code>applePayLast4</code></td><td>String</td><td>Apple Pay</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — orders</span><span>Slide 12</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 13  — SECTION: BRANDS
═══════════════════════════════════════════════════════════════════ -->
<div class="slide section-slide">
  <div class="accent-blob"></div>
  <div class="num">04</div>
  <p class="section-label">Collection 04 / 04</p>
  <h2>brands <br/>Collection</h2>
  <p class="desc">Manufacturer catalogue powering the brand filter in the public catalog. Logos stored as base64-encoded strings directly in the document.</p>
  <div class="footer" style="margin-top:24px;"><span class="brand">ReBike</span><span>Data Dictionary — brands</span><span>Slide 13</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 14  — BRANDS FIELD TABLE
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title"><span>brands</span> — Field Reference</div>
  <div class="note-box" style="margin-bottom:8px;"><strong>Model:</strong> Inline schema in <code>backend/routes/brandRouters.js</code> &nbsp;·&nbsp; <strong>No external FK references</strong></div>

  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Required</th><th>Default</th><th>Constraints / Notes</th></tr>
    </thead>
    <tbody>
      <tr><td><code>_id</code></td><td>ObjectId</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>MongoDB primary key</td></tr>
      <tr><td><code>name</code></td><td>String</td><td><span class="badge badge-req">Required</span></td><td>—</td><td><strong>Unique</strong> constraint. Brand display name e.g. <code>"Yamaha"</code>, <code>"KTM"</code>, <code>"Bajaj"</code></td></tr>
      <tr><td><code>slug</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td>—</td><td>URL-safe version of name. Auto-generated: <code>name.toLowerCase().replace(/\s+/g, '-')</code></td></tr>
      <tr><td><code>brandPictures</code></td><td>String</td><td><span class="badge badge-no">Optional</span></td><td><code>""</code></td><td>Base64 data URI of brand logo. Uploaded via multipart/form-data, converted in-server. Max file size: <strong>10 MB</strong></td></tr>
      <tr><td><code>createdAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps. Brands sorted by <code>createdAt: -1</code></td></tr>
      <tr><td><code>updatedAt</code></td><td>Date</td><td><span class="badge badge-auto">Auto</span></td><td>—</td><td>Mongoose timestamps</td></tr>
    </tbody>
  </table>

  <div style="margin-top:14px;">
    <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">API Operations (Admin-only except GET)</div>
    <table style="font-size:11px;">
      <thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Action</th></tr></thead>
      <tbody>
        <tr><td><span class="method get">GET</span></td><td><code>/api/brand/getAll-brand</code></td><td>Public</td><td>Returns all brands sorted by newest first</td></tr>
        <tr><td><span class="method get">GET</span></td><td><code>/api/brand/getBrandBtId-brand/:slug</code></td><td>Public</td><td>Find by slug, falls back to ObjectId lookup</td></tr>
        <tr><td><span class="method post">POST</span></td><td><code>/api/brand/create-brand</code></td><td>Admin</td><td>Create brand with optional logo (multipart)</td></tr>
        <tr><td><span class="method put">PUT</span></td><td><code>/api/brand/update-brand/:id</code></td><td>Admin</td><td>Update name — slug auto-regenerated</td></tr>
        <tr><td><span class="method delete">DEL</span></td><td><code>/api/brand/delete-brand/:id</code></td><td>Admin</td><td>Hard-delete brand document</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — brands</span><span>Slide 14</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 15  — ENVIRONMENT VARIABLES
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">Environment <span>Variables</span></div>
  <div class="note-box" style="margin-bottom:8px;"><strong>File:</strong> <code>backend/.env</code> &nbsp;·&nbsp; Loaded via <code>dotenv</code>. Never commit this file to version control.</div>

  <table>
    <thead>
      <tr><th>Variable</th><th>Default/Example</th><th>Used In</th><th>Purpose</th></tr>
    </thead>
    <tbody>
      <tr class="highlight-row"><td><code class="env-key">PORT</code></td><td><code>5000</code></td><td>server.js</td><td>HTTP server listening port</td></tr>
      <tr class="highlight-row"><td><code class="env-key">MONGO_URI</code></td><td><code>mongodb+srv://…/rebike</code></td><td>server.js</td><td>MongoDB Atlas connection string. Database name = <code>rebike</code></td></tr>
      <tr class="highlight-row"><td><code class="env-key">JWT_SECRET</code></td><td><code>your-secret</code></td><td>authMiddleware.js</td><td>Symmetric key for signing &amp; verifying JWT tokens (HS256). Keep long &amp; random in production</td></tr>
      <tr class="highlight-row"><td><code class="env-key">BRAINTREE_MERCHANT_ID</code></td><td><code>jz6tpkcx…</code></td><td>braintreeRoutes.js</td><td>Braintree merchant account identifier</td></tr>
      <tr class="highlight-row"><td><code class="env-key">BRAINTREE_PUBLIC_KEY</code></td><td><code>rqywkzvy…</code></td><td>braintreeRoutes.js</td><td>Braintree API public key for gateway auth</td></tr>
      <tr class="highlight-row"><td><code class="env-key">BRAINTREE_PRIVATE_KEY</code></td><td><code>bd7f8e55…</code></td><td>braintreeRoutes.js</td><td>Braintree API private key — keep strictly secret</td></tr>
      <tr class="highlight-row"><td><code class="env-key">FAST2SMS_API_KEY</code></td><td><code>wDBN2qMw…</code></td><td>services/smsService.js</td><td>Fast2SMS API key for dispatching SMS notifications to buyers, sellers &amp; admins</td></tr>
    </tbody>
  </table>

  <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
    <div class="card" style="flex:1;min-width:180px;">
      <div class="card-icon">🔐</div>
      <div class="card-title">Auth (JWT)</div>
      <div class="card-desc">Token signed with JWT_SECRET, embeds user id + role. Expires in 1 day.</div>
    </div>
    <div class="card" style="flex:1;min-width:180px;">
      <div class="card-icon">💳</div>
      <div class="card-title">Payments (Braintree)</div>
      <div class="card-desc">Sandbox environment. Switch to Production by changing <code>Environment.Sandbox</code>.</div>
    </div>
    <div class="card" style="flex:1;min-width:180px;">
      <div class="card-icon">📱</div>
      <div class="card-title">SMS (Fast2SMS)</div>
      <div class="card-desc">Notifications fire after order placement, non-blocking via <code>setImmediate()</code>.</div>
    </div>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — Config</span><span>Slide 15</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 16  — API ROUTES (Auth + User)
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">API Routes — <span>Auth &amp; User</span></div>

  <table>
    <thead>
      <tr><th>Method</th><th>Endpoint</th><th>Auth Required</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><span class="method post">POST</span></td><td><code>/api/auth/register</code></td><td>Public</td><td>Register new account. Accepts name, email, password, role, phone</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/auth/login</code></td><td>Public</td><td>Authenticate and receive JWT + user object (password excluded)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/auth/admin-auth</code></td><td>Admin JWT</td><td>Verify that the request token belongs to an admin role</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/auth/seller-auth</code></td><td>Seller JWT</td><td>Verify that the request token belongs to a seller role</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/auth/user-auth</code></td><td>User JWT</td><td>Verify that the request token belongs to a regular user role</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/auth/stats</code></td><td>Admin</td><td>Returns total users, sellers, admins, bikes (pending/approved/rejected)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/auth/users</code></td><td>Admin</td><td>List all users (password excluded), sorted by newest</td></tr>
      <tr><td><span class="method patch">PATCH</span></td><td><code>/api/auth/users/:id/role</code></td><td>Admin</td><td>Promote or demote a user's role. Validated against enum</td></tr>
      <tr><td><span class="method delete">DEL</span></td><td><code>/api/auth/users/:id</code></td><td>Admin</td><td>Delete a user. Cannot delete own account</td></tr>
      <tr><td><span class="method put">PUT</span></td><td><code>/api/user/profileUpdate</code></td><td>Any JWT</td><td>Update name, email, phone, address, password (optional re-hash)</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/user/placeOrder</code></td><td>Any JWT</td><td>Legacy order placement endpoint (no SMS)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/user/orders</code></td><td>Any JWT</td><td>Get own order history with populated buyer + bikes</td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — API Routes</span><span>Slide 16</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 17  — API ROUTES (Bikes)
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">API Routes — <span>Bikes</span></div>

  <table>
    <thead>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/approved</code></td><td>Public</td><td>Paginated approved listings. Query: <code>?brand ?search ?minPrice ?maxPrice ?page ?limit</code></td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/:id</code></td><td>Public</td><td>Single bike by ObjectId. Returns full bike with seller name + email</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/admin/all</code></td><td>Admin</td><td>All bikes. <code>?withImages=true</code> for card view. Paginated</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/admin/pending</code></td><td>Admin</td><td>All pending listings (no images returned by default)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/admin/approved</code></td><td>Admin</td><td>All approved listings (no images returned)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/bike/admin/rejected</code></td><td>Admin</td><td>All rejected listings (no images returned)</td></tr>
      <tr><td><span class="method put">PUT</span></td><td><code>/api/bike/admin/approve/:id</code></td><td>Admin</td><td>Set status → approved &amp; clear rejectionReason</td></tr>
      <tr><td><span class="method put">PUT</span></td><td><code>/api/bike/admin/reject/:id</code></td><td>Admin</td><td>Set status → rejected with reason in request body</td></tr>
      <tr><td><span class="method delete">DEL</span></td><td><code>/api/bike/admin/:id</code></td><td>Admin</td><td>Hard-delete any bike listing</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/bike/admin/create</code></td><td>Admin</td><td>Create pre-approved listing (multipart, max 10 images)</td></tr>
      <tr><td><span class="method put">PUT</span></td><td><code>/api/bike/admin/update/:id</code></td><td>Admin</td><td>Update any listing field including status</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/seller/bikes</code></td><td>Seller</td><td>Submit listing (JSON base64 images[], min 3 max 5). Status auto → pending</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/seller/bikes</code></td><td>Seller</td><td>Own listings only (images excluded from response)</td></tr>
      <tr><td><span class="method put">PUT</span></td><td><code>/api/seller/bikes/:id</code></td><td>Seller</td><td>Update own listing. Blocks: seller, status, rejectionReason fields</td></tr>
      <tr><td><span class="method delete">DEL</span></td><td><code>/api/seller/bikes/:id</code></td><td>Seller</td><td>Delete own listing only</td></tr>
    </tbody>
  </table>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — API Routes</span><span>Slide 17</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 18  — API ROUTES (Orders + Payments)
═══════════════════════════════════════════════════════════════════ -->
<div class="slide content-slide">
  <div class="slide-title">API Routes — <span>Orders &amp; Payments</span></div>

  <table>
    <thead>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><span class="method post">POST</span></td><td><code>/api/orders/place-order</code></td><td>User JWT</td><td>Place COD order. Sends SMS to buyer, seller &amp; all admins (non-blocking)</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/orders/all</code></td><td>Admin</td><td>All orders with populated buyer (name/email) + bikes (brand/model/year/price)</td></tr>
      <tr><td><span class="method patch">PATCH</span></td><td><code>/api/orders/:id/status</code></td><td>Admin</td><td>Update order status. Validated against 5-value enum</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/braintree/token</code></td><td>Any JWT</td><td>Generate Braintree client token for Drop-In UI initialization</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/braintree/payment</code></td><td>Any JWT</td><td>Process payment via nonce. Saves order on success. Sends SMS notifications</td></tr>
      <tr><td><span class="method get">GET</span></td><td><code>/api/braintree/orders</code></td><td>Any JWT</td><td>Logged-in user's order history including bike images</td></tr>
      <tr><td><span class="method post">POST</span></td><td><code>/api/braintree/webhook</code></td><td>Public</td><td>Braintree webhook handler. Updates order status on settlement/decline events</td></tr>
    </tbody>
  </table>

  <div style="margin-top:14px;">
    <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">SMS Notification Triggers</div>
    <table style="font-size:11px;">
      <thead><tr><th>Event</th><th>Recipient</th><th>Message Contains</th></tr></thead>
      <tbody>
        <tr><td>Order placed (COD or Online)</td><td>Buyer</td><td>Bike name + Order ID</td></tr>
        <tr><td>Order placed (COD or Online)</td><td>Seller</td><td>Bike name + Buyer name + Buyer phone</td></tr>
        <tr><td>Order placed (COD or Online)</td><td>All Admin accounts</td><td>Bike name + Buyer name + Seller name</td></tr>
      </tbody>
    </table>
  </div>

  <div class="footer"><span class="brand">ReBike</span><span>Data Dictionary — API Routes</span><span>Slide 18</span></div>
</div>

<!-- ═══════════════════════════════════════════════════════════════════
     SLIDE 19  — THANK YOU / END
═══════════════════════════════════════════════════════════════════ -->
<div class="slide cover" style="background:radial-gradient(ellipse at 80% 50%, #1a1040 0%, var(--dark) 60%);">
  <div class="logo-ring" style="background:linear-gradient(135deg,var(--teal),var(--accent));">🏍️</div>
  <h1 style="font-size:38px;">End of Dictionary</h1>
  <p class="subtitle" style="font-size:16px;">ReBike — Used Motorcycle Marketplace</p>
  <div style="display:flex;gap:16px;margin-top:16px;flex-wrap:wrap;justify-content:center;">
    <span class="pill" style="border-color:rgba(67,198,172,.4);color:var(--teal);">4 Collections · 39 Fields</span>
    <span class="pill" style="border-color:rgba(255,101,132,.4);color:var(--accent);">35+ API Endpoints</span>
    <span class="pill">MongoDB Atlas · Node.js · Express</span>
  </div>
  <p class="meta" style="margin-top:20px;color:var(--muted);font-size:11px;letter-spacing:1px;">Generated ${new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" })}</p>
</div>

</body>
</html>`;

(async () => {
  const outputPath = path.join(__dirname, "ReBike_Data_Dictionary.pdf");

  console.log("🚀 Launching Puppeteer...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  console.log("📄 Loading HTML content...");
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Wait for Google Fonts
  await new Promise(r => setTimeout(r, 2000));

  console.log("🖨️  Generating PDF...");
  await page.pdf({
    path: outputPath,
    width: "297mm",
    height: "210mm",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`✅ PDF saved → ${outputPath}  (${sizeKB} KB)`);
})();
