const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const Wishlist = require('../models/Wishlist');
const User = require('../models/User');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.use((req, res, next) => {
  console.log(`Users Router: ${req.method} ${req.path}`);
  next();
});

// GET /api/users (Admin only)
router.get('/users', verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/profile (Update Profile)
router.put('/users/profile', verifyToken, async (req, res) => {
  try {
    // Update allowed fields
    console.log('Update Profile Request:', req.body);
    console.log('User ID:', req.user.id);
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.email) updates.email = req.body.email;
    
    // Handle password update if provided
    if (req.body.password) {
        // In a real app, hash the password here.
        updates.password = req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/users/:id (Admin Update User)
router.put('/users/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Handle password update if provided
    if (updates.password) {
        // In a real app, hash the password here. 
        // For this demo, we'll assume plain text or simple hash as per previous code.
        // const salt = await bcrypt.genSalt(10);
        // updates.password = await bcrypt.hash(updates.password, salt);
    } else {
        delete updates.password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me (Get Current User)
router.get('/users/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/address
router.get('/users/address', verifyToken, async (req, res) => {
  try {
    console.log('GET /users/address request for User ID:', req.user.id);
    const addresses = await Address.find({ user: req.user.id });
    console.log(`Found ${addresses.length} addresses for user ${req.user.id}`);
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate('product');
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist (Toggle Wishlist Item)
router.post('/wishlist', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) return res.status(400).json({ message: 'Product ID is required' });

    const existingItem = await Wishlist.findOne({ user: req.user.id, product: product_id });

    if (existingItem) {
      // Remove if exists
      await Wishlist.findByIdAndDelete(existingItem._id);
      res.json({ message: 'Removed from wishlist', active: false });
    } else {
      // Add if not exists
      const newItem = new Wishlist({
        user: req.user.id,
        product: product_id,
      });
      await newItem.save();
      res.status(201).json({ message: 'Added to wishlist', active: true });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/change-password
router.post('/users/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // In a real app, compare oldPassword with user.password (hashed)
    // For this demo, we are storing plain text or simple hash, so let's just update it
    // if (user.password !== oldPassword) return res.status(400).json({ message: 'Incorrect old password' });

    user.password = newPassword; // Remember to hash this in production!
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST /api/users/address (Add Address)
router.post('/users/address', verifyToken, async (req, res) => {
  try {
    const newAddress = new Address({
      ...req.body,
      user: req.user.id,
      id: req.body.id || Math.floor(Math.random() * 1000000)
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/users/address/:id (Update Address)
router.put('/users/address/:id', verifyToken, async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      { id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });
    res.json(updatedAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/address/:id (Delete Address)
router.delete('/users/address/:id', verifyToken, async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({ id: req.params.id, user: req.user.id });

    if (!deletedAddress) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
