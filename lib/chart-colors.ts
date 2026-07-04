// Consistent categorical palette used across all donut/bar breakdowns.
export const CHART_COLORS = [
  "#6C5DD3",
  "#4C9AFF",
  "#2FC5A0",
  "#FFB020",
  "#FF6B6B",
  "#FF8FB1",
  "#7C8798",
  "#3E4784",
  "#A6D854",
  "#B6B9C4",
  "#F76707",
  "#12B886",
];

export function colorForIndex(i: number): string {
  return CHART_COLORS[i % CHART_COLORS.length];
}
