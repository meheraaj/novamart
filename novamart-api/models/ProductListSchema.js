const mongoose = require('mongoose');

// Reusing the Product schema structure but for dynamic collections
const productListSchema = new mongoose.Schema({
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
  product_type: String,
  max_price: Number,
  min_price: Number,
  variations: [mongoose.Schema.Types.Mixed],
  variation_options: [mongoose.Schema.Types.Mixed],
  sold: Number // Specific to flash sell
}, { timestamps: true, strict: false }); // strict: false to allow fields we might have missed

module.exports = productListSchema;
