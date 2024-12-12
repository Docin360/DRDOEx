const admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');

// Path to your service account key
const serviceAccount = require("C:\\Users\\skand\\Downloads\\test-1-47b6c-firebase-adminsdk-mla8a-7188aa84d7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "drdo_bucket1.appspot.com", // Your Cloud Storage bucket
});

const db = admin.firestore();
const storage = admin.storage().bucket();

module.exports = { db, storage };
