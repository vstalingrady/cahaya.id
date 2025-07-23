'use client';

import { signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export const signInWithGoogleCapacitor = async () => {
  try {
    console.log('🚀 Starting Google sign-in with redirect...');
    
    // Check if we're returning from a redirect first
    const redirectResult = await getRedirectResult(auth);
    if (redirectResult) {
      console.log('✅ Google sign-in successful from redirect:', redirectResult.user.email);
      return redirectResult;
    }
    
    // If no redirect result, initiate the redirect flow
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('🔄 Initiating Google redirect...');
    await signInWithRedirect(auth, provider);
    
    // This won't return immediately - the page will redirect
    // The result will be handled when the page loads again
    return null;
    
  } catch (error) {
    console.error('🚨 Google sign-in error:', error);
    throw error;
  }
};