const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // e.g., 'deals-of-week'
    type: { type: String }, // e.g., 'flash-sale'
    title: { type: String }, // For custom titles
    settings: {
        targetProductId: { type: String }, // ID of the product to show
        expiryDate: { type: Date }, // Countdown end date
        // Add other dynamic fields as needed
    },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Widget', widgetSchema);
