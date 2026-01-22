const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
require('dotenv').config();

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    // Find the dummy user
    const user = await User.findOne({ email: 'dummy@example.com' });
    if (!user) {
        console.error('Dummy user not found. Please run seed.js first.');
        process.exit(1);
    }

    // Find some products
    const products = await Product.find().limit(5);
    if (products.length === 0) {
        console.error('No products found. Please run seed.js first.');
        process.exit(1);
    }

    console.log('Clearing Orders...');
    await Order.deleteMany({});

    console.log('Creating Orders...');
    const orders = [
        {
            id: '1001',
            user: user._id,
            total: 150.50,
            status: { name: 'Pending', color: 'yellow' },
            products: products.map(p => ({
                product: p._id,
                order_quantity: 1,
                unit_price: p.price,
                subtotal: p.price
            })),
            shipping_address: {
                street_address: '123 Main St',
                city: 'New York',
                country: 'USA',
                zip: '10001'
            },
            tracking_number: 'TRK123456789',
            customer_contact: '555-0123'
        },
        {
            id: '1002',
            user: user._id,
            total: 89.99,
            status: { name: 'Delivered', color: 'green' },
            products: [
                {
                    product: products[0]._id,
                    order_quantity: 2,
                    unit_price: products[0].price,
                    subtotal: products[0].price * 2
                }
            ],
            shipping_address: {
                street_address: '456 Elm St',
                city: 'Los Angeles',
                country: 'USA',
                zip: '90001'
            },
            tracking_number: 'TRK987654321',
            customer_contact: '555-0456'
        },
        {
            id: '1003',
            user: user._id,
            total: 25.00,
            status: { name: 'Processing', color: 'blue' },
             products: [
                {
                    product: products[1]._id,
                    order_quantity: 1,
                    unit_price: products[1].price,
                    subtotal: products[1].price
                }
            ],
            shipping_address: {
                street_address: '789 Oak St',
                city: 'Chicago',
                country: 'USA',
                zip: '60601'
            },
            tracking_number: 'TRK456123789',
            customer_contact: '555-0789'
        }
    ];

    await Order.insertMany(orders);
    console.log(`Seeded ${orders.length} orders.`);
    process.exit();
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
};

seedOrders();
