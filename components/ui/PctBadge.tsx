import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";
import { formatPct } from "@/lib/format";

export default function PctBadge({
  value,
  invert = false,
}: {
  value: number;
  /** For expenses, a positive change is bad — flip the color semantics. */
  invert?: boolean;
}) {
  const isPositive = invert ? value <= 0 : value >= 0;
  const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
        isPositive ? "bg-positive-bg text-positive" : "bg-negative-bg text-negative"
      )}
    >
      <Icon size={12} />
      {formatPct(value)}
    </span>
  );
}
