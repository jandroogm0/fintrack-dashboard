"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { colorForIndex } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/format";
import type { CategorySlice } from "@/lib/data";

export default function CategoryDonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: CategorySlice[];
  centerLabel: string;
  centerValue: number;
}) {
  const top = data.slice(0, 8);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={top}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={0}
            >
              {top.map((entry, i) => (
                <Cell key={entry.name} fill={colorForIndex(i)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #ECEBF7",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted">{centerLabel}</span>
          <span className="text-lg font-semibold">{formatCurrency(centerValue)}</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {top.map((entry, i) => (
          <li key={entry.name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorForIndex(i) }}
            />
            <span className="min-w-0 flex-1 truncate text-foreground">{entry.name}</span>
            <span className="shrink-0 text-xs text-muted">{entry.pct.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
