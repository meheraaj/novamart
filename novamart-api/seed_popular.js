const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const productListSchema = require('./models/ProductListSchema');

dotenv.config();

const seedPopular = async () => {
  try {
    await mongoose.connect(process.env.mongouri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    const apiDir = path.join('e:', 'Project', 'shopify', 'shopify-main', 'public', 'api');
    const popularData = JSON.parse(fs.readFileSync(path.join(apiDir, 'products_popular.json'), 'utf-8'));
    const data = Array.isArray(popularData) ? popularData : popularData.data;

    // Register model if not already (though we just need to access the collection)
    // We use the same name as app.js uses: 'products_popular'
    const PopularProduct = mongoose.model('products_popular', productListSchema);

    console.log('Clearing products_popular collection...');
    await PopularProduct.deleteMany({});

    console.log(`Seeding ${data.length} popular products...`);
    await PopularProduct.insertMany(data);

    console.log('Seeding Completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding popular products:', error);
    process.exit(1);
  }
};

seedPopular();
