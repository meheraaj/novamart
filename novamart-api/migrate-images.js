const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';
const OLD_PATH = '/assets/images/products/';
const NEW_PATH = '/uploads/products/';

const migrateImages = async () => {
  try {
    await mongoose.connect(process.env.mongouri || "mongodb://localhost:27017/shopifyAdmin");
    console.log('MongoDB Connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products. Starting migration...`);

    let count = 0;
    for (const product of products) {
      let modified = false;

      // Update Main Image
      if (product.image) {
        if (product.image.thumbnail && product.image.thumbnail.includes(OLD_PATH)) {
          product.image.thumbnail = product.image.thumbnail.replace(OLD_PATH, `${BASE_URL}${NEW_PATH}`);
          modified = true;
        }
        if (product.image.original && product.image.original.includes(OLD_PATH)) {
          product.image.original = product.image.original.replace(OLD_PATH, `${BASE_URL}${NEW_PATH}`);
          modified = true;
        }
      }

      // Update Gallery
      if (product.gallery && product.gallery.length > 0) {
        product.gallery.forEach(img => {
          if (img.thumbnail && img.thumbnail.includes(OLD_PATH)) {
            img.thumbnail = img.thumbnail.replace(OLD_PATH, `${BASE_URL}${NEW_PATH}`);
            modified = true;
          }
          if (img.original && img.original.includes(OLD_PATH)) {
            img.original = img.original.replace(OLD_PATH, `${BASE_URL}${NEW_PATH}`);
            modified = true;
          }
        });
      }

      if (modified) {
        await Product.updateOne({ _id: product._id }, { $set: { image: product.image, gallery: product.gallery } });
        count++;
      }
    }

    console.log(`Migration completed. Updated ${count} products.`);
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

migrateImages();
