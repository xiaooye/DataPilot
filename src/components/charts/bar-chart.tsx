"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-spec";
import { CHART_COLORS, getGroupKeys } from "@/lib/chart-spec";

export function DataBarChart({
  data,
  yColumn,
}: {
  data: ChartDataPoint[];
  yColumn: string;
}) {
  const keys = getGroupKeys(data, yColumn);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--color-popover))",
            borderColor: "hsl(var(--color-border))",
            borderRadius: "0.5rem",
            fontSize: 12,
          }}
        />
        {keys.length > 1 && <Legend />}
        {keys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
