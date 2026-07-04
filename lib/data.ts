import accountsRaw from "@/data/accounts.json";
import expenseCategoriesRaw from "@/data/expense-categories.json";
import incomeCategoriesRaw from "@/data/income-categories.json";
import expensesRaw from "@/data/expenses.json";
import incomesRaw from "@/data/incomes.json";
import transfersRaw from "@/data/transfers.json";
import type {
  Account,
  Category,
  RawExpense,
  RawIncome,
  RawTransfer,
  Transaction,
} from "@/lib/types";

export const accounts: Account[] = accountsRaw as Account[];
export const expenseCategories: Category[] = expenseCategoriesRaw as Category[];
export const incomeCategories: Category[] = incomeCategoriesRaw as Category[];
export const expenses: RawExpense[] = expensesRaw as RawExpense[];
export const incomes: RawIncome[] = incomesRaw as RawIncome[];
export const transfers: RawTransfer[] = transfersRaw as RawTransfer[];

const accountById = new Map(accounts.map((a) => [a.id, a]));
const expenseCategoryById = new Map(expenseCategories.map((c) => [c.id, c]));
const incomeCategoryById = new Map(incomeCategories.map((c) => [c.id, c]));

export function accountName(id: string): string {
  return accountById.get(id)?.name ?? "Desconocida";
}

export function expenseCategoryName(id: string): string {
  return expenseCategoryById.get(id)?.name ?? "Otros";
}

export function incomeCategoryName(id: string): string {
  return incomeCategoryById.get(id)?.name ?? "Otros";
}

export function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

const MONTH_LABELS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export function monthLabel(key: string): string {
  const [, m] = key.split("-");
  return MONTH_LABELS[Number(m) - 1];
}

export function shiftMonthKey(key: string, delta: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// "Today" is driven by the real clock; expenses beyond the current month are
// future recurring entries already scheduled in Notion and shouldn't count yet.
export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function isPastOrCurrent(key: string): boolean {
  return key <= currentMonthKey();
}

// ---- Unified transaction feed (Transacciones tab) ----

export function allTransactions(): Transaction[] {
  const list: Transaction[] = [
    ...incomes.map((i) => ({
      kind: "income" as const,
      name: i.name,
      amount: i.amount,
      date: i.date,
      accountName: accountName(i.accountId),
      categoryName: incomeCategoryName(i.categoryId),
    })),
    ...expenses.map((e) => ({
      kind: "expense" as const,
      name: e.name,
      amount: e.amount,
      date: e.date,
      accountName: accountName(e.accountId),
      categoryName: expenseCategoryName(e.categoryId),
    })),
    ...transfers.map((t) => ({
      kind: "transfer" as const,
      name: t.name,
      amount: t.amount,
      date: t.date,
      accountName: accountName(t.fromAccountId),
      toAccountName: accountName(t.toAccountId),
    })),
  ];
  return list
    .filter((t) => isPastOrCurrent(monthKey(t.date)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---- Balances ----

export function accountBalance(accountId: string, upToMonth = currentMonthKey()): number {
  const account = accountById.get(accountId);
  let balance = account?.start ?? 0;
  balance += incomes
    .filter((i) => i.accountId === accountId && isPastOrCurrent(monthKey(i.date)) && monthKey(i.date) <= upToMonth)
    .reduce((s, i) => s + i.amount, 0);
  balance -= expenses
    .filter((e) => e.accountId === accountId && monthKey(e.date) <= upToMonth)
    .reduce((s, e) => s + e.amount, 0);
  balance += transfers
    .filter((t) => t.toAccountId === accountId && monthKey(t.date) <= upToMonth)
    .reduce((s, t) => s + t.amount, 0);
  balance -= transfers
    .filter((t) => t.fromAccountId === accountId && monthKey(t.date) <= upToMonth)
    .reduce((s, t) => s + t.amount, 0);
  return balance;
}

export function totalBalance(upToMonth = currentMonthKey()): number {
  return accounts.reduce((s, a) => s + accountBalance(a.id, upToMonth), 0);
}

// ---- Monthly series ----

export function monthlyIncomeTotal(key: string): number {
  return incomes.filter((i) => monthKey(i.date) === key).reduce((s, i) => s + i.amount, 0);
}

export function monthlyExpenseTotal(key: string): number {
  return expenses.filter((e) => monthKey(e.date) === key).reduce((s, e) => s + e.amount, 0);
}

export function availableMonthKeys(): string[] {
  const keys = new Set<string>();
  [...incomes, ...expenses]
    .map((t) => monthKey(t.date))
    .filter(isPastOrCurrent)
    .forEach((k) => keys.add(k));
  return Array.from(keys).sort();
}

export function balanceSeries(): { month: string; balance: number }[] {
  return availableMonthKeys().map((key) => ({
    month: monthLabel(key),
    balance: Math.round(totalBalance(key)),
  }));
}

export function budgetVsExpenseSeries(): { month: string; budget: number; expense: number }[] {
  const totalBudget = expenseCategories.reduce((s, c) => s + (c.monthlyBudget ?? 0), 0);
  return availableMonthKeys().map((key) => ({
    month: monthLabel(key),
    budget: Math.round(totalBudget),
    expense: Math.round(monthlyExpenseTotal(key)),
  }));
}

// ---- Category breakdown (Statistics donut) ----

export interface CategorySlice {
  name: string;
  value: number;
  pct: number;
}

export function expenseBreakdown(monthFilter?: string): CategorySlice[] {
  const filtered = monthFilter
    ? expenses.filter((e) => monthKey(e.date) === monthFilter)
    : expenses;
  const totals = new Map<string, number>();
  filtered.forEach((e) => {
    const name = expenseCategoryName(e.categoryId);
    totals.set(name, (totals.get(name) ?? 0) + e.amount);
  });
  const sum = Array.from(totals.values()).reduce((s, v) => s + v, 0) || 1;
  return Array.from(totals.entries())
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100, pct: (value / sum) * 100 }))
    .sort((a, b) => b.value - a.value);
}

// ---- Budget vs actual (Presupuesto tab) ----

export interface BudgetRow {
  categoryId: string;
  name: string;
  budget: number;
  actual: number;
  pctUsed: number;
}

export function budgetRows(monthFilter = currentMonthKey()): BudgetRow[] {
  return expenseCategories
    .filter((c) => (c.monthlyBudget ?? 0) > 0)
    .map((c) => {
      const actual = expenses
        .filter((e) => e.categoryId === c.id && monthKey(e.date) === monthFilter)
        .reduce((s, e) => s + e.amount, 0);
      const budget = c.monthlyBudget ?? 0;
      return {
        categoryId: c.id,
        name: c.name,
        budget,
        actual: Math.round(actual * 100) / 100,
        pctUsed: budget > 0 ? (actual / budget) * 100 : 0,
      };
    })
    .sort((a, b) => b.pctUsed - a.pctUsed);
}

// ---- Cartera (portfolio) ----

export interface PortfolioAccount {
  id: string;
  name: string;
  tipoCuenta: string;
  tipoRenta: string;
  balance: number;
}

export function portfolioAccounts(): PortfolioAccount[] {
  return accounts
    .map((a) => ({
      id: a.id,
      name: a.name,
      tipoCuenta: a.tipoCuenta,
      tipoRenta: a.tipoRenta,
      balance: Math.round(accountBalance(a.id) * 100) / 100,
    }))
    .sort((a, b) => b.balance - a.balance);
}

export function portfolioByTipoRenta(): CategorySlice[] {
  const list = portfolioAccounts();
  const totals = new Map<string, number>();
  list.forEach((a) => totals.set(a.tipoRenta, (totals.get(a.tipoRenta) ?? 0) + a.balance));
  const sum = Array.from(totals.values()).reduce((s, v) => s + v, 0) || 1;
  return Array.from(totals.entries()).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
    pct: (value / sum) * 100,
  }));
}

// ---- Summary stat cards ----

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}
