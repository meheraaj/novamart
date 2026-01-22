const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

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
    res.json({ data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
      id: req.body.id || Math.floor(Math.random() * 1000000), // Simple ID generation if not provided
      slug: req.body.slug || req.body.name.toLowerCase().replace(/ /g, '-')
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
