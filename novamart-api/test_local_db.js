const mongoose = require('mongoose');

const localUri = 'mongodb://localhost:27017/shopifyAdmin';
console.log('Testing connection to:', localUri);

mongoose.connect(localUri)
  .then(() => {
    console.log('Connected to local MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to local MongoDB:', err.message);
    process.exit(1);
  });
