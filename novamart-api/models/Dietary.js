const mongoose = require('mongoose');

const dietarySchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String
}, { timestamps: true });

module.exports = mongoose.model('Dietary', dietarySchema);
