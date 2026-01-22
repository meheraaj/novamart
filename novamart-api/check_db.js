const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

mongoose.connect(process.env.mongouri || "mongodb://localhost:27017/shopifyAdmin")
  .then(async () => {
    console.log("Connected");
    const count = await Product.countDocuments();
    console.log('Total Products:', count);
    
    const badName = await Product.find({ name: { $exists: false } });
    console.log('Missing Name:', badName.length);
    
    const nullProduct = await Product.find({ name: null });
    console.log('Null Name:', nullProduct.length);

    const noSalePrice = await Product.find({ sale_price: { $exists: false } });
    console.log('Missing Sale Price:', noSalePrice.length);

    if (count > 0) {
        const sample = await Product.findOne();
        console.log('Sample:', JSON.stringify(sample, null, 2));
    }

    process.exit();
  })
  .catch(err => {
      console.error(err);
      process.exit(1);
  });
