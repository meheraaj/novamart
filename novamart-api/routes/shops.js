const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// GET /api/shops
router.get('/', async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/shops/:slug
router.get('/:slug', async (req, res) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.slug });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
