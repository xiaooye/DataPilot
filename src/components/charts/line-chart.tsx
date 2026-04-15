"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-spec";
import { CHART_COLORS, getGroupKeys } from "@/lib/chart-spec";

export function DataLineChart({
  data,
  yColumn,
}: {
  data: ChartDataPoint[];
  yColumn: string;
}) {
  const keys = getGroupKeys(data, yColumn);
  const showDots = data.length < 50;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            dot={showDots}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
