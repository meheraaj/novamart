const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: Number },
  title: String,
  default: Boolean,
  address: {
    lat: Number,
    lng: Number,
    formatted_address: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
