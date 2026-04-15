"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { parseCSV } from "@/lib/csv-parser";
import { useAnalysisStore } from "@/stores/analysis-store";
import { formatBytes } from "@/lib/data-utils";
import { cn } from "@/lib/utils";

type DropState = "idle" | "dragover" | "parsing" | "error";

export function DropZone() {
  const [state, setState] = useState<DropState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setDataset, setStatus } = useAnalysisStore();

  const handleFile = useCallback(
    async (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext !== "csv" && ext !== "tsv") {
        setState("error");
        setErrorMsg("Please upload a .csv or .tsv file.");
        return;
      }

      setState("parsing");
      try {
        const dataset = await parseCSV(file);
        setDataset(dataset);
        setStatus("parsing");
        router.push("/analyze");
      } catch (err) {
        setState("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Failed to parse file.",
        );
      }
    },
    [setDataset, setStatus, router],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState("dragover");
  }, []);

  const onDragLeave = useCallback(() => setState("idle"), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "card-accent relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-200 cursor-pointer",
        state === "idle" && "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
        state === "dragover" && "border-primary bg-primary/5 scale-[1.01]",
        state === "error" && "border-destructive bg-destructive/5",
        state === "parsing" && "border-primary/50 bg-muted/30 pointer-events-none",
      )}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      aria-label="Upload CSV file"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv"
        className="hidden"
        onChange={onInputChange}
      />

      {state === "parsing" ? (
        <>
          <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium">Parsing your data...</p>
        </>
      ) : (
        <>
          <div
            className={cn(
              "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
              state === "dragover"
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {state === "dragover" ? (
              <FileSpreadsheet className="h-7 w-7" />
            ) : (
              <Upload className="h-7 w-7" />
            )}
          </div>
          <p className="mb-1 text-sm font-medium">
            {state === "dragover"
              ? "Drop your file here"
              : "Drag & drop your CSV file here"}
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse &middot; CSV / TSV up to{" "}
            {formatBytes(50 * 1024 * 1024)}
          </p>
          {state === "error" && (
            <p className="mt-3 text-sm text-destructive">{errorMsg}</p>
          )}
        </>
      )}
    </div>
  );
}
