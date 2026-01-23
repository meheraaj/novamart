const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/products');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // We will rename files in the controller after we have the product ID
    // For now, give it a temporary name
    cb(null, 'temp-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadMiddleware = multer({ storage: storage });

const upload = uploadMiddleware.fields([
  { name: 'image_main', maxCount: 1 },
  { name: 'image_gallery_1', maxCount: 1 },
  { name: 'image_gallery_2', maxCount: 1 }
]);

// Helper to process images
const processImages = (files, productId) => {
  const processed = {
    image: {},
    gallery: []
  };

  const baseUrl = 'http://localhost:5000/uploads/products/'; // Should be env var in production
  const uploadDir = path.join(__dirname, '../public/uploads/products');

  // 1. Main Image -> p-{id}.png (Original) & p-{id}-m.png (Thumbnail)
  if (files['image_main']) {
    const file = files['image_main'][0];
    const ext = path.extname(file.originalname);

    const originalName = `p-${productId}${ext}`;
    const thumbnailName = `p-${productId}-m${ext}`;

    // Rename/Move for Original
    const originalPath = path.join(uploadDir, originalName);
    fs.renameSync(file.path, originalPath);

    // For thumbnail, we should ideally resize. Since we don't have sharp/jimp installed, 
    // we will just copy the original file for now as requested by "process the images".
    // In a real app, we would resize this.
    const thumbnailPath = path.join(uploadDir, thumbnailName);
    fs.copyFileSync(originalPath, thumbnailPath);

    processed.image = {
      id: Date.now(),
      original: `${baseUrl}${originalName}`,
      thumbnail: `${baseUrl}${thumbnailName}`
    };
  }

  // 2. Gallery Images
  const galleryImages = [];

  // Gallery 1 -> p-{id}-1.png
  if (files['image_gallery_1']) {
    const file = files['image_gallery_1'][0];
    const ext = path.extname(file.originalname);
    const name = `p-${productId}-1${ext}`;
    const destPath = path.join(uploadDir, name);
    fs.renameSync(file.path, destPath);

    galleryImages.push({
      id: Date.now() + 1,
      original: `${baseUrl}${name}`,
      thumbnail: `${baseUrl}${name}` // Using same for thumbnail for gallery items for now
    });
  }

  // Gallery 2 -> p-{id}-2.png
  if (files['image_gallery_2']) {
    const file = files['image_gallery_2'][0];
    const ext = path.extname(file.originalname);
    const name = `p-${productId}-2${ext}`;
    const destPath = path.join(uploadDir, name);
    fs.renameSync(file.path, destPath);

    galleryImages.push({
      id: Date.now() + 2,
      original: `${baseUrl}${name}`,
      thumbnail: `${baseUrl}${name}`
    });
  }

  processed.gallery = galleryImages;
  return processed;
};

// GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const Category = require('../models/Category');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    console.log('GET /products request:', req.query);
    const { category, limit = 15, page = 1, q } = req.query;
    let query = {};

    if (q) {
      console.log('Searching for:', q);
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } }
      ];
    }

    if (category) {
      console.log('Filtering by category slug:', category);
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        console.log('Found category:', categoryDoc.name, categoryDoc._id);
        query.categories = categoryDoc._id;
      } else {
        console.log('Category not found:', category);
        // Return empty structure
        return res.json({
          data: [],
          paginatorInfo: {
            nextPageUrl: null,
            total: 0,
            count: 0,
            currentPage: parseInt(page),
            lastPage: 0
          }
        });
      }
    }

    const limitVal = parseInt(limit);
    const pageVal = parseInt(page);
    const skip = (pageVal - 1) * limitVal;

    let productsQuery = Product.find(query);
    const total = await Product.countDocuments(query);

    productsQuery = productsQuery.skip(skip).limit(limitVal);

    const products = await productsQuery.exec();
    console.log(`Found ${products.length} products (Page ${pageVal})`);

    // Construct nextPageUrl
    // We need to preserve other query params (like category)
    let nextPageUrl = null;
    if (pageVal * limitVal < total) {
      // Simple construction, frontend might need to handle base URL or just params
      // The frontend fetcher usually appends this to the base URL or uses it directly.
      // Let's return just the query string part for simplicity if the frontend handles it,
      // or a full relative URL.
      // Based on get-all-products.jsx: getNextPageParam: ({ paginatorInfo }) => paginatorInfo.nextPageUrl
      // And fetchProducts uses: http.get(`${API_ENDPOINTS.PRODUCTS}${queryString}`)
      // So we should return the query string for the next page.
      const nextParams = new URLSearchParams(req.query);
      nextParams.set('page', pageVal + 1);
      nextPageUrl = `?${nextParams.toString()}`;
    }

    res.json({
      data: products,
      paginatorInfo: {
        nextPageUrl: nextPageUrl,
        total,
        count: products.length,
        currentPage: pageVal,
        lastPage: Math.ceil(total / limitVal)
      }
    });
  } catch (err) {
    console.error('Error in GET /products:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products (Admin)
router.post('/', verifyTokenAndAdmin, upload, async (req, res) => {
  try {
    // req.body contains text fields
    // req.files contains uploaded files

    const productData = { ...req.body };

    // Ensure ID is present (or generate one if not provided, but schema might require unique string)
    // If user provided ID in form, use it.
    const productId = productData.id;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required for image naming." });
    }

    // Process Images
    if (req.files) {
      const processed = processImages(req.files, productId);
      if (processed.image.original) {
        productData.image = processed.image;
      }
      if (processed.gallery.length > 0) {
        productData.gallery = processed.gallery;
      }
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    // Cleanup uploaded files if error? (Optional improvement)
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', verifyTokenAndAdmin, upload, async (req, res) => {
  try {
    const productData = { ...req.body };
    const productId = req.params.id; // Use URL param ID

    // Process Images
    if (req.files) {
      const processed = processImages(req.files, productId);

      // Only update fields if new images were uploaded
      if (processed.image.original) {
        productData.image = processed.image;
      }

      // For gallery, we might want to append or replace. 
      // For now, let's replace if new gallery images are uploaded, or append?
      // The requirement implies a strict format "p-{id}-1", "p-{id}-2". 
      // So replacing seems appropriate to maintain that structure.
      if (processed.gallery.length > 0) {
        productData.gallery = processed.gallery;
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id },
      productData,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.params.id });
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    // Optional: Delete associated images from disk

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
