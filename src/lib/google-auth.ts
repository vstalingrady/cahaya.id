'use client';

import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { signInWithPopup, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

// Initialize Google Auth for Capacitor
if (Capacitor.isNativePlatform()) {
  GoogleAuth.initialize({
    clientId: '859834790066-web-client-id.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
}

export const signInWithGoogleCapacitor = async () => {
  try {
    console.log('🔍 Platform check:', {
      isNative: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform()
    });

    if (Capacitor.isNativePlatform()) {
      // Use Capacitor Google Auth for mobile
      console.log('📱 Using Capacitor Google Auth for mobile...');
      
      const googleUser = await GoogleAuth.signIn();
      console.log('✅ Capacitor Google Auth successful:', googleUser);
      
      // Create Firebase credential from Google Auth result
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      
      // Sign in to Firebase with the credential
      const result = await signInWithCredential(auth, credential);
      return result;
    } else {
      // Use web popup for browser development
      console.log('🌐 Using web popup for browser...');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      return result;
    }
  } catch (error) {
    console.error('🚨 Google sign-in error:', error);
    throw error;
  }
};