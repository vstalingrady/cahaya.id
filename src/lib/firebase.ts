

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
  ...(process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL && { databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL }),
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }),
};

// Validate that we have the required config values
const isFirebaseConfigValid = firebaseConfig.apiKey && 
                              firebaseConfig.authDomain && 
                              firebaseConfig.projectId && 
                              firebaseConfig.storageBucket && 
                              firebaseConfig.messagingSenderId && 
                              firebaseConfig.appId;

// Log helpful info for debugging auth domain issues
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Config Debug:');
  console.log('  - Auth Domain:', firebaseConfig.authDomain);
  console.log('  - Project ID:', firebaseConfig.projectId);
  console.log('  - API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING');
  console.log('🌐 Current Origin:', window.location.origin);
  
  // Check if all required config values are present
  const missingConfig = Object.entries(firebaseConfig).filter(([key, value]) => !value);
  if (missingConfig.length > 0) {
    // Only show this as a warning instead of error for development
    console.warn('⚠️ Missing Firebase config values (optional for static pages):', missingConfig.map(([key]) => key));
  }
  
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
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

// Only run this check in the browser
if (typeof window !== 'undefined') {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    // Show as warning instead of error for development
    const warningMessage = `⚠️ Missing Firebase environment variables. Please create a .env.local file in your project's root directory and add the following keys:\n\n${missingVars.join('\n')}\n\nYou can find these values in your Firebase project settings. Without them, the app cannot connect to Firebase.`;
    console.warn(warningMessage);
  }
} else {
  // Server-side check - just log for debugging
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    console.log('⚠️ Missing Firebase environment variables (server-side, non-critical for static pages):', missingVars);
  }
}


// Initialize Firebase
let app;
let auth;
let db;
let analytics;
let storage;

// Add more detailed error logging
if (typeof window !== 'undefined') {
  console.log('🔥 Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...` : 'MISSING',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  });
}

// Only initialize Firebase if we have a valid config
if (isFirebaseConfigValid) {
  try {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      
      if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
          analytics = getAnalytics(app);
      }
      
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);

      if (typeof window !== 'undefined') {
        console.log('✅ Firebase initialized successfully');
      }

  } catch (error: any) {
      if (typeof window !== 'undefined') {
        console.error('❌ Firebase initialization error:', error);
      }
      
      if (error.message && (error.message.includes("invalid-api-key") || error.message.includes("Invalid API key"))) {
          throw new Error(
              "🔴 Firebase Error: Invalid API Key. Please check that NEXT_PUBLIC_FIREBASE_API_KEY in your .env.local file is correct. You can find this value in your Firebase project's settings."
          );
      }
      // Re-throw any other initialization errors
      throw error;
  }
} else {
  console.warn('⚠️ Firebase config is incomplete. Skipping initialization. This is expected in development without Firebase setup.');
  // Initialize with empty objects to prevent runtime errors
  app = null;
  auth = null;
  db = null;
  analytics = null;
  storage = null;
}


// Export the initialized services, or null if Firebase wasn't initialized
export { app, auth, db, analytics, storage };
