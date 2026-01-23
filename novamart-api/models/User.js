const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true }, // In a real app, this would be hashed
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  image: { type: String },
  // Add other fields if needed based on login.json or register.json
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
