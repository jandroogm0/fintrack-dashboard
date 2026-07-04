export type TipoCuenta = "Cuenta Corriente" | "Fondo" | "ETF" | "Acciones" | "Efectivo";
export type TipoRenta = "Efectivo" | "Renta Variable" | "Renta Fija";

export interface Account {
  id: string;
  name: string;
  tipoCuenta: TipoCuenta;
  tipoRenta: TipoRenta;
  start: number;
}

export interface Category {
  id: string;
  name: string;
  monthlyBudget?: number;
}

export interface RawExpense {
  name: string;
  amount: number;
  date: string;
  accountId: string;
  categoryId: string;
}

export interface RawIncome {
  name: string;
  amount: number;
  date: string;
  accountId: string;
  categoryId: string;
}

export interface RawTransfer {
  name: string;
  amount: number;
  date: string;
  fromAccountId: string;
  toAccountId: string;
}

export type TransactionKind = "income" | "expense" | "transfer";

export interface Transaction {
  kind: TransactionKind;
  name: string;
  amount: number;
  date: string;
  accountName: string;
  toAccountName?: string;
  categoryName?: string;
}
