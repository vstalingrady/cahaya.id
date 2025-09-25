'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfflineDetectorProps {
  children: React.ReactNode;
}

export default function OfflineDetector({ children }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check initial connection status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Additional check by trying to reach the server
    const checkServerConnection = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache',
          signal: AbortSignal.timeout(5000)
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    // Check server connection every 30 seconds
    const interval = setInterval(checkServerConnection, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    
    // Check browser online status
    if (!navigator.onLine) {
      setIsOnline(false);
      setIsChecking(false);
      return;
    }

    // Try to reach the server
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      setIsOnline(response.ok);
    } catch {
      setIsOnline(false);
    }
    
    setIsChecking(false);
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Logo/Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
              <WifiOff className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground font-serif">
              Connection Required
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              caharaya needs an internet connection to access your financial data and AI features.
            </p>
          </div>

          {/* Status */}
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <WifiOff className="w-5 h-5" />
              <span>No internet connection detected</span>
            </div>
          </div>

          {/* Retry Button */}
          <Button 
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-primary/30 transition-all duration-300 transform hover:scale-105 h-auto"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5 mr-2" />
                Try Again
              </>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Make sure you're connected to WiFi or mobile data</p>
            <p className="text-xs opacity-75">
              Your financial data is secure and will sync when connection is restored
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}