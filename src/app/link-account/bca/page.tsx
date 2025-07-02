import Link from 'next/link';
import NoiseOverlay from '@/components/noise-overlay';
import { Check } from 'lucide-react';

export default function BcaAuthPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 text-slate-900 p-6 min-h-screen relative overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-2xl">BCA</span>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-blue-900 font-serif">Authorize Cuan to access your BCA account</h1>
      </div>

      <div className="space-y-5 mb-8 relative z-10">
        <div className="flex items-start bg-blue-50 p-4 rounded-2xl border border-blue-200/50">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View account balance & details</span>
        </div>
        <div className="flex items-start bg-blue-50 p-4 rounded-2xl border border-blue-200/50">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View transaction history</span>
        </div>
        <div className="flex items-start bg-blue-50 p-4 rounded-2xl border border-blue-200/50">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">Initiate payments (you will always confirm with your Cuan PIN)</span>
        </div>
      </div>

      <div className="bg-blue-100 p-5 rounded-2xl mb-8 border border-blue-200/80 relative z-10">
        <p className="text-blue-900 font-semibold">You are in a secure BCA environment. Cuan will not see your password.</p>
      </div>

      <div className="space-y-4 relative z-10">
        <Link 
          href="/dashboard"
          className="block text-center w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Authorize
        </Link>
        <Link href="/link-account" className="block text-center w-full text-slate-600 py-3 font-bold hover:text-slate-800 transition-colors">Cancel</Link>
      </div>
    </div>
  );
}
