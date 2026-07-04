import clsx from "clsx";
import { formatCurrency } from "@/lib/format";
import type { BudgetRow as BudgetRowData } from "@/lib/data";

export default function BudgetRow({ row }: { row: BudgetRowData }) {
  const exceeded = row.pctUsed > 100;
  const widthPct = Math.min(row.pctUsed, 100);

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{row.name}</span>
        <div className="flex items-center gap-2">
          {exceeded && (
            <span className="rounded-full bg-negative-bg px-2 py-0.5 text-xs font-medium text-negative">
              Superado {(row.pctUsed - 100).toFixed(0)}%
            </span>
          )}
          <span className="text-sm text-muted">
            {formatCurrency(row.actual)} / {formatCurrency(row.budget)}
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-primary-light">
        <div
          className={clsx("h-full rounded-full", exceeded ? "bg-negative" : "bg-primary")}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}
