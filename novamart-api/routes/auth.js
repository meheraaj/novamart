const router = require("express").Router();
const fs = require('fs');
const path = require('path');
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // Using bcryptjs as installed
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10), // Hash password
      role: req.body.role || 'user',
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "User not found with this email" });
    }

    // Compare hashed password
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    // Fallback for plain text (for existing seed data if not updated)
    const isPlainValid = user.password === req.body.password;

    console.log(`Login Attempt for ${req.body.email}:`);
    console.log(`- User Found: Yes`);
    console.log(`- Stored Password (starts with): ${user.password.substring(0, 10)}...`);
    console.log(`- Input Password (starts with): ${req.body.password.substring(0, 2)}...`);
    console.log(`- Hash Valid: ${isPasswordValid}`);
    console.log(`- Plain Valid: ${isPlainValid}`);

    if (!isPasswordValid && !isPlainValid) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.role === "admin",
      },
      process.env.JWT_SEC || "secret",
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
