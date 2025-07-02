'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Check, Fingerprint, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('face');
  const [pin, setPin] = useState('');
  
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [flashColor, setFlashColor] = useState<string | null>(null);

  // Mapping from Tailwind class to RGBA for the radial gradient
  const flashColorMap: { [key: string]: string } = {
    'bg-primary/80': 'rgba(122, 72, 240, 0.8)', // --primary
    'bg-green-500/80': 'rgba(34, 197, 94, 0.8)',
    'bg-sky-400/80': 'rgba(56, 189, 248, 0.8)',
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    // Activate camera as soon as the tab is active
    if (activeTab === 'face') {
      const getCamera = async () => {
        try {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Camera API not available in this browser.');
          }
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          if (scanStep !== 'idle') setScanStep('idle');
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions to use Face ID.',
          });
        }
      };
      getCamera();
    }
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const currentStream = videoRef.current.srcObject as MediaStream;
            currentStream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };
  }, [activeTab, toast, scanStep]);

  const handleSetupComplete = (method: string) => {
    toast({
      title: 'Security Set Up!',
      description: `${method} has been configured.`,
    });
    router.push('/link-account');
  };

  const handleStartScan = async () => {
    setScanStep('scanning');

    // Simulate aligning face for 2 seconds
    setTimeout(() => {
      // Start flash sequence
      const colors = ['bg-primary/80', 'bg-green-500/80', 'bg-sky-400/80'];
      let flashIndex = 0;
      
      const flash = () => {
        if (flashIndex < colors.length) {
          setFlashColor(colors[flashIndex]);
          flashIndex++;
          setTimeout(flash, 250); // Each color shown for 250ms
        } else {
          setFlashColor(null); // End flash
          setScanStep('complete');
          // Delay completion to show the final state
          setTimeout(() => handleSetupComplete('Face ID'), 500);
        }
      };
      
      flash();

    }, 2000);
  };


  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setPin(value);
  }

  const isCameraActive = hasCameraPermission === true;

  return (
    <>
      {flashColor && (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 30% 45% at 50% 50%, transparent, transparent 50%, ${flashColorMap[flashColor as keyof typeof flashColorMap]})`
          }}
        ></div>
      )}
      <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg shadow-primary/10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary border-border">
            <TabsTrigger value="face" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Camera className="w-5 h-5 mr-2" /> Face ID
            </TabsTrigger>
            <TabsTrigger value="fingerprint" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Fingerprint className="w-5 h-5 mr-2" /> Fingerprint
            </TabsTrigger>
            <TabsTrigger value="pin" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Lock className="w-5 h-5 mr-2" /> PIN
            </TabsTrigger>
          </TabsList>
          <TabsContent value="face" className="mt-6">
            <div className="flex flex-col items-center space-y-6">
               <Alert className="text-center text-muted-foreground bg-secondary border-border">
                <AlertDescription>
                  {scanStep === 'scanning'
                    ? "Hold still, the screen will flash to illuminate your face."
                    : "Position your face in the oval, then start the scan."}
                </AlertDescription>
              </Alert>

              <div className={cn(
                "relative w-64 h-80 rounded-[50%] overflow-hidden border-4 flex items-center justify-center transition-colors",
                scanStep === 'scanning' ? 'animate-border-color-cycle' : 'border-border',
                scanStep === 'complete' ? 'border-green-500' : ''
              )}>
                <video ref={videoRef} className={cn("w-full h-full object-cover scale-x-[-1] transition-opacity duration-300", isCameraActive ? 'opacity-100' : 'opacity-0')} autoPlay muted playsInline />
                
                <div className="absolute inset-0 rounded-[50%] border-4 border-dashed border-white/30 pointer-events-none"></div>

                {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/50">
                        {hasCameraPermission === null && <Loader2 className="w-12 h-12 text-primary animate-spin" />}
                        {hasCameraPermission === false && <Camera className="w-12 h-12 text-muted-foreground" />}
                        <p className="text-sm text-muted-foreground mt-2">
                          {hasCameraPermission === null ? "Requesting camera..." : "Camera unavailable"}
                        </p>
                    </div>
                )}
              </div>
              
              {scanStep === 'idle' && (
                 <Button 
                    onClick={handleStartScan}
                    disabled={!hasCameraPermission}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                 >
                    Start Scan
                 </Button>
              )}
              {scanStep === 'scanning' && (
                 <Button 
                    disabled
                    className="w-full bg-primary/80 text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg"
                 >
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Scanning...
                 </Button>
              )}
               {scanStep === 'complete' && (
                 <Button 
                    disabled
                    className="w-full bg-green-500 hover:bg-green-500/90 text-white py-4 rounded-xl font-semibold text-lg shadow-lg"
                 >
                    <Check className="w-6 h-6 mr-3" />
                    Face ID Configured
                 </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="fingerprint" className="mt-6">
              <div className="flex flex-col items-center space-y-8 pt-8 pb-4">
                  <p className="text-center text-muted-foreground">Place your finger on the scanner to register your fingerprint.</p>
                  <Fingerprint className="w-48 h-48 text-primary/30" />
                  <Button 
                      onClick={() => handleSetupComplete('Fingerprint')}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                  >
                      Register Fingerprint
                  </Button>
              </div>
          </TabsContent>
          <TabsContent value="pin" className="mt-6">
              <div className="flex flex-col items-center space-y-6 pt-8">
                   <p className="text-center text-muted-foreground">Create an 8-character PIN with numbers and letters for secure access.</p>
                   <div className="relative w-full">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                          type="password" 
                          className="bg-input border-border h-14 pl-12 text-center text-xl tracking-[0.5em] placeholder:text-muted-foreground" 
                          placeholder="••••••••"
                          value={pin}
                          onChange={handlePinChange}
                          maxLength={8}
                      />
                   </div>
                   <Button 
                      onClick={() => handleSetupComplete('Cuan PIN')}
                      disabled={pin.length < 8}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                  >
                      Set PIN
                  </Button>
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
