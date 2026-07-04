import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import BudgetRow from "@/components/budget/BudgetRow";
import { budgetRows, currentMonthKey, monthLabel } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default function PresupuestoPage() {
  const current = currentMonthKey();
  const rows = budgetRows(current);
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const exceededCount = rows.filter((r) => r.pctUsed > 100).length;

  return (
    <div>
      <PageHeader
        title="Presupuesto"
        subtitle={`Comparativa de presupuesto frente a gasto real · ${monthLabel(current)}`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-muted">Presupuesto total</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(totalBudget)}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-muted">Gastado este mes</p>
          <p className="mt-2 text-2xl font-semibold">{formatCurrency(totalActual)}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-muted">Categorías superadas</p>
          <p className="mt-2 text-2xl font-semibold">{exceededCount}</p>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-4 text-sm font-semibold">Por categoría</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {rows.map((row) => (
            <BudgetRow key={row.categoryId} row={row} />
          ))}
        </div>
      </Card>
    </div>
  );
}
