const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: Number,
  title: String,
  default: Boolean,
  type: String,
  card: {
    name: String,
    address_country: String,
    number: String,
    address_zip: String,
    last4: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
