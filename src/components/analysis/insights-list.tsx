"use client";

import {
  TrendingUp,
  AlertTriangle,
  GitBranch,
  BarChart3,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types";

const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  trend: TrendingUp,
  outlier: AlertTriangle,
  correlation: GitBranch,
  distribution: BarChart3,
  quality: Shield,
};

const importanceDot: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-muted-foreground/40",
};

export function InsightsList({
  insights,
  loading,
}: {
  insights: Insight[];
  loading?: boolean;
}) {
  if (loading) return <InsightsSkeleton />;
  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Key Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = categoryIcon[insight.category] ?? BarChart3;
          return (
            <div key={i} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="flex-1 text-sm">{insight.text}</p>
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  importanceDot[insight.importance],
                )}
                title={`${insight.importance} importance`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
