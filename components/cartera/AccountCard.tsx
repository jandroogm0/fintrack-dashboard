import { Landmark, LineChart, Coins, Banknote } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import type { PortfolioAccount } from "@/lib/data";

const TIPO_ICON: Record<string, typeof Landmark> = {
  "Cuenta Corriente": Landmark,
  Fondo: LineChart,
  ETF: LineChart,
  Acciones: Coins,
  Efectivo: Banknote,
};

export default function AccountCard({ account }: { account: PortfolioAccount }) {
  const Icon = TIPO_ICON[account.tipoCuenta] ?? Landmark;
  const negative = account.balance < 0;

  return (
    <Card className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{account.name}</p>
        <p className="text-xs text-muted">{account.tipoCuenta}</p>
      </div>
      <span
        className={`shrink-0 text-sm font-semibold ${negative ? "text-negative" : "text-foreground"}`}
      >
        {formatCurrency(account.balance)}
      </span>
    </Card>
  );
}
