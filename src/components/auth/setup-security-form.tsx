
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Check, Fingerprint, Loader2, Lock, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NoiseOverlay from '../noise-overlay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeTab === 'face' && scanStep === 'scanning') {
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
          setScanStep('idle'); // Reset on error
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
  }, [activeTab, scanStep, toast]);

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
      const colors = ['bg-red-500/80', 'bg-green-500/80', 'bg-blue-400/80'];
      let flashIndex = 0;
      
      const flash = () => {
        if (flashIndex < colors.length) {
          setFlashColor(colors[flashIndex]);
          flashIndex++;
          setTimeout(flash, 250); // Each color shown for 250ms
        } else {
          setFlashColor(null); // End flash
          setScanStep('complete');
          handleSetupComplete('Face ID');
        }
      };
      
      flash();

    }, 2000);
  };


  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setPin(value);
  }

  return (
    <>
      {flashColor && (
        <div className={cn("fixed inset-0 z-50 pointer-events-none", flashColor)}></div>
      )}
      <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-8 rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-red-950/50 border-red-800/50">
            <TabsTrigger value="face" className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white">
              <Smile className="w-5 h-5 mr-2" /> Face ID
            </TabsTrigger>
            <TabsTrigger value="fingerprint" className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white">
              <Fingerprint className="w-5 h-5 mr-2" /> Fingerprint
            </TabsTrigger>
            <TabsTrigger value="pin" className="data-[state=active]:bg-red-700/50 data-[state=active]:text-white">
              <Lock className="w-5 h-5 mr-2" /> PIN
            </TabsTrigger>
          </TabsList>
          <TabsContent value="face" className="mt-6">
            <div className="flex flex-col items-center space-y-6">
               <Alert className="text-center text-red-200 bg-red-950/40 border-red-800/60">
                <AlertDescription>
                  {scanStep === 'scanning'
                    ? "Hold still, the screen will flash to illuminate your face."
                    : "Position your face in the oval, then start the scan."}
                </AlertDescription>
              </Alert>

              <div className={cn(
                "relative w-64 h-80 rounded-[50%] overflow-hidden border-4 flex items-center justify-center bg-black",
                scanStep === 'scanning' ? 'animate-border-color-cycle' : 'border-red-900/80'
              )}>
                {scanStep === 'scanning' ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                      <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                        <Camera className="w-12 h-12 text-red-400 mb-4" />
                        <Alert variant="destructive">
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>Enable camera access to use Face ID.</AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </>
                ) : (
                  <Camera className="w-32 h-32 text-red-500/50" />
                )}
              </div>
              
              {scanStep === 'idle' && (
                 <Button 
                    onClick={handleStartScan}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                 >
                    Start Scan
                 </Button>
              )}
              {scanStep === 'scanning' && (
                 <Button 
                    disabled
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                 >
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Scanning...
                 </Button>
              )}
               {scanStep === 'complete' && (
                 <Button 
                    disabled
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg"
                 >
                    <Check className="w-6 h-6 mr-3" />
                    Face ID Configured
                 </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="fingerprint" className="mt-6">
              <div className="flex flex-col items-center space-y-8 pt-8 pb-4">
                  <p className="text-center text-red-200">Place your finger on the scanner to register your fingerprint.</p>
                  <Fingerprint className="w-48 h-48 text-red-400/50" />
                  <Button 
                      onClick={() => handleSetupComplete('Fingerprint')}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                  >
                      Register Fingerprint
                  </Button>
              </div>
          </TabsContent>
          <TabsContent value="pin" className="mt-6">
              <div className="flex flex-col items-center space-y-6 pt-8">
                   <p className="text-center text-red-200">Create an 8-character PIN with numbers and letters for secure access.</p>
                   <div className="relative w-full">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-300" />
                      <Input 
                          type="password" 
                          className="bg-red-950/50 border-red-800/50 h-14 pl-12 text-center text-xl tracking-[0.5em] placeholder:text-red-300/70" 
                          placeholder="••••••••"
                          value={pin}
                          onChange={handlePinChange}
                          maxLength={8}
                      />
                   </div>
                   <Button 
                      onClick={() => handleSetupComplete('Cuan PIN')}
                      disabled={pin.length < 8}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
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
