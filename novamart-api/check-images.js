const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const checkImages = async () => {
  try {
    await mongoose.connect(process.env.mongouri || "mongodb://localhost:27017/shopifyAdmin");
    console.log('MongoDB Connected');

    const product = await Product.findOne();
    if (product) {
      console.log('Thumbnail:', product.image.thumbnail);
      console.log('Original:', product.image.original);
      if (product.gallery && product.gallery.length > 0) {
        console.log('Gallery 0 Thumbnail:', product.gallery[0].thumbnail);
      }
    } else {
      console.log('No products found.');
    }
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkImages();
