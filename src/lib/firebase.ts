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
    // In development environments (like Firebase Studio), use the debug token.
    // This will be printed to the console of your browser. You need to add it
    // to the Firebase Console (App Check > Your App > Manage debug tokens).
    if (process.env.NODE_ENV === 'development') {
      console.log('Firebase App Check: Initializing in development mode with debug token.');
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    // Initialize App Check with reCAPTCHA v3 provider.
    // The debug token will be used automatically in dev mode if set.
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY;
    if (recaptchaSiteKey) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
      console.log("Firebase App Check initialized.");
    } else {
       console.warn("Firebase App Check not initialized. NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY is missing from .env file.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase App Check", error);
  }
}


export { app, auth, db, analytics };
