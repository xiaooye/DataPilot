"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AutoChart } from "@/components/charts/auto-chart";
import type { ChartSpec } from "@/types";

export function ChartPanel({
  charts,
  data,
  loading,
}: {
  charts: ChartSpec[];
  data: Record<string, unknown>[];
  loading?: boolean;
}) {
  if (loading) return <ChartsSkeleton />;

  if (charts.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
        No charts suggested for this dataset.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {charts.map((spec, i) => (
        <AutoChart key={`${spec.title}-${i}`} spec={spec} data={data} />
      ))}
    </div>
  );
}

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
