const admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

// Path to your service account key (use the correct file path)
const serviceAccount = require("C:\Users\skand\Downloads\test-1-47b6c-firebase-adminsdk-mla8a-7188aa84d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Google Cloud Storage Client
const storage = new Storage();
const bucket = storage.bucket("drdo_bucket1");  // Your Cloud Storage bucket

module.exports = { db, bucket };
