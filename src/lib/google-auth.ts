'use client';

import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export const signInWithGoogleCapacitor = async () => {
  try {
    console.log('🚀 Starting Google sign-in with popup...');
    
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // For mobile/Capacitor, we need to handle the popup differently
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Google sign-in successful:', result.user.email);
    return result;
    
  } catch (error) {
    console.error('🚨 Google sign-in error:', error);
    throw error;
  }
};