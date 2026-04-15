import type { ChartSpec } from "@/types";

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export const CHART_COLORS = [
  "hsl(var(--color-chart-1))",
  "hsl(var(--color-chart-2))",
  "hsl(var(--color-chart-3))",
  "hsl(var(--color-chart-4))",
  "hsl(var(--color-chart-5))",
  "hsl(200 60% 50%)",
  "hsl(280 50% 55%)",
  "hsl(340 65% 55%)",
];

/**
 * Transform raw CSV rows into the format Recharts expects
 * based on a ChartSpec from Claude.
 */
export function prepareChartData(
  spec: ChartSpec,
  rows: Record<string, unknown>[],
): ChartDataPoint[] {
  switch (spec.type) {
    case "bar":
    case "line":
      return prepareBarLineData(spec, rows);
    case "pie":
      return preparePieData(spec, rows);
    case "scatter":
      return prepareScatterData(spec, rows);
    default:
      return [];
  }
}

function prepareBarLineData(
  spec: ChartSpec,
  rows: Record<string, unknown>[],
): ChartDataPoint[] {
  const { xColumn, yColumn, groupBy } = spec;

  if (groupBy) {
    // Grouped: { name: xVal, [group1]: sum, [group2]: sum, ... }
    const grouped = new Map<string, Map<string, number>>();
    for (const row of rows) {
      const x = String(row[xColumn] ?? "");
      const g = String(row[groupBy] ?? "");
      const y = Number(row[yColumn]) || 0;
      if (!grouped.has(x)) grouped.set(x, new Map());
      const inner = grouped.get(x)!;
      inner.set(g, (inner.get(g) ?? 0) + y);
    }

    return [...grouped.entries()]
      .slice(0, spec.type === "bar" ? 20 : Infinity)
      .map(([name, groups]) => {
        const point: ChartDataPoint = { name };
        for (const [g, v] of groups) {
          point[g] = Math.round(v * 100) / 100;
        }
        return point;
      });
  }

  // Simple: aggregate yColumn by xColumn
  const agg = new Map<string, number>();
  const counts = new Map<string, number>();
  for (const row of rows) {
    const x = String(row[xColumn] ?? "");
    const y = Number(row[yColumn]) || 0;
    agg.set(x, (agg.get(x) ?? 0) + y);
    counts.set(x, (counts.get(x) ?? 0) + 1);
  }

  let entries = [...agg.entries()].map(([name, total]) => ({
    name,
    [yColumn]: Math.round(total * 100) / 100,
  }));

  // Cap bar charts at 20 entries
  if (spec.type === "bar" && entries.length > 20) {
    entries = entries.sort((a, b) => (b[yColumn] as number) - (a[yColumn] as number)).slice(0, 20);
  }

  return entries;
}

function preparePieData(
  spec: ChartSpec,
  rows: Record<string, unknown>[],
): ChartDataPoint[] {
  const agg = new Map<string, number>();
  for (const row of rows) {
    const x = String(row[spec.xColumn] ?? "");
    const y = Number(row[spec.yColumn]) || 0;
    agg.set(x, (agg.get(x) ?? 0) + y);
  }

  let entries = [...agg.entries()].sort((a, b) => b[1] - a[1]);

  // Top 8 + "Other"
  if (entries.length > 8) {
    const top = entries.slice(0, 8);
    const otherSum = entries.slice(8).reduce((sum, [, v]) => sum + v, 0);
    entries = [...top, ["Other", otherSum]];
  }

  return entries.map(([name, value]) => ({
    name: String(name),
    value: Math.round(Number(value) * 100) / 100,
  }));
}

function prepareScatterData(
  spec: ChartSpec,
  rows: Record<string, unknown>[],
): ChartDataPoint[] {
  return rows
    .map((row) => {
      const x = Number(row[spec.xColumn]);
      const y = Number(row[spec.yColumn]);
      if (isNaN(x) || isNaN(y)) return null;
      return {
        name: String(row[spec.xColumn]),
        x: Math.round(x * 100) / 100,
        y: Math.round(y * 100) / 100,
      };
    })
    .filter(Boolean) as ChartDataPoint[];
}

/** Extract the unique group keys from prepared data (for grouped charts). */
export function getGroupKeys(
  data: ChartDataPoint[],
  yColumn: string,
): string[] {
  const keys = new Set<string>();
  for (const point of data) {
    for (const key of Object.keys(point)) {
      if (key !== "name" && key !== yColumn) keys.add(key);
    }
  }
  // If no extra keys found, the chart is ungrouped — use yColumn
  return keys.size > 0 ? [...keys] : [yColumn];
}
