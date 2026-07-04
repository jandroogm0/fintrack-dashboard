import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import AnalyticsStatCard from "@/components/ui/AnalyticsStatCard";
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
  incomeCategoryName,
  expenseCategoryName,
} from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default function AnalyticsPage() {
  const current = currentMonthKey();
  const previous = shiftMonthKey(current, -1);

  const balanceNow = totalBalance(current);
  const balancePrev = totalBalance(previous);
  const incomeNow = monthlyIncomeTotal(current);
  const incomePrev = monthlyIncomeTotal(previous);
  const expenseNow = monthlyExpenseTotal(current);
  const expensePrev = monthlyExpenseTotal(previous);

  const incomesThisMonth = incomes.filter((t) => monthKey(t.date) === current);
  const expensesThisMonth = expenses.filter((t) => monthKey(t.date) === current);
  const transfersThisMonth = transfers.filter((t) => monthKey(t.date) === current);

  const incomeCategoriesUsed = new Set(incomesThisMonth.map((i) => incomeCategoryName(i.categoryId)));
  const expenseCategoriesUsed = new Set(expensesThisMonth.map((e) => expenseCategoryName(e.categoryId)));
  const allCategoriesUsed = new Set([...incomeCategoriesUsed, ...expenseCategoriesUsed]);

  const balanceDiff = balanceNow - balancePrev;
  const incomeDiff = incomeNow - incomePrev;
  const expenseDiff = expenseNow - expensePrev;

  const donut = expenseBreakdown(current);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Detailed overview of your financial situation" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AnalyticsStatCard
          title="Balance total"
          amount={balanceNow}
          pctChange={pctChange(balanceNow, balancePrev)}
          diffLabel={`${balanceDiff >= 0 ? "Tienes extra" : "Tienes de menos"} ${formatCurrency(Math.abs(balanceDiff))} respecto al mes anterior`}
          txCount={incomesThisMonth.length + expensesThisMonth.length + transfersThisMonth.length}
          categoryCount={allCategoriesUsed.size}
        />
        <AnalyticsStatCard
          title="Ingresos"
          amount={incomeNow}
          pctChange={pctChange(incomeNow, incomePrev)}
          diffLabel={`${incomeDiff >= 0 ? "Ganas extra" : "Ganas de menos"} ${formatCurrency(Math.abs(incomeDiff))} respecto al mes anterior`}
          txCount={incomesThisMonth.length}
          categoryCount={incomeCategoriesUsed.size}
        />
        <AnalyticsStatCard
          title="Gastos"
          amount={expenseNow}
          pctChange={pctChange(expenseNow, expensePrev)}
          invertPct
          diffLabel={`${expenseDiff >= 0 ? "Gastas extra" : "Gastas de menos"} ${formatCurrency(Math.abs(expenseDiff))} respecto al mes anterior`}
          txCount={expensesThisMonth.length}
          categoryCount={expenseCategoriesUsed.size}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Total balance overview</h2>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {monthLabel(current)} {current.slice(0, 4)}
            </span>
          </div>
          <div className="mt-2">
            <BalanceLineChart data={balanceSeries()} />
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Statistics</h2>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              Gastos
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            Aumento del gasto en varias categorías este mes
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
        <h2 className="text-sm font-semibold">Comparing of budget and expense</h2>
        <div className="mt-2">
          <BudgetExpenseBarChart data={budgetVsExpenseSeries()} />
        </div>
      </Card>
    </div>
  );
}
