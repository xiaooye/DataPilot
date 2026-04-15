import { BarChart3, Upload, Sparkles, MessageSquare } from "lucide-react";
import { DropZone } from "@/components/upload/drop-zone";
import { SampleData } from "@/components/upload/sample-data";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop your CSV file",
  },
  {
    icon: Sparkles,
    title: "Analyze",
    description: "AI detects patterns, generates charts, flags issues",
  },
  {
    icon: MessageSquare,
    title: "Ask",
    description: "Chat with your data in plain English",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="flex flex-col items-center pb-16 pt-20 text-center sm:pt-28">
        <div className="mb-4 flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          AI-powered data analysis
        </div>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Drop a CSV.{" "}
          <span className="text-primary">Get instant insights.</span>
        </h1>
        <p className="mb-10 max-w-lg text-base text-muted-foreground sm:text-lg">
          Upload any spreadsheet and let AI analyze your data — generate charts,
          find patterns, and ask questions in plain English.
        </p>
        <div className="w-full max-w-xl">
          <DropZone />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t pb-20 pt-16">
        <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
          How it works
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Step {i + 1}
              </p>
              <h3 className="mb-1 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample data placeholder */}
      <section className="border-t pb-20 pt-16">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          Try with sample data
        </h2>
        <p className="mb-10 text-center text-sm text-muted-foreground">
          No CSV handy? Try one of these sample datasets.
        </p>
        <SampleData />
      </section>
    </div>
  );
}
