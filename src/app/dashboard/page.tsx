import TotalBalance from "@/components/dashboard/total-balance";
import AccountCard from "@/components/dashboard/account-card";
import TransactionHistory from "@/components/dashboard/transaction-history";
import AIInsights from "@/components/dashboard/ai-insights";
import { accounts, transactions } from "@/lib/data";
import PaymentSuggester from "@/components/dashboard/payment-suggester";

export default function DashboardPage() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left/Top Column on smaller screens */}
        <div className="lg:col-span-1 space-y-8">
          <div className="animate-float-in" style={{ animationDelay: '100ms' }}>
            <TotalBalance amount={totalBalance} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold font-headline animate-float-in" style={{ animationDelay: '200ms' }}>Linked Accounts</h2>
            {accounts.map((account, index) => (
              <div key={account.id} className="animate-float-in" style={{ animationDelay: `${300 + index * 100}ms` }}>
                <AccountCard account={account} />
              </div>
            ))}
          </div>

           <div className="animate-float-in" style={{ animationDelay: '600ms' }}>
             <PaymentSuggester />
           </div>

        </div>

        {/* Right/Bottom Column on smaller screens */}
        <div className="lg:col-span-2 space-y-8">
          <div className="animate-float-in" style={{ animationDelay: '700ms' }}>
            <AIInsights allTransactions={transactions} />
          </div>

          <div className="animate-float-in" style={{ animationDelay: '800ms' }}>
            <TransactionHistory transactions={transactions} />
          </div>
        </div>

      </div>
    </div>
  );
}
