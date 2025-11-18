import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// REPLACE THIS WITH YOUR ACTUAL FIREBASE CONFIG FROM THE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Check if we are in the preview environment (ignore this for local dev)
const config = typeof window !== 'undefined' && window.__firebase_config 
  ? JSON.parse(window.__firebase_config) 
  : firebaseConfig;

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const appId = typeof window !== 'undefined' && window.__app_id 
  ? window.__app_id 
  : 'radiology-app'; // Default collection name for local