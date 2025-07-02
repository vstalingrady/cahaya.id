import Link from 'next/link';
import NoiseOverlay from '@/components/noise-overlay';
import { Check } from 'lucide-react';

export default function BcaAuthPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-white via-red-50 to-red-100 text-slate-900 p-6 min-h-screen relative overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-300/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg border border-red-500/20">
          <span className="text-white font-bold text-2xl">BCA</span>
        </div>
        <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent font-serif">Authorize Cuan to access your BCA account</h1>
      </div>

      <div className="space-y-5 mb-8 relative z-10">
        <div className="flex items-start bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl border border-red-200/50">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View account balance & details</span>
        </div>
        <div className="flex items-start bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl border border-red-200/50">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View transaction history</span>
        </div>
        <div className="flex items-start bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-2xl border border-red-200/50">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">Initiate payments (you will always confirm with your Cuan PIN)</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-100 to-red-200 p-5 rounded-2xl mb-8 border border-red-300/50 relative z-10">
        <p className="text-red-900 font-semibold">You are in a secure BCA environment. Cuan will not see your password.</p>
      </div>

      <div className="space-y-4 relative z-10">
        <Link 
          href="/dashboard"
          className="block text-center w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
        >
          <NoiseOverlay opacity={0.05} />
          <span className="relative z-10">Authorize</span>
        </Link>
        <Link href="/link-account" className="block text-center w-full text-red-600 py-3 font-bold hover:text-red-700 transition-colors">Cancel</Link>
      </div>
    </div>
  );
}
