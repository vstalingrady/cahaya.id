import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Account } from "@/lib/data";
import BankIcon from "../icons/bank-icon";
import EwalletIcon from "../icons/ewallet-icon";

type AccountCardProps = {
  account: Account;
};

export default function AccountCard({ account }: AccountCardProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(account.balance);
  
  const Icon = account.type === 'bank' ? BankIcon : EwalletIcon;

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-primary/20 shadow-md hover:shadow-glow-accent hover:border-accent transition-all duration-300 group">
       <div className="absolute -bottom-5 -left-5 w-16 h-16 bg-accent/10 rounded-full filter blur-md opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline">
          {formattedAmount}
        </div>
        <p className="text-xs text-muted-foreground">
            {account.type === 'bank' ? `Account ending in` : 'E-Wallet'} {account.last4}
        </p>
      </CardContent>
    </Card>
  );
}
