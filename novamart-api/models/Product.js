const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Preserving original ID
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  image: {
    id: Number,
    thumbnail: String,
    original: String
  },
  gallery: [{
    id: Number,
    thumbnail: String,
    original: String
  }],
  quantity: Number,
  price: Number,
  sale_price: Number,
  unit: String,
  tag: [{
    id: Number,
    name: String,
    slug: String
  }],
  product_type: String,
  max_price: Number,
  min_price: Number,
  variations: [mongoose.Schema.Types.Mixed], // Flexible schema for variations
  variation_options: [mongoose.Schema.Types.Mixed],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
