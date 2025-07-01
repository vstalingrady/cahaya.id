'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import NoiseOverlay from '@/components/noise-overlay';
import { cn } from '@/lib/utils';

export default function QrisPage() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not available.');
        setHasCameraPermission(false);
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      toast({
        title: "QRIS Payment Successful",
        description: "IDR 55,000 has been paid to Starbucks.",
      });
      router.push('/dashboard');
    }, 2000);
  };
  
  const isCameraReady = hasCameraPermission === true;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <header className="flex items-center relative">
        <Link href="/transfer" className="absolute left-0">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-2xl font-black mx-auto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-serif">
          Pay with QRIS
        </h1>
      </header>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full max-w-xs aspect-square bg-black/50 rounded-2xl overflow-hidden border-4 border-red-900/80 shadow-2xl">
          <NoiseOverlay opacity={0.02} />
          
          <video
            ref={videoRef}
            className={cn(
                "w-full h-full object-cover scale-x-[-1] transition-opacity duration-500",
                isCameraReady ? 'opacity-100' : 'opacity-0'
            )}
            autoPlay
            muted
            playsInline
          />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            {hasCameraPermission === null && <Loader2 className="w-12 h-12 text-red-400 animate-spin" />}
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="bg-destructive/80 border-red-500 text-white text-center">
                  <AlertTitle>Camera Access Required</AlertTitle>
                  <AlertDescription>
                    Please enable camera permissions in browser settings.
                  </AlertDescription>
                </Alert>
            )}
          </div>
          
          {/* Scanner UI overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
            <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
            <div className="absolute top-1/2 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-pulse"></div>
          </div>
        </div>

        <p className="text-muted-foreground text-center max-w-xs">
            {isCameraReady ? 'Align the QR code within the frame to scan.' : 'Requesting camera access...'}
        </p>
        
        <Button
          onClick={handleScan}
          disabled={!isCameraReady || isScanning}
          className="w-full max-w-xs bg-gradient-to-r from-primary to-accent text-white py-5 rounded-2xl font-black text-xl shadow-2xl border border-red-400/30 hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group h-auto"
        >
          <NoiseOverlay opacity={0.05} />
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <span className="relative z-10">Simulate Scan & Pay</span>
          )}
        </Button>
      </div>
    </div>
  );
}
