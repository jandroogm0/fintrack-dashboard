import { Wallet } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import AccountCard from "@/components/cartera/AccountCard";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import { portfolioAccounts, portfolioByTipoRenta } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const GROUP_ORDER = ["Renta Variable", "Renta Fija", "Efectivo"];

export default function CarteraPage() {
  const accounts = portfolioAccounts();
  const totalValue = accounts.reduce((s, a) => s + a.balance, 0);
  const breakdown = portfolioByTipoRenta();

  return (
    <div>
      <PageHeader title="Cartera" subtitle="Todas tus cuentas e inversiones en un vistazo" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted">
            <Wallet size={16} />
            Valor total de la cartera
          </div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">
            {formatCurrency(totalValue)}
          </div>
          <p className="mt-1 text-xs text-muted">{accounts.length} cuentas</p>
        </Card>

        <Card className="xl:col-span-3">
          <h2 className="text-sm font-semibold">Asignación por tipo de renta</h2>
          <div className="mt-4">
            <CategoryDonutChart
              data={breakdown}
              centerLabel="Total"
              centerValue={totalValue}
            />
          </div>
        </Card>
      </div>

      {GROUP_ORDER.map((group) => {
        const groupAccounts = accounts.filter((a) => a.tipoRenta === group);
        if (groupAccounts.length === 0) return null;
        const groupTotal = groupAccounts.reduce((s, a) => s + a.balance, 0);

        return (
          <div key={group} className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{group}</h3>
              <span className="text-sm text-muted">{formatCurrency(groupTotal)}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {groupAccounts.map((a) => (
                <AccountCard key={a.id} account={a} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
