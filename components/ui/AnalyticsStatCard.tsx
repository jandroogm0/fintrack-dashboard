import { ArrowLeftRight, Grid2x2 } from "lucide-react";
import Card from "@/components/ui/Card";
import PctBadge from "@/components/ui/PctBadge";
import { formatCurrency } from "@/lib/format";

export default function AnalyticsStatCard({
  title,
  amount,
  pctChange,
  invertPct = false,
  diffLabel,
  txCount,
  categoryCount,
}: {
  title: string;
  amount: number;
  pctChange: number;
  invertPct?: boolean;
  diffLabel: string;
  txCount: number;
  categoryCount: number;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted">{title}</span>
        <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary">
          EUR
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">
        {formatCurrency(amount)}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <PctBadge value={pctChange} invert={invertPct} />
      </div>
      <p className="mt-2 text-xs text-muted">{diffLabel}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <ArrowLeftRight size={14} />
          {txCount} transacciones
        </span>
        <span className="flex items-center gap-1.5">
          <Grid2x2 size={14} />
          {categoryCount} categorías
        </span>
      </div>
    </Card>
  );
}
