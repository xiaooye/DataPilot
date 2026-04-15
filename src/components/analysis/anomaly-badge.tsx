"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Anomaly } from "@/types";

const severityStyle: Record<string, string> = {
  error: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  warning:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

export function AnomalyBadges({ anomalies }: { anomalies: Anomaly[] }) {
  if (anomalies.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        No data quality issues found
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {anomalies.map((a, i) => (
        <Badge key={i} variant="outline" className={severityStyle[a.severity]}>
          {a.column}: {a.issue}
          {a.affectedRows !== undefined && ` (${a.affectedRows} rows)`}
        </Badge>
      ))}
    </div>
  );
}
