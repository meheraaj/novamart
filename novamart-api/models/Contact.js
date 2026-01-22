const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  id: Number,
  title: String,
  default: Boolean,
  number: String
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
