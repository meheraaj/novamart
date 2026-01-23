const admin = require("firebase-admin");

let serviceAccount;
try {
  // Try to load from environment variable or a local file
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
  if (require('fs').existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
} catch (error) {
  console.error("Error loading Firebase service account:", error.message);
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin initialized successfully.");
} else {
  console.warn("Firebase Admin NOT initialized. Social login will not work until credentials are provided.");
}

module.exports = admin;
