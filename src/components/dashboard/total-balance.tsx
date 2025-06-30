import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

type TotalBalanceProps = {
  amount: number;
};

export default function TotalBalance({ amount }: TotalBalanceProps) {
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Card className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg transition-all duration-300 group hover:shadow-glow-primary border-0">
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full filter blur-xl opacity-70 group-hover:scale-125 transition-transform duration-500"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Balance</CardTitle>
        <Wallet className="h-5 w-5 text-primary-foreground" />
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-4xl font-bold font-headline text-primary-foreground">
          {formattedAmount}
        </div>
        <p className="text-xs text-primary-foreground/80 mt-1">Across all linked accounts</p>
      </CardContent>
    </Card>
  );
}
