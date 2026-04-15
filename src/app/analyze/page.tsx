"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, RefreshCw, ArrowLeft } from "lucide-react";
import { useAnalysisStore } from "@/stores/analysis-store";
import { apiHeaders } from "@/stores/api-key-store";
import { getSampleRows } from "@/lib/csv-parser";
import { FilePreview } from "@/components/upload/file-preview";
import { SummaryCard } from "@/components/analysis/summary-card";
import { InsightsList } from "@/components/analysis/insights-list";
import { AnomalyBadges } from "@/components/analysis/anomaly-badge";
import { DataTable } from "@/components/analysis/data-table";
import { ChartPanel } from "@/components/analysis/chart-panel";
import { AnalysisSkeleton } from "@/components/analysis/analysis-skeleton";
import { ExportButton } from "@/components/analysis/export-button";
import { ChatPanel } from "@/components/chat/chat-panel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AnalyzePage() {
  const router = useRouter();
  const store = useAnalysisStore();
  const analyzedRef = useRef(false);

  const runAnalysis = useCallback(async () => {
    if (!store.columns.length) return;

    store.setStatus("analyzing");
    store.setError(null);

    try {
      const sampleRows = getSampleRows(store.rawData);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: apiHeaders(),
        body: JSON.stringify({
          columns: store.columns,
          sampleRows,
          rowCount: store.rowCount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Analysis failed (${res.status})`);
      }

      const result = await res.json();
      store.setAnalysis(result);

      // Fire suggested questions in the background
      if (result.summary && result.insights?.length) {
        fetch("/api/analyze/suggest-questions", {
          method: "POST",
          headers: apiHeaders(),
          body: JSON.stringify({
            columns: store.columns,
            summary: result.summary,
            insights: result.insights,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.questions?.length) {
              store.setSuggestedQuestions(data.questions);
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      store.setError(
        err instanceof Error ? err.message : "Analysis failed.",
      );
    }
  }, [store]);

  // Redirect if no data
  useEffect(() => {
    if (!store.fileName) {
      router.replace("/");
    }
  }, [store.fileName, router]);

  // Auto-run analysis on first mount
  useEffect(() => {
    if (
      store.fileName &&
      store.status === "parsing" &&
      !analyzedRef.current
    ) {
      analyzedRef.current = true;
      runAnalysis();
    }
  }, [store.fileName, store.status, runAnalysis]);

  if (!store.fileName) return null;

  const isAnalyzing = store.status === "analyzing";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      {/* File info + actions */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => {
              store.reset();
              router.push("/");
            }}
            aria-label="Back to upload"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <FilePreview />
          </div>
        </div>
        {store.status === "ready" && <ExportButton />}
      </div>

      {/* Error state */}
      {store.status === "error" && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="mb-3 text-sm text-destructive">
            {store.error ?? "Something went wrong."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              analyzedRef.current = false;
              store.setStatus("parsing");
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Analysis workspace — 60/40 split on desktop */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left panel: analysis results */}
        <div className="space-y-6">
          {isAnalyzing ? (
            <AnalysisSkeleton />
          ) : (
            <>
              <SummaryCard summary={store.summary} />
              <InsightsList insights={store.insights} />
              {store.anomalies.length > 0 && (
                <div className="card-accent rounded-xl border bg-card p-5">
                  <h3 className="mb-3 text-sm font-semibold">
                    Data Quality
                  </h3>
                  <AnomalyBadges anomalies={store.anomalies} />
                </div>
              )}
              <ChartPanel charts={store.charts} data={store.rawData} />
              <DataTable rows={store.rawData} columns={store.columns} />
            </>
          )}
        </div>

        {/* Right panel: chat (desktop only) */}
        <div className="hidden h-[calc(100vh-10rem)] overflow-hidden rounded-xl border bg-card lg:block">
          <ChatPanel />
        </div>
      </div>

      {/* Mobile chat FAB + bottom sheet */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0">
            <SheetTitle className="sr-only">Chat with your data</SheetTitle>
            <ChatPanel />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
