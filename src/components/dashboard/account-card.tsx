import { type Account } from "@/lib/data";
import NoiseOverlay from "../noise-overlay";

const getAccountIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bca')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">BCA</div>;
    }
    if (lowerName.includes('gopay')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">GP</div>;
    }
    if (lowerName.includes('ovo')) {
        return <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">OVO</div>;
    }
    return <div className="w-14 h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl mr-4 flex items-center justify-center text-sm font-black shadow-lg">AC</div>;
}


export default function AccountCard({ account }: { account: Account }) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(account.balance);

  return (
    <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-red-600/20 shadow-2xl relative overflow-hidden">
        <NoiseOverlay opacity={0.03} />
        <div className="flex items-center relative z-10">
            {getAccountIcon(account.name)}
            <div>
            <div className="font-black text-lg text-white">{account.name}</div>
            <div className="text-red-300 text-sm">...{account.last4}</div>
            </div>
        </div>
        <div className="text-right relative z-10">
            <div className="font-black text-lg text-white">{formattedAmount}</div>
        </div>
    </div>
  );
}
