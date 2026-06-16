const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Multer — memory storage, convert to base64
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Brand schema (inline, reuse if already compiled)
const brandSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String },
    brandPictures: { type: String, default: '' },
}, { timestamps: true });

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);

// GET all brands (public)
router.get("/getAll-brand", async (req, res) => {
    try {
        const brands = await Brand.find({}).sort({ createdAt: -1 });
        res.json({ success: true, brands });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET brand by slug or id (public)
router.get("/getBrandBtId-brand/:slug", async (req, res) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug }) ||
            await Brand.findById(req.params.slug).catch(() => null);
        if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
        res.json({ success: true, brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create brand — accepts multipart/form-data with optional image
router.post("/create-brand", verifyToken, isAdmin, upload.single("brandPictures"), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Brand name is required" });

        const slug = name.toLowerCase().replace(/\s+/g, '-');

        let brandPictures = '';
        if (req.file) {
            brandPictures = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        }

        const brand = new Brand({ name, slug, brandPictures });
        await brand.save();
        res.json({ success: true, message: "Brand created successfully", brand });
    } catch (error) {
        console.error("Create brand error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update brand
router.put("/update-brand/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const brand = await Brand.findByIdAndUpdate(req.params.id, { name, slug }, { returnDocument: 'after' });
        if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
        res.json({ success: true, message: "Brand updated", brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE brand
router.delete("/delete-brand/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });
        res.json({ success: true, message: "Brand deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
