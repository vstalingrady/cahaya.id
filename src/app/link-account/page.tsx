
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const getLogo = (name: string) => {
    const lowerName = name.toLowerCase();
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 3);
    
    // Specific overrides
    if (lowerName.includes('bca')) return { initials: 'BCA', color: 'bg-blue-600' };
    if (lowerName.includes('mandiri')) return { initials: 'MDR', color: 'bg-sky-600' };
    if (lowerName.includes('bri')) return { initials: 'BRI', color: 'bg-blue-800' };
    if (lowerName.includes('bni')) return { initials: 'BNI', color: 'bg-orange-500' };
    if (lowerName.includes('gopay')) return { initials: 'GP', color: 'bg-sky-500' };
    if (lowerName.includes('ovo')) return { initials: 'OVO', color: 'bg-purple-600' };
    if (lowerName.includes('dana')) return { initials: 'DA', color: 'bg-blue-500' };
    if (lowerName.includes('shopee')) return { initials: 'SP', color: 'bg-orange-600' };
    if (lowerName.includes('bibit')) return { initials: 'BB', color: 'bg-green-600' };
    if (lowerName.includes('ajaib')) return { initials: 'AJ', color: 'bg-teal-500' };
    if (lowerName.includes('jago')) return { initials: 'JAGO', color: 'bg-yellow-500' };
    if (lowerName.includes('jenius')) return { initials: 'JN', color: 'bg-orange-400' };
    if (lowerName.includes('seabank')) return { initials: 'SEA', color: 'bg-sky-400' };
    
    return { initials, color: 'bg-secondary' };
}

const institutions = [
  { 
    category: "Major Conventional Banks", 
    items: [
      { name: "BCA", description: "Bank Central Asia" },
      { name: "Mandiri", description: "Bank Mandiri" },
      { name: "BRI", description: "Bank Rakyat Indonesia" },
      { name: "BNI", description: "Bank Negara Indonesia" },
      { name: "CIMB Niaga", description: "Bank CIMB Niaga" },
      { name: "Danamon", description: "Bank Danamon" },
      { name: "Permata", description: "Bank Permata" },
    ]
  },
  {
    category: "Digital Banks",
    items: [
      { name: "Bank Jago", description: "Digital Bank" },
      { name: "Blu by BCA", description: "Digital by BCA" },
      { name: "SeaBank", description: "Digital Bank" },
      { name: "Jenius", description: "by BTPN" },
    ]
  },
  {
    category: "E-Wallets",
    items: [
      { name: "GoPay", description: "Gojek Digital Wallet" },
      { name: "OVO", description: "Digital Payment" },
      { name: "DANA", description: "Dompet Digital" },
      { name: "ShopeePay", description: "Shopee Digital Wallet" },
    ]
  },
  {
    category: "Investment Platforms",
    items: [
      { name: "Bibit", description: "Mutual Funds" },
      { name: "Ajaib", description: "Stocks & Crypto" },
      { name: "Pluang", description: "Multi-asset Investment" },
    ]
  }
];

export default function LinkAccountPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen relative overflow-hidden">
      
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-3 text-primary font-serif">Let's get you connected.</h1>
        <p className="text-muted-foreground leading-relaxed">Select an account to link. We use official and secure bank APIs to connect. We never store your login credentials.</p>
      </div>

      <div className="space-y-8 relative z-10">
        {institutions.map(group => (
          <div key={group.category}>
            <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">{group.category}</h3>
            <div className="grid grid-cols-1 gap-4">
              {group.items.map(item => {
                const { initials, color } = getLogo(item.name);
                return (
                  <Link 
                    key={item.name}
                    href="/link-account/bca" // All links go to the sample auth page for this prototype
                    className="bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 transform hover:scale-105 border border-border shadow-lg shadow-primary/10 group"
                  >
                    <div className="flex items-center relative z-10">
                      <div className={`w-12 h-12 ${color} rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg`}>{initials}</div>
                      <div className="text-left">
                        <div className="font-semibold text-lg text-white">{item.name}</div>
                        <div className="text-muted-foreground text-sm">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" />
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
