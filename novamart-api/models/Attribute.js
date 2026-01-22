const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  id: { type: Number },
  title: String,
  slug: String,
  values: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Attribute', attributeSchema);
