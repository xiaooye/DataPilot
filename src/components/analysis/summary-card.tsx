"use client";

import { Rows3, Columns3, Calendar, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/data-utils";
import type { Summary } from "@/types";

const qualityColor: Record<string, string> = {
  excellent: "bg-green-500/15 text-green-700 dark:text-green-400",
  good: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  fair: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  poor: "bg-red-500/15 text-red-700 dark:text-red-400",
};

export function SummaryCard({ summary }: { summary: Summary | null }) {
  if (!summary) return <SummarySkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{summary.title}</CardTitle>
        <CardDescription>{summary.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat icon={Rows3} label="Rows" value={formatNumber(summary.rowCount)} />
          <Stat
            icon={Columns3}
            label="Columns"
            value={String(summary.columnCount)}
          />
          {summary.timeRange && (
            <Stat icon={Calendar} label="Time Range" value={summary.timeRange} />
          )}
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Quality</p>
              <Badge
                variant="secondary"
                className={qualityColor[summary.dataQuality]}
              >
                {summary.dataQuality}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
