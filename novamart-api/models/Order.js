const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: Number, unique: true },
  tracking_number: String,
  amount: Number,
  total: Number,
  delivery_fee: Number,
  discount: Number,
  status: {
    id: Number,
    name: String,
    serial: Number,
    color: String,
    created_at: String,
    updated_at: String
  },
  delivery_time: String,
  created_at: String, // Keeping as string to match JSON format, or could convert to Date
  products: [mongoose.Schema.Types.Mixed], // Snapshot of products in order
  shipping_address: mongoose.Schema.Types.Mixed,
  contact_number: String,
  delivery_note: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
