"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/stores/analysis-store";
import { generateMarkdownReport, downloadMarkdown } from "@/lib/export";

export function ExportButton() {
  const { summary, insights, anomalies, charts, messages, fileName } =
    useAnalysisStore();

  const handleExport = () => {
    const report = generateMarkdownReport(
      summary,
      insights,
      anomalies,
      charts,
      messages,
    );
    const exportName = fileName.replace(/\.\w+$/, "") + "-analysis.md";
    downloadMarkdown(report, exportName);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="shrink-0 gap-2 transition-colors"
    >
      <Download className="h-4 w-4" />
      Export Report
    </Button>
  );
}
