'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';
import { cn } from '@/lib/utils';

// In a real app, this map would come from a shared data source.
const institutionDetails: Record<string, { name: string; initials: string; color: string }> = {
  'bca': { name: 'BCA', initials: 'BCA', color: 'bg-blue-600' },
  'mandiri': { name: 'Mandiri', initials: 'MDR', color: 'bg-sky-600' },
  'bri': { name: 'BRI', initials: 'BRI', color: 'bg-blue-800' },
  'bni': { name: 'BNI', initials: 'BNI', color: 'bg-orange-500' },
  'cimb-niaga': { name: 'CIMB Niaga', initials: 'CIMB', color: 'bg-red-600' },
  'danamon': { name: 'Danamon', initials: 'DMN', color: 'bg-orange-400' },
  'permata': { name: 'Permata', initials: 'PMT', color: 'bg-green-500' },
  'ocbc-nisp': { name: 'OCBC NISP', initials: 'OCBC', color: 'bg-red-700' },
  'panin-bank': { name: 'Panin Bank', initials: 'PNB', color: 'bg-blue-700' },
  'btn': { name: 'BTN', initials: 'BTN', color: 'bg-green-700' },
  'dbs': { name: 'DBS', initials: 'DBS', color: 'bg-red-500' },
  'uob': { name: 'UOB', initials: 'UOB', color: 'bg-blue-900' },
  'bank-jago': { name: 'Bank Jago', initials: 'JAGO', color: 'bg-yellow-500' },
  'blu-by-bca': { name: 'Blu by BCA', initials: 'BLU', color: 'bg-sky-400' },
  'seabank': { name: 'SeaBank', initials: 'SEA', color: 'bg-sky-400' },
  'jenius': { name: 'Jenius', initials: 'JN', color: 'bg-orange-400' },
  'aladin': { name: 'Aladin', initials: 'ALD', color: 'bg-teal-600' },
  'tmrw': { name: 'TMRW', initials: 'TMRW', color: 'bg-yellow-400' },
  'gopay': { name: 'GoPay', initials: 'GP', color: 'bg-sky-500' },
  'ovo': { name: 'OVO', initials: 'OVO', color: 'bg-purple-600' },
  'dana': { name: 'DANA', initials: 'DA', color: 'bg-blue-500' },
  'shopeepay': { name: 'ShopeePay', initials: 'SP', color: 'bg-orange-600' },
  'linkaja': { name: 'LinkAja', initials: 'LA', color: 'bg-red-500' },
  'bibit': { name: 'Bibit', initials: 'BB', color: 'bg-green-600' },
  'ajaib': { name: 'Ajaib', initials: 'AJ', color: 'bg-teal-500' },
  'pluang': { name: 'Pluang', initials: 'PL', color: 'bg-yellow-600' },
  'kredivo': { name: 'Kredivo', initials: 'KR', color: 'bg-orange-500' },
  'adira-finance': { name: 'Adira Finance', initials: 'ADR', color: 'bg-red-600' },
  'fifgroup': { name: 'FIFGROUP', initials: 'FIF', color: 'bg-blue-400' },
  'wom-finance': { name: 'WOM Finance', initials: 'WOM', color: 'bg-lime-500' },
};

const defaultInstitution = { name: 'Institution', initials: '???', color: 'bg-gray-500' };

export default function InstitutionAuthPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { initials, color, name: institutionName } = institutionDetails[slug] || defaultInstitution;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 text-slate-900 p-6 min-h-screen relative overflow-hidden">
      <NoiseOverlay opacity={0.02} />
      
      <div className="text-center mb-8 relative z-10">
        <div className={cn("w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg", color)}>
          <span className="text-white font-bold text-2xl">{initials}</span>
        </div>
        <h1 className="text-2xl font-bold mb-3 text-slate-800 font-serif">
          Authorize Cuan to access your {institutionName} account
        </h1>
      </div>

      <div className="space-y-5 mb-8 relative z-10">
        <div className="flex items-start bg-slate-100 p-4 rounded-2xl border border-slate-200/50">
          <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View account balance & details</span>
        </div>
        <div className="flex items-start bg-slate-100 p-4 rounded-2xl border border-slate-200/50">
          <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">View transaction history</span>
        </div>
        <div className="flex items-start bg-slate-100 p-4 rounded-2xl border border-slate-200/50">
          <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
            <Check className="w-3 h-3 text-white" />
          </div>
          <span className="text-slate-800 font-semibold">Initiate payments (you will always confirm with your Cuan PIN)</span>
        </div>
      </div>

      <div className="bg-slate-200/70 p-5 rounded-2xl mb-8 border border-slate-300/50 relative z-10">
        <p className="text-slate-800 font-semibold">You are in a secure {institutionName} environment. Cuan will not see your password.</p>
      </div>

      <div className="space-y-4 relative z-10">
        <Link 
          href="/dashboard"
          className={cn("block text-center w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105", color)}
        >
          Authorize
        </Link>
        <Link href="/link-account" className="block text-center w-full text-slate-600 py-3 font-bold hover:text-slate-800 transition-colors">Cancel</Link>
      </div>
    </div>
  );
}
