const express = require('express');
const router = express.Router();
const Widget = require('../models/Widget');
const Product = require('../models/Product'); // Assuming we need to validate or fetch product
const { verifyToken } = require("../middleware/verifyToken"); // Ensure we have this or similar

// GET /api/widgets/:slug - Get widget settings
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        let widget = await Widget.findOne({ slug });

        if (!widget) {
            return res.status(404).json({ message: 'Widget not found' });
        }

        // Optional: Populate product details if needed, or let frontend do it
        // For 'deals-of-week', let's attach the product if it exists
        if (widget.slug === 'deals-of-week' && widget.settings.targetProductId) {
            // Try finding by _id (Mongo) or id (String custom ID)
            let product = await Product.findOne({ id: widget.settings.targetProductId });
            if (!product) product = await Product.findById(widget.settings.targetProductId);

            if (product) {
                const widgetObj = widget.toObject();
                widgetObj.product = product;
                return res.json(widgetObj);
            }
        }

        res.json(widget);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/widgets/:slug - Update widget settings (Admin only ideally)
// For simplicty, I'm waiting on verifyToken if specifically requested, else open for now or add mock auth
router.post('/:slug', async (req, res) => {
    try {
        // In a real app, check for Admin role here
        const { slug } = req.params;
        const { type, title, settings, isActive } = req.body;

        const widget = await Widget.findOneAndUpdate(
            { slug },
            { type, title, settings, isActive },
            { new: true, upsert: true }
        );

        res.json(widget);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
