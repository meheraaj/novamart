const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

mongoose.connect(process.env.mongouri || 'mongodb://localhost:27017/shopifyAdmin')
    .then(async () => {
        console.log('Connected to MongoDB');
        const order = await Order.findOne();
        if (order) {
            console.log('SAMPLE ORDER:');
            console.log(JSON.stringify(order, null, 2));
        } else {
            console.log('No orders found');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
