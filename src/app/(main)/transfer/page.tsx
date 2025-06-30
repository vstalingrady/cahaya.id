import { Send, Hand, Users, Gift, QrCode, Shuffle } from 'lucide-react';
import NoiseOverlay from '@/components/noise-overlay';

const actions = [
  { name: 'Pay with QRIS', subtext: 'Scan any QR to pay', icon: QrCode },
  { name: 'Top Up', subtext: 'Move money between accounts', icon: Shuffle },
  { name: 'Transfer', subtext: 'Send money to any account', icon: Send },
  { name: 'Request Money', subtext: 'Ask for payment from friends', icon: Hand },
  { name: 'Split Bill', subtext: 'Divide expenses with a group', icon: Users },
  { name: 'Send a Gift', subtext: 'Surprise someone with Cuan', icon: Gift },
];

export default function TransferPage() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Pay & Transfer
        </h1>
        <p className="text-muted-foreground">Your central hub for all payments.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {actions.map((action) => (
          <button key={action.name} className="w-full text-left bg-gradient-to-r from-red-900/50 to-red-800/50 backdrop-blur-xl p-5 rounded-2xl flex items-center gap-5 hover:from-red-800/60 hover:to-red-700/60 transition-all duration-300 border border-red-600/20 shadow-2xl group relative overflow-hidden">
            <NoiseOverlay opacity={0.03} />
            <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg">
                <action.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-lg text-white">{action.name}</p>
              <p className="text-red-300 text-sm">{action.subtext}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
