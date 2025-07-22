

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Log helpful info for debugging auth domain issues
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Auth Domain:', firebaseConfig.authDomain);
  console.log('🌐 Current Origin:', window.location.origin);
  
  // Warn if running on non-localhost IP without proper domain setup
  if (window.location.hostname !== 'localhost' && window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    console.warn('⚠️ Running on IP address. For Firebase Auth to work, add this domain to Firebase Console: Authentication → Settings → Authorized domains');
  }
}

// Check for missing environment variables to provide a helpful error message.
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY'
];

// Only run this check in the browser
if (typeof window !== 'undefined') {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    const errorMessage = `🔴 FATAL: Missing Firebase environment variables. Please create a .env.local file in your project's root directory and add the following keys:\n\n${missingVars.join('\n')}\n\nYou can find these values in your Firebase project settings. Without them, the app cannot connect to Firebase.`;
    console.warn(errorMessage);
  }
}


// Initialize Firebase
let app;
let auth;
let db;
let analytics;
let storage;

try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
        analytics = getAnalytics(app);
    }
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

} catch (error: any) {
    if (error.message && (error.message.includes("invalid-api-key") || error.message.includes("Invalid API key"))) {
        throw new Error(
            "🔴 Firebase Error: Invalid API Key. Please check that NEXT_PUBLIC_FIREBASE_API_KEY in your .env.local file is correct. You can find this value in your Firebase project's settings."
        );
    }
    // Re-throw any other initialization errors
    throw error;
}


export { app, auth, db, analytics, storage };
