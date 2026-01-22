const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('./models/Order');

mongoose.connect(process.env.mongouri || 'mongodb://localhost:27017/shopifyAdmin')
    .then(async () => {
        console.log('Connected to MongoDB');
        const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
        console.log(`Found ${orders.length} orders`);

        orders.forEach(o => {
            console.log(`Order ID: ${o.id}, Total: ${o.total}, CreatedAt: ${o.createdAt}, Type: ${typeof o.createdAt}, IsDate: ${o.createdAt instanceof Date}`);
        });

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        console.log('Start Date (7d ago):', startDate.toISOString());

        const count = await Order.countDocuments({ createdAt: { $gte: startDate } });
        console.log('Orders >= startDate (Date object):', count);

        const countStr = await Order.countDocuments({ createdAt: { $gte: startDate.toISOString() } });
        console.log('Orders >= startDate (ISO String):', countStr);

        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
