import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

export default function QrScanPage() {
    return (
        <div className="bg-gradient-to-br from-black via-red-950 to-black text-white min-h-screen relative overflow-hidden">
            <NoiseOverlay />
            
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="absolute top-6 left-6 z-10">
                <Link 
                    href="/dashboard"
                    className="w-14 h-14 bg-gradient-to-br from-red-900/80 to-red-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-red-600/30 shadow-2xl hover:from-red-800/90 hover:to-red-700/90 transition-all duration-300"
                >
                    <ArrowLeft className="w-6 h-6 text-red-300" />
                </Link>
            </div>
            
            <div className="flex items-center justify-center min-h-screen relative z-10 p-6">
                <div className="relative w-full aspect-square max-w-sm">
                    <div className="w-full h-full bg-gradient-to-br from-red-900/30 to-red-800/30 backdrop-blur-xl rounded-3xl border border-red-600/20 shadow-2xl flex items-center justify-center">
                        <Camera className="w-32 h-32 text-red-400" />
                    </div>
                    <div className="absolute inset-0 border-4 border-red-500 rounded-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-1 bg-white/80 animate-ping"></div>
                </div>
            </div>
      </div>
    );
}
