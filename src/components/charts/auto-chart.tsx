"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prepareChartData } from "@/lib/chart-spec";
import { DataBarChart } from "@/components/charts/bar-chart";
import { DataLineChart } from "@/components/charts/line-chart";
import { DataPieChart } from "@/components/charts/pie-chart";
import { DataScatterChart } from "@/components/charts/scatter-chart";
import type { ChartSpec } from "@/types";

export function AutoChart({
  spec,
  data,
}: {
  spec: ChartSpec;
  data: Record<string, unknown>[];
}) {
  const chartData = prepareChartData(spec, data);

  if (chartData.length === 0) return null;

  return (
    <Card className="card-accent overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{spec.title}</CardTitle>
        {spec.description && (
          <CardDescription className="text-xs">
            {spec.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted/20 p-2">
          {spec.type === "bar" && (
            <DataBarChart data={chartData} yColumn={spec.yColumn} />
          )}
          {spec.type === "line" && (
            <DataLineChart data={chartData} yColumn={spec.yColumn} />
          )}
          {spec.type === "pie" && <DataPieChart data={chartData} />}
          {spec.type === "scatter" && (
            <DataScatterChart
              data={chartData}
              xLabel={spec.xColumn}
              yLabel={spec.yColumn}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
