import Link from 'next/link';
import NoiseOverlay from '@/components/noise-overlay';
import { ChevronRight } from 'lucide-react';

export default function LinkAccountPage() {
  return (
    <div className="bg-gradient-to-br from-black via-red-950 to-black text-white p-6 min-h-screen relative overflow-hidden">
      <NoiseOverlay />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Let's get you connected.</h1>
        <p className="text-red-200 leading-relaxed">Select an account to link. We use official and secure bank APIs to connect. We never store your login credentials.</p>
      </div>

      <div className="space-y-8 relative z-10">
        <div>
          <h3 className="text-sm font-black text-red-400 mb-4 uppercase tracking-widest">Banks</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/link-account/bca"
              className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 transform hover:scale-105 border border-red-600/20 shadow-2xl group relative overflow-hidden"
            >
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">BCA</div>
                  <div className="text-red-300 text-sm">Bank Central Asia</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors relative z-10" />
            </Link>
            <button className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-900 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BNI</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">BNI</div>
                  <div className="text-red-300 text-sm">Bank Negara Indonesia</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 relative z-10" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-red-400 mb-4 uppercase tracking-widest">E-Wallets</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">GP</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">GoPay</div>
                  <div className="text-red-300 text-sm">Gojek Digital Wallet</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 relative z-10" />
            </button>
            <button className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-900 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">OVO</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">OVO</div>
                  <div className="text-red-300 text-sm">Digital Payment</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 relative z-10" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-red-400 mb-4 uppercase tracking-widest">Investments</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BB</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">Bibit</div>
                  <div className="text-red-300 text-sm">Mutual Funds</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 relative z-10" />
            </button>
            <button className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
              <NoiseOverlay opacity={0.03} />
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-red-700 to-red-900 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">PT</div>
                <div className="text-left">
                  <div className="font-black text-lg text-white">Pintu</div>
                  <div className="text-red-300 text-sm">Cryptocurrency</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400 relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
