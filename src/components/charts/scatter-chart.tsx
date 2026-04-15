"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "@/lib/chart-spec";
import { CHART_COLORS } from "@/lib/chart-spec";

export function DataScatterChart({
  data,
  xLabel,
  yLabel,
}: {
  data: ChartDataPoint[];
  xLabel: string;
  yLabel: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="x"
          name={xLabel}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <YAxis
          dataKey="y"
          name={yLabel}
          tick={{ fontSize: 12 }}
          className="fill-muted-foreground"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--color-popover))",
            borderColor: "hsl(var(--color-border))",
            borderRadius: "0.5rem",
            fontSize: 12,
          }}
        />
        <Scatter
          data={data}
          fill={CHART_COLORS[0]}
          fillOpacity={0.6}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
