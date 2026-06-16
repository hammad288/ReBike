const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const SLIDES_DIR = "C:\\Users\\Hammad\\.gemini\\antigravity\\brain\\8f1a04fb-e9c4-405a-b6e8-db0525803753";

function imgToBase64(filename) {
  const files = fs.readdirSync(SLIDES_DIR).filter(f => f.startsWith(filename));
  if (!files.length) return "";
  const buf = fs.readFileSync(path.join(SLIDES_DIR, files[0]));
  return "data:image/png;base64," + buf.toString("base64");
}

const s1  = imgToBase64("slide_01_title");
const s2  = imgToBase64("slide_02_problem");
const s3  = imgToBase64("slide_03_solution");
const s4  = imgToBase64("slide_04_features");
const s5  = imgToBase64("slide_05_techstack");
const s6  = imgToBase64("slide_06_verification");
const s7  = imgToBase64("slide_07_learnings");
const s8  = imgToBase64("slide_08_cta");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>ReBike — LinkedIn Showcase</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#0a192f;color:#fff;}
  .page{width:297mm;min-height:210mm;max-height:210mm;overflow:hidden;page-break-after:always;position:relative;display:flex;flex-direction:column;}

  /* ── COVER ── */
  .cover{background:linear-gradient(135deg,#0a192f 0%,#112240 60%,#1a3a6b 100%);align-items:center;justify-content:center;text-align:center;gap:0;}
  .cover-inner{display:flex;flex-direction:column;align-items:center;gap:18px;padding:40px;}
  .brand-ring{width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:42px;box-shadow:0 0 50px rgba(124,58,237,.5);}
  .cover h1{font-size:64px;font-weight:900;letter-spacing:-2px;background:linear-gradient(135deg,#fff 0%,#64ffda 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .cover .sub{font-size:20px;color:rgba(255,255,255,.6);font-weight:300;margin-top:-8px;}
  .cover .tag{font-size:26px;font-weight:800;color:#64ffda;letter-spacing:4px;margin-top:4px;}
  .cover .built{font-size:13px;color:rgba(255,255,255,.35);letter-spacing:2px;text-transform:uppercase;margin-top:12px;}
  .pills{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:8px;}
  .pill{background:rgba(100,255,218,.08);border:1px solid rgba(100,255,218,.25);color:#64ffda;border-radius:999px;padding:6px 18px;font-size:13px;font-weight:600;}

  /* ── SLIDE IMAGE ── */
  .slide-img-page{background:#0a192f;}
  .slide-img-page img{width:100%;height:210mm;object-fit:contain;object-position:center;}

  /* ── POST PAGE ── */
  .post-page{background:#f8fafc;color:#1e293b;padding:36px 44px;gap:0;}
  .post-header{background:linear-gradient(135deg,#0a192f,#1e3a5f);color:#fff;border-radius:16px;padding:24px 30px;margin-bottom:24px;}
  .post-header .ph-title{font-size:22px;font-weight:800;color:#64ffda;}
  .post-header .ph-sub{font-size:13px;color:rgba(255,255,255,.55);margin-top:4px;}
  .post-body{font-size:11.5px;line-height:1.75;color:#334155;white-space:pre-wrap;flex:1;}
  .post-body strong{color:#0f172a;font-weight:700;}
  .hashtags{margin-top:16px;font-size:10.5px;color:#6366f1;font-weight:600;line-height:1.8;border-top:1px solid #e2e8f0;padding-top:12px;}

  /* ── TIPS PAGE ── */
  .tips-page{background:#fff;color:#1e293b;padding:36px 44px;}
  .tips-page h2{font-size:22px;font-weight:800;color:#7c3aed;margin-bottom:20px;}
  table{width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;}
  thead tr{background:linear-gradient(90deg,rgba(124,58,237,.12),rgba(6,182,212,.08));}
  thead th{padding:9px 12px;text-align:left;font-weight:700;font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;color:#7c3aed;border-bottom:2px solid #e2e8f0;}
  tbody tr{border-bottom:1px solid #f1f5f9;}
  tbody td{padding:8px 12px;vertical-align:top;line-height:1.5;}
  .cmt-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;font-size:11px;color:#475569;font-family:monospace;line-height:1.8;}
  .cmt-box .cmt-title{font-weight:700;color:#7c3aed;margin-bottom:8px;font-family:'Inter',sans-serif;font-size:13px;}

  /* ── FOOTER ── */
  .footer{position:absolute;bottom:14px;left:0;right:0;display:flex;justify-content:space-between;padding:0 44px;font-size:10px;color:rgba(255,255,255,.25);}
  .footer .brand{color:#64ffda;font-weight:700;}
  .footer-dark{color:#94a3b8!important;}
  .footer-dark .brand{color:#7c3aed!important;}

  .accent-bar{position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#64ffda);}
</style>
</head>
<body>

<!-- ══ PAGE 1: COVER ══ -->
<div class="page cover">
  <div class="accent-bar"></div>
  <div class="cover-inner">
    <div class="brand-ring">🏍️</div>
    <h1>ReBike</h1>
    <div class="sub">A Full-Stack MERN Marketplace for Used Bikes</div>
    <div class="tag">BUY &nbsp;·&nbsp; SELL &nbsp;·&nbsp; VERIFY</div>
    <div class="pills">
      <span class="pill">⚛️ React.js</span>
      <span class="pill">🟢 Node.js</span>
      <span class="pill">🍃 MongoDB</span>
      <span class="pill">🔐 JWT Auth</span>
      <span class="pill">💳 Braintree Payments</span>
    </div>
    <div class="built">BSc Information Technology — Final Year Project</div>
  </div>
  <div class="footer">
    <span class="brand">ReBike</span>
    <span>LinkedIn Project Showcase</span>
    <span>Page 1</span>
  </div>
</div>

<!-- ══ PAGE 2–9: CAROUSEL SLIDES ══ -->
${[s1,s2,s3,s4,s5,s6,s7,s8].map((src,i)=>`
<div class="page slide-img-page">
  <img src="${src}" alt="Slide ${i+1}"/>
  <div class="footer">
    <span class="brand">ReBike</span>
    <span>Carousel Slide ${i+1} of 8</span>
    <span>Page ${i+2}</span>
  </div>
</div>`).join("")}

<!-- ══ PAGE 10: LINKEDIN POST ══ -->
<div class="page post-page">
  <div class="accent-bar"></div>
  <div class="post-header">
    <div class="ph-title">📝 LinkedIn Post Caption</div>
    <div class="ph-sub">Copy and paste this directly into LinkedIn when creating your post</div>
  </div>
  <div class="post-body">🚀 <strong>Excited to share my final year project — ReBike!</strong>

A full-stack web application I built from scratch that lets users <strong>buy and sell used bikes online</strong> — with a strong focus on <strong>security, trust, and transparency</strong>.

🔍 <strong>The Problem I Solved:</strong>
The used bike market is filled with unverified listings, unclear ownership, and fraudulent sellers. I wanted to build a platform that addresses this directly.

💡 <strong>The Solution — ReBike:</strong>
Before any bike can be listed for sale, the seller must complete a <strong>Vehicle Verification Process</strong> that includes:
📄 RC Book (Front &amp; Back) · 🔢 Registration &amp; Chassis Number · ⚙️ Engine Number · 🪪 Govt. ID · 📸 4-Angle Bike Photos · 📑 Insurance Certificate · ✅ Legal Declaration

The listing only goes <strong>live after Admin Approval</strong> — making ReBike a genuinely trusted marketplace.

🛠️ <strong>Tech Stack:</strong>
→ Frontend: React.js, JavaScript, HTML, CSS
→ Backend: Node.js, Express.js
→ Database: MongoDB · Auth: JWT · Payments: Braintree

✨ <strong>Key Features:</strong> JWT Auth · Bike Search &amp; Filters · Multi-Image Listings · Seller Dashboard · Admin Dashboard · Secure Payments · Vehicle Ownership Verification · SMS Notifications · Responsive Design

📚 <strong>What I Learned:</strong> Full-Stack Architecture · Security (JWT, RBAC) · API Design · UX &amp; Trust · Admin Moderation Systems

🎓 This was my <strong>BSc IT final year project</strong>. I'm currently <strong>open to full-stack developer opportunities</strong>!</div>
  <div class="hashtags">#MERN #ReactJS #NodeJS #MongoDB #FullStackDeveloper #WebDevelopment #JavaScript #OpenToWork #SoftwareDeveloper #FreshGraduate #PortfolioProject #BScIT #IndianDeveloper #HiringAlert #Developer #WebDev</div>
  <div class="footer footer-dark">
    <span class="brand">ReBike</span>
    <span>LinkedIn Caption</span>
    <span>Page 10</span>
  </div>
</div>

<!-- ══ PAGE 11: TIPS ══ -->
<div class="page tips-page">
  <div class="accent-bar"></div>
  <h2>📌 Posting Strategy & Tips</h2>
  <table>
    <thead><tr><th>Tip</th><th>Why It Works</th></tr></thead>
    <tbody>
      <tr><td>Post <strong>Tuesday/Wednesday 8–10 AM IST</strong></td><td>Peak LinkedIn engagement window in India</td></tr>
      <tr><td>Add <strong>actual app screenshots</strong> as extra slides</td><td>Real UI builds more recruiter credibility than diagrams</td></tr>
      <tr><td>Tag <strong>2–3 classmates</strong> in the post</td><td>Early comments signal quality to LinkedIn algorithm</td></tr>
      <tr><td>Reply to <strong>every comment</strong> in the first hour</td><td>Boosts post reach significantly</td></tr>
      <tr><td>Put <strong>GitHub link in first comment</strong>, not caption</td><td>LinkedIn suppresses external links in post body</td></tr>
      <tr><td><strong>Pin this post</strong> to your profile</td><td>Hiring managers visiting your profile see it first</td></tr>
    </tbody>
  </table>
  <div class="cmt-box">
    <div class="cmt-title">💬 First Comment Template (paste right after posting)</div>
🔗 GitHub Repository: [your-github-link-here]
🌐 Live Demo: [your-live-link-here]

Built this project to solve a real problem in the used bike market.
Open to full-stack developer roles — feel free to reach out! 🙌
  </div>
  <div class="footer footer-dark">
    <span class="brand">ReBike</span>
    <span>Posting Strategy</span>
    <span>Page 11</span>
  </div>
</div>

</body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await new Promise(r => setTimeout(r, 1000));
  await page.pdf({
    path: "C:\\Users\\Hammad\\OneDrive\\Desktop\\ReBike\\ReBike_LinkedIn_Showcase.pdf",
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
  console.log("✅ PDF saved: ReBike_LinkedIn_Showcase.pdf");
})();
