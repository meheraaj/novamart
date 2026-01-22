const router = require("express").Router();
const Product = require("../models/Product");

// In-memory store for contacts
let contacts = [
    {
        id: "1",
        title: "Customer Support",
        description: "For any questions or concerns",
        number: "+1 (800) 123-4567"
    },
    {
        id: "2",
        title: "Sales Inquiries",
        number: "+1 (800) 987-6543"
    }
];

// Mock contact info
router.get("/contact", (req, res) => {
    res.json({
        data: contacts
    });
});

router.post("/contact", (req, res) => {
    const newContact = {
        id: Date.now().toString(),
        ...req.body
    };
    contacts.push(newContact);

    res.json({
        message: "Contact added successfully",
        data: newContact
    });
});

// Mock flash sell products - fetch from DB but mapped to expected format if needed
// Or just return a subset of real products
// Mock flash sell products
router.get("/products_flash_sell", async (req, res) => {
    try {
        // Return first 5 products as "flash sell"
        const products = await Product.find().limit(5);
        res.json(products);
    } catch (err) {
        res.json([]);
    }
});

// Mock other commonly missed endpoints from api-endpoints.js
router.get("/order-status", (req, res) => {
    res.json({ data: [] });
});

router.get("/payment", (req, res) => {
    res.json({ data: [] });
});

router.get("/related_products", async (req, res) => {
    try {
        const products = await Product.find().limit(4);
        res.json(products);
    } catch (err) {
        res.json([]);
    }
});

router.get("/products_popular", async (req, res) => {
    try {
        const products = await Product.find().limit(6);
        res.json(products);
    } catch (err) {
        res.json([]);
    }
});

module.exports = router;
