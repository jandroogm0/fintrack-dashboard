import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import BalanceLineChart from "@/components/charts/BalanceLineChart";
import BudgetExpenseBarChart from "@/components/charts/BudgetExpenseBarChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import {
  currentMonthKey,
  shiftMonthKey,
  monthLabel,
  totalBalance,
  monthlyIncomeTotal,
  monthlyExpenseTotal,
  pctChange,
  balanceSeries,
  budgetVsExpenseSeries,
  expenseBreakdown,
  incomes,
  expenses,
  transfers,
  monthKey,
} from "@/lib/data";

export default function ResumenPage() {
  const current = currentMonthKey();
  const previous = shiftMonthKey(current, -1);

  const balanceNow = totalBalance(current);
  const balancePrev = totalBalance(previous);

  const incomeNow = monthlyIncomeTotal(current);
  const incomePrev = monthlyIncomeTotal(previous);

  const expenseNow = monthlyExpenseTotal(current);
  const expensePrev = monthlyExpenseTotal(previous);

  const txThisMonth = [...incomes, ...expenses, ...transfers].filter(
    (t) => monthKey(t.date) === current
  ).length;
  const incomeTxThisMonth = incomes.filter((t) => monthKey(t.date) === current).length;
  const expenseTxThisMonth = expenses.filter((t) => monthKey(t.date) === current).length;

  const donut = expenseBreakdown(current);

  return (
    <div>
      <PageHeader
        title="Resumen"
        subtitle="Vista general de tu situación financiera"
        actions={
          <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium">
            {monthLabel(current)} {current.slice(0, 4)}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Balance total"
          amount={balanceNow}
          pctChange={pctChange(balanceNow, balancePrev)}
          footerLabel={`${txThisMonth} transacciones este mes`}
          footerIcon={Wallet}
        />
        <StatCard
          title="Ingresos"
          amount={incomeNow}
          pctChange={pctChange(incomeNow, incomePrev)}
          footerLabel={`${incomeTxThisMonth} ingresos este mes`}
          footerIcon={TrendingUp}
        />
        <StatCard
          title="Gastos"
          amount={expenseNow}
          pctChange={pctChange(expenseNow, expensePrev)}
          invertPct
          footerLabel={`${expenseTxThisMonth} gastos este mes`}
          footerIcon={TrendingDown}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <h2 className="text-sm font-semibold">Evolución del balance</h2>
          <p className="text-xs text-muted">Balance total acumulado por mes</p>
          <div className="mt-2">
            <BalanceLineChart data={balanceSeries()} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="text-sm font-semibold">Gasto por categoría</h2>
          <p className="text-xs text-muted">
            {monthLabel(current)} · {donut.length} categorías activas
          </p>
          <div className="mt-4">
            <CategoryDonutChart
              data={donut}
              centerLabel="Gasto del mes"
              centerValue={expenseNow}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-sm font-semibold">Presupuesto vs. gasto real</h2>
        <p className="text-xs text-muted">Comparativa mensual</p>
        <div className="mt-2">
          <BudgetExpenseBarChart data={budgetVsExpenseSeries()} />
        </div>
      </Card>
    </div>
  );
}
