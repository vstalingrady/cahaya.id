// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

// Check for missing environment variables to provide a helpful error message.
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(envVar => !firebaseConfig[envVar.replace('NEXT_PUBLIC_', '').replace(/_(\w)/g, (all, letter) => letter.toLowerCase()) as keyof typeof firebaseConfig]);

if (missingVars.length > 0) {
  // Only show this error in the browser console, not during server-side rendering.
  if (typeof window !== 'undefined') {
    const errorMessage = `🔴 FATAL: Missing Firebase environment variables. Please create a .env.local file in your project's root directory and add the following keys:\n\n${missingVars.join('\n')}\n\nYou can find these values in your Firebase project settings.`;
    console.error(errorMessage);
    // You could also throw an error here to halt execution, but logging is often sufficient.
    // throw new Error(errorMessage);
  }
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics & App Check only in the browser
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log('Failed to initialize Analytics', error);
  }

  try {
    // In development, the debug token is printed to the console.
    // You must add this token to the Firebase Console to bypass App Check.
    if (process.env.NODE_ENV === 'development') {
      console.log("Firebase App Check: Debug mode enabled. If you're seeing security errors, find the 'App Check debug token' logged below and add it to your Firebase project settings under App Check > Apps > Manage debug tokens.");
      (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY;
    if (recaptchaSiteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log("Firebase App Check initialized successfully.");
    } else {
       console.warn("Firebase App Check not initialized. The 'NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY' is missing from your environment variables.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase App Check. This can cause authentication and API requests to fail.", error);
  }
}


export { app, auth, db, analytics };