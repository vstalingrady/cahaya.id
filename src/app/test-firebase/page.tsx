'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

export default function TestFirebase() {
  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};
      
      // Test 1: Firebase config
      results.firebaseConfig = {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId,
        apiKey: auth.app.options.apiKey ? 'Present' : 'Missing'
      };
      
      // Test 2: Auth object
      results.authObject = {
        currentUser: auth.currentUser,
        app: auth.app.name,
        config: auth.config
      };
      
      // Test 3: Google Provider
      try {
        const provider = new GoogleAuthProvider();
        results.googleProvider = {
          providerId: provider.providerId,
          scopes: provider.getScopes?.() || 'No scopes method'
        };
      } catch (error) {
        results.googleProvider = { error: error.message };
      }
      
      // Test 4: Network connectivity to Firebase
      try {
        const response = await fetch(`https://${auth.app.options.authDomain}/__/auth/handler`);
        results.networkTest = {
          status: response.status,
          ok: response.ok,
          url: response.url
        };
      } catch (error) {
        results.networkTest = { error: error.message };
      }
      
      setStatus(results);
    };
    
    runTests();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Test Results</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Test Results:</h2>
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Current URL:</h2>
          <p>{typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
        </div>
      </div>
    </div>
  );
}