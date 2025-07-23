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
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    const isWeb = platform === 'web';
    
    console.log('🔍 Platform check:', {
      platform,
      isNative,
      isWeb,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'
    });

    // Use web popup for browser development (including localhost)
    if (isWeb || typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('🌐 Using web popup for browser development...');
      
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      return result;
    } 
    
    // Use Capacitor Google Auth for actual mobile app
    if (isNative && (platform === 'android' || platform === 'ios')) {
      console.log('📱 Using Capacitor Google Auth for mobile...');
      
      const googleUser = await GoogleAuth.signIn();
      console.log('✅ Capacitor Google Auth successful:', googleUser);
      
      // Create Firebase credential from Google Auth result
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
      
      // Sign in to Firebase with the credential
      const result = await signInWithCredential(auth, credential);
      return result;
    }
    
    // Fallback to web popup if platform detection fails
    console.log('🔄 Fallback to web popup...');
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    return result;
    
  } catch (error) {
    console.error('🚨 Google sign-in error:', error);
    throw error;
  }
};