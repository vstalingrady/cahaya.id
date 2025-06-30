import Link from 'next/link';
import NoiseOverlay from '@/components/noise-overlay';

export default function WelcomePage() {
  return (
    <div className="bg-gradient-to-br from-black via-red-950 to-black text-white p-6 flex flex-col justify-between min-h-screen relative overflow-hidden">
      <NoiseOverlay />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10">
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 opacity-30 mb-8 transform rotate-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-500/20">BCA</div>
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-400/20">GoPay</div>
            <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-600/20">OVO</div>
            <div className="bg-gradient-to-br from-red-800 to-red-950 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-700/20">Bibit</div>
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-500/20">DANA</div>
            <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-4 text-xs font-black shadow-2xl border border-red-400/20">Pintu</div>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent leading-tight">
            All your money,<br />in one place.
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6 rounded-full"></div>
        </div>
        
        <p className="text-red-100 text-xl mb-12 font-light">Welcome to Cuan. The secure way to manage your finances.</p>
      </div>
      
      <div className="space-y-4 relative z-10">
        <Link 
          href="/signup"
          className="block w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl border border-red-400/30 hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group text-center"
        >
          <NoiseOverlay opacity={0.05} />
          <span className="relative z-10">Create Account</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <Link href="/login" className="block w-full text-red-300 py-3 font-semibold hover:text-red-200 transition-colors text-center">Log In</Link>
      </div>
    </div>
  );
}
