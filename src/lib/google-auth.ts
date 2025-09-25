'use client';

import { signInWithPopup, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export const signInWithGoogleCapacitor = async () => {
  try {
    console.log('🚀 Starting Google sign-in with redirect...');
    
    // First check if we're returning from a redirect
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult) {
      console.log('✅ Google sign-in successful from redirect:', redirectResult.user.email);
      return redirectResult;
    }
    
    // If no redirect result, initiate the redirect
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('🔄 Initiating Google popup...');
    const userCredential = await signInWithPopup(auth, provider);
    
    // signInWithPopup returns UserCredential directly
    return userCredential;
    
  } catch (error) {
    console.error('🚨 Google sign-in error:', error);
    throw error;
  }
};