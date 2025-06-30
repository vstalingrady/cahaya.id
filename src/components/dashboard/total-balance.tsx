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
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg relative overflow-hidden group hover:shadow-primary/20 transition-all duration-300">
       <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full filter blur-xl opacity-70 group-hover:scale-125 transition-transform duration-500"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        <Wallet className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold font-headline text-foreground">
          {formattedAmount}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Across all linked accounts</p>
      </CardContent>
    </Card>
  );
}
