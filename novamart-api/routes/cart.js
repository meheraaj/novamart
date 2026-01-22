const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { verifyToken } = require("../middleware/verifyToken");

// GET /api/cart - Get user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart - Sync entire cart (simplest approach for now)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, totalItems, totalPrice } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    cart.items = items;
    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
