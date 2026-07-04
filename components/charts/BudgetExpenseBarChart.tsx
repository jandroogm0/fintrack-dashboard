"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatAxisCompact, formatCurrency } from "@/lib/format";

export default function BudgetExpenseBarChart({
  data,
}: {
  data: { month: string; budget: number; expense: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#ECEBF7" vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#8B8B9E" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#8B8B9E" }}
          tickFormatter={(v) => formatAxisCompact(Number(v))}
          width={64}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #ECEBF7",
            fontSize: 13,
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "#8B8B9E" }}
        />
        <Bar dataKey="expense" name="Gasto" fill="#6C5DD3" radius={[6, 6, 0, 0]} maxBarSize={28} />
        <Bar
          dataKey="budget"
          name="Presupuesto"
          fill="#D9D3F7"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
