import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function LinkAccountPage() {
  return (
    <div className="w-full max-w-md mx-auto bg-background text-white p-6 min-h-screen relative overflow-hidden">
      
      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-bold mb-3 text-primary font-serif">Let's get you connected.</h1>
        <p className="text-muted-foreground leading-relaxed">Select an account to link. We use official and secure bank APIs to connect. We never store your login credentials.</p>
      </div>

      <div className="space-y-8 relative z-10">
        <div>
          <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">Banks</h3>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/link-account/bca"
              className="bg-card p-5 rounded-2xl flex items-center justify-between hover:bg-secondary transition-all duration-300 transform hover:scale-105 border border-border shadow-lg shadow-primary/10 group"
            >
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">BCA</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">BCA</div>
                  <div className="text-muted-foreground text-sm">Bank Central Asia</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" />
            </Link>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-secondary rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">BNI</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">BNI</div>
                  <div className="text-muted-foreground text-sm">Bank Negara Indonesia</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
             <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-secondary rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">MDR</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Mandiri</div>
                  <div className="text-muted-foreground text-sm">Bank Mandiri</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-secondary rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">JAGO</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Jago</div>
                  <div className="text-muted-foreground text-sm">Bank Jago</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">E-Wallets</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-sky-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">GP</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">GoPay</div>
                  <div className="text-muted-foreground text-sm">Gojek Digital Wallet</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-purple-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">OVO</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">OVO</div>
                  <div className="text-muted-foreground text-sm">Digital Payment</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
             <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-blue-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">DA</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">DANA</div>
                  <div className="text-muted-foreground text-sm">Dompet Digital</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-red-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">LA</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">LinkAja</div>
                  <div className="text-muted-foreground text-sm">Dompet Digital</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">Investments</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-green-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">BB</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Bibit</div>
                  <div className="text-muted-foreground text-sm">Mutual Funds</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">PT</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Pintu</div>
                  <div className="text-muted-foreground text-sm">Cryptocurrency</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
             <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-teal-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">AJ</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Ajaib</div>
                  <div className="text-muted-foreground text-sm">Stocks & Crypto</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-primary/70 mb-4 uppercase tracking-widest">Pinjaman Online</h3>
          <div className="grid grid-cols-1 gap-4">
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-orange-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">KR</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Kredivo</div>
                  <div className="text-muted-foreground text-sm">PayLater & Loans</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
            <button className="bg-card p-5 rounded-2xl flex items-center justify-between border border-border shadow-lg shadow-primary/10 opacity-50 cursor-not-allowed">
              <div className="flex items-center relative z-10">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl mr-4 flex items-center justify-center text-sm font-bold shadow-lg">AK</div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-white">Akulaku</div>
                  <div className="text-muted-foreground text-sm">PayLater & Loans</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground relative z-10" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
