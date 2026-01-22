const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  id: { type: String },
  owner_id: Number,
  owner_name: String,
  address: String,
  phone: String,
  website: String,
  ratings: String,
  name: String,
  slug: String,
  description: String,
  cover_image: {
    id: Number,
    thumbnail: String,
    original: String
  },
  logo: {
    id: Number,
    thumbnail: String,
    original: String
  },
  socials: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
