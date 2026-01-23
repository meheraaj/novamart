const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String },
  image: { type: mongoose.Schema.Types.Mixed }, // Can be string or object
  price: { type: Number, required: true },
  sale_price: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  stock: { type: Number },
  attributes: { type: Object }, // For variations
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalItems: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
