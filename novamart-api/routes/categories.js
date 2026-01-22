const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/Category');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/categories');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'cat-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper to process image (for uploads)
const processImage = (file) => {
  const baseUrl = 'http://localhost:5000/uploads/categories/';
  return {
    id: Date.now(),
    original: `${baseUrl}${file.filename}`,
    thumbnail: `${baseUrl}${file.filename}` // In real app, resize this
  };
};

// Helper to fix URL (for legacy data)
const fixUrl = (url) => {
  const baseUrl = 'http://localhost:5000/uploads/categories/';
  if (!url) return url;
  if (url.startsWith('http')) return url; // Already absolute
  if (url.startsWith('/assets/images/category/')) {
    // Remove prefix and prepend new base
    const relative = url.replace('/assets/images/category/', '');
    return `${baseUrl}${relative}`;
  }
  return url;
};

const transformCategory = (cat) => {
  if (!cat) return cat;
  return {
    ...cat,
    icon: fixUrl(cat.icon),
    image: cat.image ? {
      ...cat.image,
      original: fixUrl(cat.image.original),
      thumbnail: fixUrl(cat.image.thumbnail)
    } : null
  };
};

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categories',
          as: 'products'
        }
      },
      {
        $project: {
          _id: 1,
          id: 1,
          name: 1,
          slug: 1,
          image: 1,
          icon: 1,
          children: 1,
          productCount: { $size: '$products' }
        }
      }
    ]);

    const categoriesWithUrls = categories.map(cat => transformCategory(cat));
    res.json({ data: categoriesWithUrls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).lean();
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    res.json(transformCategory(category));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories
router.post('/', verifyTokenAndAdmin, upload.single('image'), async (req, res) => {
  try {
    const categoryData = {
      ...req.body,
      id: req.body.id || Math.floor(Math.random() * 1000000),
      slug: req.body.slug || req.body.name.toLowerCase().replace(/ /g, '-')
    };

    // Remove image from body data to avoid overwriting with empty object
    delete categoryData.image;

    if (req.file) {
      const processed = processImage(req.file);
      categoryData.image = processed;
      categoryData.icon = processed.thumbnail; // Use thumbnail as icon
    }

    const newCategory = new Category(categoryData);
    const savedCategory = await newCategory.save();

    // Handle Parent Category (Sub-category)
    if (req.body.parent) {
      const parentCategory = await Category.findById(req.body.parent);
      if (parentCategory) {
        // Add minimal info to children array
        parentCategory.children.push({
          _id: savedCategory._id,
          name: savedCategory.name,
          slug: savedCategory.slug
        });
        await parentCategory.save();
      }
    }

    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/categories/:id
router.put('/:id', verifyTokenAndAdmin, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Remove image from updates if it's not a file (it might be an empty object from req.body)
    delete updates.image;

    if (req.file) {
      const processed = processImage(req.file);
      updates.image = processed;
      updates.icon = processed.thumbnail; // Use thumbnail as icon
    }

    let updatedCategory;
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (isObjectId) {
      updatedCategory = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    }

    if (!updatedCategory) {
      // Try finding by custom id if not found by _id or if not a valid ObjectId
      updatedCategory = await Category.findOneAndUpdate(
        { id: req.params.id }, 
        updates,
        { new: true }
      );
    }
    
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        let deleted;
        const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);

        if (isObjectId) {
            deleted = await Category.findByIdAndDelete(req.params.id);
        }

        if (!deleted) {
             deleted = await Category.findOneAndDelete({ id: req.params.id });
        }
        
        if (!deleted) return res.status(404).json({ message: 'Category not found' });

        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
