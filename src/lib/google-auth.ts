'use client';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

// Initialize Google Auth for Capacitor
if (Capacitor.isNativePlatform()) {
  GoogleAuth.initialize();
}

export const signInWithGoogleCapacitor = async () => {
  try {
    // Use Capacitor Google Auth plugin for native platforms
    if (Capacitor.isNativePlatform()) {
      const googleUser = await GoogleAuth.signIn();
      
      // Create Firebase credential from Google Auth result
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      
      // Sign in to Firebase with the credential
      const result = await signInWithCredential(auth, credential);
      return result;
    } else {
      // For web platform, fall back to regular Firebase auth
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      return result;
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};