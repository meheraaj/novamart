const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { verifyToken } = require('../middleware/verifyToken');

// GET /api/orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/all (Admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders (User Create Order)
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('POST /orders body:', req.body);
    const newOrder = new Order({
      ...req.body,
      user: req.user.id, // Associate with logged-in user
      // Generate a random ID if not provided (or let DB handle _id, but existing data has custom 'id')
      id: req.body.id || Math.floor(Math.random() * 1000000)
    });
    console.log('New Order ID:', newOrder.id);

    const savedOrder = await newOrder.save();

    // Decrement stock for each product
    if (req.body.products && Array.isArray(req.body.products)) {
      for (const item of req.body.products) {
        // Assuming item has productId (or id) and orderQuantity (or quantity)
        // Adjust field names based on actual payload structure
        const productId = item.id || item.productId || item.product_id;
        const quantityOrdered = item.quantity || item.orderQuantity;

        if (productId && quantityOrdered) {
          console.log(`Decrementing stock for product ${productId} by ${quantityOrdered}`);
          const updateResult = await Product.updateOne(
            { id: productId },
            { $inc: { quantity: -quantityOrdered } }
          );
          console.log(`Update result for product ${productId}:`, updateResult);
        } else {
            console.log('Missing productId or quantityOrdered for item:', item);
        }
      }
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/admin/:id (Admin View Single Order)
router.get('/admin/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id }).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id (Admin Update Order - e.g. Status)
router.put('/:id', async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Handle status update if passed as a string
    if (req.body.status && typeof req.body.status === 'string') {
      updateData['status.name'] = req.body.status;
      delete updateData.status;

      // Optional: Set default color based on status
      const colors = {
        'Pending': 'yellow',
        'Processing': 'blue',
        'Shipped': 'purple',
        'Delivered': 'green',
        'Cancelled': 'red'
      };
      if (colors[req.body.status]) {
        updateData['status.color'] = colors[req.body.status];
      }
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateData },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id (User View Own Order)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
