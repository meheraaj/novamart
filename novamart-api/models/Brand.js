const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  id: { type: Number },
  name: String,
  slug: String,
  image: {
    id: Number,
    thumbnail: String,
    original: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
