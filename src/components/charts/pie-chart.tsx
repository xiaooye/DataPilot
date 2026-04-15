"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { ChartDataPoint } from "@/lib/chart-spec";
import { CHART_COLORS } from "@/lib/chart-spec";

export function DataPieChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          label={(props: PieLabelRenderProps) =>
            `${String(props.name ?? "")} ${(((props.percent as number | undefined) ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--color-popover))",
            borderColor: "hsl(var(--color-border))",
            borderRadius: "0.5rem",
            fontSize: 12,
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
