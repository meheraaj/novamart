const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');

// GET /api/brands
router.get('/', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ data: brands });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
