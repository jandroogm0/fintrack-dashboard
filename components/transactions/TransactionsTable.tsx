"use client";

import { useMemo, useState } from "react";
import { Search, ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import clsx from "clsx";
import type { Transaction, TransactionKind } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

const FILTERS: { key: TransactionKind | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "income", label: "Ingresos" },
  { key: "expense", label: "Gastos" },
  { key: "transfer", label: "Transferencias" },
];

const KIND_STYLES: Record<TransactionKind, { icon: typeof ArrowDownLeft; className: string }> = {
  income: { icon: ArrowDownLeft, className: "bg-positive-bg text-positive" },
  expense: { icon: ArrowUpRight, className: "bg-negative-bg text-negative" },
  transfer: { icon: ArrowRightLeft, className: "bg-primary-light text-primary" },
};

export default function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<TransactionKind | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter !== "all" && t.kind !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = `${t.name} ${t.accountName} ${t.categoryName ?? ""} ${t.toAccountName ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [transactions, filter, query]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-primary-light p-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={clsx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === key ? "bg-surface text-primary shadow-sm" : "text-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar transacción..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Transacción</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Cuenta</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 text-right font-medium">Importe</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 200).map((t, i) => {
              const { icon: Icon, className } = KIND_STYLES[t.kind];
              const sign = t.kind === "expense" ? "-" : t.kind === "income" ? "+" : "";
              return (
                <tr key={`${t.date}-${t.name}-${i}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full", className)}>
                        <Icon size={14} />
                      </span>
                      <span className="font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(t.date)}</td>
                  <td className="px-4 py-3 text-muted">
                    {t.kind === "transfer" ? `${t.accountName} → ${t.toAccountName}` : t.accountName}
                  </td>
                  <td className="px-4 py-3 text-muted">{t.categoryName ?? "—"}</td>
                  <td
                    className={clsx(
                      "px-4 py-3 text-right font-medium",
                      t.kind === "expense" && "text-negative",
                      t.kind === "income" && "text-positive"
                    )}
                  >
                    {sign}
                    {formatCurrency(t.amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted">
            No se encontraron transacciones.
          </p>
        )}
      </div>
    </div>
  );
}
