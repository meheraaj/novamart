const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: {
    id: Number,
    thumbnail: String,
    original: String
  },
  icon: String,
  children: [mongoose.Schema.Types.Mixed] // Recursive or nested structure
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
