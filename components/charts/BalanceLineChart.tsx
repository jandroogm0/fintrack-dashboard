"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatAxisCompact, formatCurrency } from "@/lib/format";

export default function BalanceLineChart({
  data,
}: {
  data: { month: string; balance: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C5DD3" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6C5DD3" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#6C5DD3"
          strokeWidth={2.5}
          fill="url(#balanceFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
