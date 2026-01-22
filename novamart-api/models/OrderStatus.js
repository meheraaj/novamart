const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  id: Number,
  name: String,
  serial: Number,
  color: String,
  created_at: String,
  updated_at: String
}, { timestamps: true });

module.exports = mongoose.model('OrderStatus', orderStatusSchema);
