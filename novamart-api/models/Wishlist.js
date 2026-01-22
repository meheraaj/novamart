const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String },
  name: String,
  slug: String,
  description: String,
  image: mongoose.Schema.Types.Mixed,
  gallery: [mongoose.Schema.Types.Mixed],
  quantity: Number,
  price: Number,
  sale_price: Number,
  unit: String,
  tag: [mongoose.Schema.Types.Mixed],
  variations: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
