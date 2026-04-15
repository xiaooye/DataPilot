import {
  BarChart3,
  Upload,
  Sparkles,
  MessageSquare,
  Zap,
  Shield,
  LineChart,
  Database,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DropZone } from "@/components/upload/drop-zone";
import { SampleData } from "@/components/upload/sample-data";
import { ApiKeyInput } from "@/components/settings/api-key-input";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag and drop any CSV or TSV file — up to 50 MB with instant client-side parsing",
  },
  {
    icon: Sparkles,
    title: "Analyze",
    description: "AI detects patterns, generates charts, identifies anomalies, and scores data quality",
  },
  {
    icon: MessageSquare,
    title: "Ask",
    description: "Chat with your data in plain English with real-time streaming responses",
  },
];

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Column type detection, statistical summaries, and AI-powered insights in seconds",
  },
  {
    icon: LineChart,
    title: "Auto-Generated Charts",
    description: "Bar, line, pie, and scatter charts recommended by AI based on your data structure",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Q&A",
    description: "Ask follow-up questions about your data with streaming Server-Sent Events",
  },
  {
    icon: Shield,
    title: "Data Quality Scoring",
    description: "Automatic anomaly detection, null analysis, and data quality grading",
  },
  {
    icon: Database,
    title: "Client-Side Parsing",
    description: "Your data never leaves the browser for parsing — privacy by architecture",
  },
  {
    icon: Layers,
    title: "Export Reports",
    description: "Download your full analysis as a structured Markdown report",
  },
];

const stats = [
  { value: "4", label: "Chart types", suffix: "" },
  { value: "50", label: "MB max file", suffix: "MB" },
  { value: "<2s", label: "Parse time", suffix: "" },
  { value: "SSE", label: "Streaming", suffix: "" },
];

export default function HomePage() {
  return (
    <div className="bg-grid bg-glow">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center pb-16 pt-20 text-center sm:pt-28">
          <div className="animate-fade-in-up mb-6 flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            AI-powered data analysis
          </div>

          <h1 className="animate-fade-in-up delay-100 mb-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Drop a CSV.{" "}
            <span className="text-gradient">Get instant insights.</span>
          </h1>

          <p className="animate-fade-in-up delay-200 mb-10 max-w-lg text-base text-muted-foreground sm:text-lg">
            Upload any spreadsheet and let AI analyze your data — generate
            charts, find patterns, and ask questions in plain English.
          </p>

          <div className="animate-fade-in-up delay-300 w-full max-w-xl">
            <DropZone />
          </div>

          {/* API key input */}
          <div className="animate-fade-in-up delay-400 mt-6 w-full max-w-xl">
            <ApiKeyInput />
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80}>
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
        <ScrollReveal>
          <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground">
            Three steps from raw data to actionable insights
          </p>
        </ScrollReveal>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-border sm:block" />

          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 120}>
              <div className="card-accent relative flex flex-col items-center rounded-xl border bg-card p-8 text-center">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-primary/20 bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {i + 1}
                </p>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────────── */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
          <ScrollReveal>
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Built for serious analysis
            </h2>
            <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground">
              Production-grade architecture with real-time streaming, type-safe
              state management, and privacy-first design
            </p>
          </ScrollReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 80}>
                <div className="card-accent group rounded-xl border bg-card p-6 transition-colors">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture showcase ────────────────────────────── */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
          <ScrollReveal>
            <h2 className="mb-3 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Architecture
            </h2>
            <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground">
              Clean separation of concerns with modern React patterns
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b bg-muted/30 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/60" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/60" />
                  <span className="h-3 w-3 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-muted-foreground">architecture.ts</span>
                </div>
              </div>
              <div className="p-6 font-mono text-xs leading-relaxed sm:text-sm sm:leading-relaxed">
                <div className="text-muted-foreground">{"// DataPilot — System Architecture"}</div>
                <div className="mt-3">
                  <span className="text-purple-500 dark:text-purple-400">const</span>{" "}
                  <span className="text-blue-600 dark:text-blue-400">stack</span>{" "}
                  <span className="text-muted-foreground">=</span>{" "}
                  <span className="text-muted-foreground">{"{"}</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">framework</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"Next.js 16 App Router"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">rendering</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"React 19 Server + Client Components"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">state</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"Zustand — single source of truth"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">streaming</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"Server-Sent Events (SSE)"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">parsing</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"Client-side Papa Parse + type detection"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">styling</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"Tailwind CSS v4 + shadcn/ui"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-emerald-600 dark:text-emerald-400">types</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-600 dark:text-amber-400">{'"TypeScript strict — zero any"'}</span>
                  <span className="text-muted-foreground">,</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{"}"}</span>
                  <span className="text-muted-foreground">;</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Architecture highlights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <ScrollReveal delay={200}>
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Data Flow
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  CSV → Papa Parse → Column type detection → Zustand store →
                  AI analysis API → Structured JSON → Recharts rendering
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Chat Streaming
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  User message → SSE POST → Token-by-token streaming →
                  Real-time UI updates → Inline chart generation
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="rounded-xl border bg-card p-5">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Type Safety
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Strict TypeScript from API response parsing to chart rendering.
                  Zod-style validation at system boundaries, zero runtime casts.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Sample data ──────────────────────────────────────── */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
          <ScrollReveal>
            <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Try with sample data
            </h2>
            <p className="mx-auto mb-10 max-w-sm text-center text-sm text-muted-foreground">
              No CSV handy? Explore with one of these curated datasets.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <SampleData />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
