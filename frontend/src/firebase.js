// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8uXsjn8rlMH8hCAaBYx-ORN1BroQxI4E",
  authDomain: "test-1-47b6c.firebaseapp.com",
  projectId: "test-1-47b6c",
  storageBucket: "test-1-47b6c.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "653130504249",
  appId: "1:653130504249:web:273cf321ca3522687095e8",
  measurementId: "G-JYXTCD5RQP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Storage instances
export const db = getFirestore(app);
export const storage = getStorage(app);
