'use client';

import { useEffect, useState } from 'react';

export default function DebugFirebase() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Check what environment variables are actually loaded
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    setConfig(firebaseConfig);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Configuration Debug</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Current Environment Variables:</h2>
        <pre className="text-sm overflow-x-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      <div className="bg-yellow-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Current Domain:</h2>
        <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}</p>
        <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}</p>
      </div>

      <div className="bg-red-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Missing Values:</h2>
        {config && (
          <ul className="list-disc list-inside">
            {Object.entries(config).map(([key, value]) => (
              !value && <li key={key} className="text-red-600">{key}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Next Steps:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://console.firebase.google.com/" className="text-blue-600 underline" target="_blank">Firebase Console</a></li>
          <li>Select your project (or create new one)</li>
          <li>Go to Project Settings → Your apps</li>
          <li>Copy the firebaseConfig object</li>
          <li>Update your .env file with the correct values</li>
          <li>Add your current domain ({typeof window !== 'undefined' ? window.location.origin : 'your-domain'}) to Authentication → Settings → Authorized domains</li>
        </ol>
      </div>
    </div>
  );
}