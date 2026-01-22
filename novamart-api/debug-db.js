const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose
  .connect(process.env.mongouri || "mongodb://localhost:27017/shopifyAdmin")
  .then(async () => {
    console.log("MongoDB Connected");
    
    try {
const jwt = require('jsonwebtoken');

// ... inside the connection promise
        const users = await User.find({});
        const admins = users.filter(u => u.role === 'admin');
        
        if (admins.length > 0) {
            const admin = admins[0];
            const token = jwt.sign(
                { id: admin._id, isAdmin: true },
                process.env.JWT_SEC || "secret",
                { expiresIn: "1d" }
            );
            const fs = require('fs');
            fs.writeFileSync('token.txt', token);
            console.log("\nToken written to token.txt");
            console.log("\nUse this token to test: curl -H \"Authorization: Bearer <token>\" http://localhost:4000/api/users");
        } else {
            console.log("No admin found to generate token.");
        }
        
        // Check collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("\nCollections:", collections.map(c => c.name));
        
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));
