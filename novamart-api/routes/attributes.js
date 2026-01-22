const express = require('express');
const router = express.Router();
const Attribute = require('../models/Attribute');

// GET /api/attributes
router.get('/', async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.json(attributes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
