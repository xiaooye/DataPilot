"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Loader2, ShoppingCart, Users, Globe } from "lucide-react";
import { parseCSV } from "@/lib/csv-parser";
import { useAnalysisStore } from "@/stores/analysis-store";

const samples = [
  {
    title: "Sales Data",
    file: "/samples/sales-data.csv",
    rows: 500,
    desc: "E-commerce sales across regions and categories",
    icon: ShoppingCart,
  },
  {
    title: "Employee Survey",
    file: "/samples/employee-survey.csv",
    rows: 200,
    desc: "Employee satisfaction and engagement data",
    icon: Users,
  },
  {
    title: "Website Traffic",
    file: "/samples/website-traffic.csv",
    rows: 365,
    desc: "Daily website metrics and conversions",
    icon: Globe,
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
          className="card-accent group rounded-xl border bg-card p-6 text-left transition-colors hover:bg-muted/30 disabled:opacity-50"
          onClick={() => handleClick(sample)}
          disabled={loading !== null}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
              {loading === sample.file ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <sample.icon className="h-4 w-4" />
              )}
            </div>
            <h3 className="text-sm font-semibold">{sample.title}</h3>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{sample.desc}</p>
          <div className="mt-3 flex items-center gap-2">
            <FileSpreadsheet className="h-3 w-3 text-muted-foreground/60" />
            <p className="text-xs font-medium text-muted-foreground">
              {sample.rows} rows
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
