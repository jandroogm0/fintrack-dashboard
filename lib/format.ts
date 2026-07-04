export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

// Short axis-tick label (e.g. "24k €") — formatCompact's "24 mil €" is too
// wide for a narrow Y-axis column and gets visually clipped by recharts.
export function formatAxisCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${Math.round((value / 1_000_000) * 10) / 10}M €`;
  if (abs >= 1_000) return `${Math.round((value / 1000) * 10) / 10}k €`;
  return `${value} €`;
}

export function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}
