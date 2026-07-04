import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";
import PctBadge from "@/components/ui/PctBadge";
import { formatCurrency } from "@/lib/format";

export default function StatCard({
  title,
  amount,
  pctChange,
  invertPct = false,
  footerLabel,
  footerIcon: FooterIcon,
}: {
  title: string;
  amount: number;
  pctChange: number;
  invertPct?: boolean;
  footerLabel: string;
  footerIcon: LucideIcon;
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
        <span className="text-xs text-muted">vs. mes anterior</span>
      </div>
      <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted">
        <FooterIcon size={14} />
        {footerLabel}
      </div>
    </Card>
  );
}
