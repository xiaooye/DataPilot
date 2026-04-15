"use client";

import { FileSpreadsheet } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysis-store";
import { formatBytes, formatNumber } from "@/lib/data-utils";

export function FilePreview() {
  const { fileName, fileSize, rowCount, columns } = useAnalysisStore();

  if (!fileName) return null;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
      <FileSpreadsheet className="h-5 w-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{fileName}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(fileSize)} &middot; {formatNumber(rowCount)} rows &middot;{" "}
          {columns.length} columns
        </p>
      </div>
    </div>
  );
}
