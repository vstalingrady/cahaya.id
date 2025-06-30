'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Fingerprint, Lock, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NoiseOverlay from '../noise-overlay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SetupSecurityForm() {
  const router = useRouter();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('face');
  const [pin, setPin] = useState('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeTab !== 'face') {
        if (videoRef.current && videoRef.current.srcObject) {
            const currentStream = videoRef.current.srcObject as MediaStream;
            currentStream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        return;
    }

    const getCameraPermission = async () => {
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
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use Face ID.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [activeTab, toast]);

  const handleSetupComplete = (method: string) => {
    toast({
      title: 'Security Set Up!',
      description: `${method} has been configured.`,
    });
    router.push('/link-account');
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setPin(value);
  }

  return (
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
            <p className="text-center text-red-200">Center your face in the frame. The color cycle helps us capture your features accurately.</p>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 flex items-center justify-center bg-black animate-border-color-cycle">
              <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
                    <Camera className="w-12 h-12 text-red-400 mb-4" />
                    <Alert variant="destructive">
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                      </AlertDescription>
                    </Alert>
                </div>
              )}
            </div>
            <Button 
                onClick={() => handleSetupComplete('Face ID')}
                disabled={!hasCameraPermission}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
            >
                Enable Face ID
            </Button>
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
  );
}
