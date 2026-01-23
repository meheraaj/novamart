const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const productListSchema = require("./models/ProductListSchema");

dotenv.config();

const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}`);
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Global: ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose
  .connect(process.env.mongouri || "mongodb://localhost:27017/shopifyAdmin")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use((req, res, next) => {
  if (req.path.endsWith(".json")) {
    req.url = req.url.replace(/\.json$/, "");
  }
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Dynamic Model Registration
const registerDynamicModels = () => {
  // Use the same path as seed.js to ensure consistency
  const apiDir = path.join(__dirname, '..', 'novamart-storefront', 'public', 'api');

  if (!fs.existsSync(apiDir)) {
    console.warn(`API directory not found at ${apiDir}. Dynamic models might not be registered.`);
    return;
  }

  const files = fs.readdirSync(apiDir);
  files.forEach((file) => {
    if (!file.endsWith(".json")) return;
    const name = path.parse(file).name;

    // Skip if model already exists (defined in explicit model files)
    if (mongoose.models[name]) return;
    if (mongoose.models[name.charAt(0).toUpperCase() + name.slice(1)]) return; // Check capitalized too
    if (name === 'categories') return; // Explicitly skip categories to use routes/categories.js

    // Register generic model
    // We use strict: false to allow any fields
    mongoose.model(name, productListSchema);
    console.log(`Registered dynamic model: ${name}`);
  });
};

// registerDynamicModels();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/shops", require("./routes/shops"));
app.use("/api/brands", require("./routes/brands"));
app.use("/api/attributes", require("./routes/attributes"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/widgets", require("./routes/widgets"));


app.use("/api", require("./routes/mocks")); // Handle legacy .json requests
app.use("/api", require("./routes/users")); // Mounts /api/address, /api/wishlist, /api/login, etc.

// Dynamic Route Handler for everything else
// app.get("/api/:resource", async (req, res) => {
//   const resource = req.params.resource;
//   console.log(`Dynamic handler hit for: ${resource}`);

//   try {
//     // Try to find a model matching the resource name
//     // We check exact match, or capitalized, or singular/plural variations if needed
//     // But our seed script used exact filename as collection name (e.g. 'products_flash_sell')

//     let model = mongoose.models[resource];
//     if (!model) {
//        // Try to find case-insensitive match
//        const modelName = Object.keys(mongoose.models).find(m => m.toLowerCase() === resource.toLowerCase());
//        if (modelName) model = mongoose.models[modelName];
//     }

//     if (!model) {
//       return res.status(404).json({ message: `Resource ${resource} not found` });
//     }

//     const data = await model.find({});

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

app.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "NovaMart API is running",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log('Address:', server.address());
});
server.on('error', (e) => console.error("Server Error:", e));
