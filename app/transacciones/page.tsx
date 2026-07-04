import PageHeader from "@/components/layout/PageHeader";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { allTransactions } from "@/lib/data";

export default function TransaccionesPage() {
  const transactions = allTransactions();

  return (
    <div>
      <PageHeader
        title="Transacciones"
        subtitle="Ingresos, gastos y transferencias entre cuentas"
      />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
