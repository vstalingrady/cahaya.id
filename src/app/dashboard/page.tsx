import Link from 'next/link';
import { QrCode, ArrowLeftRight, Plus, Clock } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

export default function DashboardPage() {
    return (
        <div className="bg-gradient-to-br from-black via-red-950 to-black text-white p-6 min-h-screen relative overflow-hidden">
        <NoiseOverlay />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-red-400/5 to-red-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Good morning, Budi</h1>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl border border-red-500/20" data-ai-hint="person avatar"></div>
        </div>

        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-8 rounded-3xl mb-8 shadow-2xl border border-red-400/30 relative overflow-hidden">
          <NoiseOverlay opacity={0.1} />
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-sm text-red-100 mb-2 font-bold uppercase tracking-wide">Total Net Worth</h2>
            <div className="text-4xl font-black mb-3 text-white">Rp 87.125.000</div>
            <div className="flex items-center text-red-100">
              <span className="text-lg mr-2">↗</span>
              <span className="font-bold">+ Rp 1.200.000 today</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8 relative z-10">
          <Link 
            href="/dashboard/pay"
            className="flex flex-col items-center p-5 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
          >
            <NoiseOverlay opacity={0.03} />
            <QrCode className="w-7 h-7 mb-3 text-red-400 group-hover:text-red-300 transition-colors relative z-10" />
            <span className="text-sm font-bold text-white relative z-10">Pay</span>
          </Link>
          <button className="flex flex-col items-center p-5 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
            <NoiseOverlay opacity={0.03} />
            <ArrowLeftRight className="w-7 h-7 mb-3 text-red-400 relative z-10" />
            <span className="text-sm font-bold text-white relative z-10">Transfer</span>
          </button>
          <button className="flex flex-col items-center p-5 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
            <NoiseOverlay opacity={0.03} />
            <Plus className="w-7 h-7 mb-3 text-red-400 relative z-10" />
            <span className="text-sm font-bold text-white relative z-10">Top Up</span>
          </button>
          <button className="flex flex-col items-center p-5 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-2xl border border-red-600/20 shadow-2xl relative overflow-hidden opacity-50 cursor-not-allowed">
            <NoiseOverlay opacity={0.03} />
            <Clock className="w-7 h-7 mb-3 text-red-400 relative z-10" />
            <span className="text-sm font-bold text-white relative z-10">History</span>
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>
              <div>
                <div className="font-black text-lg text-white">BCA - TabunganKu</div>
                <div className="text-red-300 text-sm">...2847</div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-lg text-white">Rp 15.250.000</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-red-900 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">GP</div>
              <div>
                <div className="font-black text-lg text-white">GoPay</div>
                <div className="text-red-300 text-sm">0812...</div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-lg text-white">Rp 875.000</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-red-800 to-red-950 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BB</div>
              <div>
                <div className="font-black text-lg text-white">Bibit - Reksadana</div>
                <div className="text-red-300 text-sm">Portfolio</div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-lg text-white">Rp 45.600.000</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="flex items-center relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">PT</div>
              <div>
                <div className="font-black text-lg text-white">Pintu - Crypto</div>
                <div className="text-red-300 text-sm">Portfolio</div>
              </div>
            </div>
            <div className="text-right relative z-10">
              <div className="font-black text-lg text-white">Rp 25.400.000</div>
            </div>
          </div>

          <Link href="/signup" className="w-full bg-gradient-to-r from-red-900/30 to-red-800/30 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-center text-red-400 border-2 border-dashed border-red-600/40 hover:border-red-500/60 transition-all duration-300 relative overflow-hidden group">
            <NoiseOverlay opacity={0.02} />
            <Plus className="w-6 h-6 mr-3 group-hover:text-red-300 transition-colors relative z-10" />
            <span className="font-bold group-hover:text-red-300 transition-colors relative z-10">Link New Account</span>
          </Link>
        </div>
      </div>
    );
}
