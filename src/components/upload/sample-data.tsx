"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { parseCSV } from "@/lib/csv-parser";
import { useAnalysisStore } from "@/stores/analysis-store";

const samples = [
  {
    title: "Sales Data",
    file: "/samples/sales-data.csv",
    rows: 500,
    desc: "E-commerce sales across regions and categories",
  },
  {
    title: "Employee Survey",
    file: "/samples/employee-survey.csv",
    rows: 200,
    desc: "Employee satisfaction and engagement data",
  },
  {
    title: "Website Traffic",
    file: "/samples/website-traffic.csv",
    rows: 365,
    desc: "Daily website metrics and conversions",
  },
];

export function SampleData() {
  const [loading, setLoading] = useState<string | null>(null);
  const { setDataset, setStatus } = useAnalysisStore();
  const router = useRouter();

  const handleClick = async (sample: (typeof samples)[0]) => {
    setLoading(sample.file);
    try {
      const response = await fetch(sample.file);
      const blob = await response.blob();
      const file = new File([blob], sample.file.split("/").pop()!, {
        type: "text/csv",
      });
      const dataset = await parseCSV(file);
      setDataset(dataset);
      setStatus("parsing");
      router.push("/analyze");
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {samples.map((sample) => (
        <button
          key={sample.title}
          className="group rounded-xl border bg-card p-5 text-left transition-colors hover:border-primary/50 hover:bg-muted/50 disabled:opacity-50"
          onClick={() => handleClick(sample)}
          disabled={loading !== null}
        >
          <div className="mb-2 flex items-center gap-2">
            {loading === sample.file ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-primary" />
            )}
            <h3 className="text-sm font-semibold">{sample.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">{sample.desc}</p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {sample.rows} rows
          </p>
        </button>
      ))}
    </div>
  );
}
