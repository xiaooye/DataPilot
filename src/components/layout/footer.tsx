import { BarChart3, ExternalLink } from "lucide-react";

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Zustand",
  "Recharts",
  "Streaming SSE",
];

const showcases = [
  { name: "Resume", href: "https://wei-dev.com" },
  { name: "WebStore", href: "https://store.wei-dev.com" },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <span className="font-semibold tracking-tight">DataPilot</span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI-powered data analysis. Upload a CSV and get instant insights,
              auto-generated charts, and natural-language Q&A.
            </p>
            {/* Other showcases */}
            <div className="flex items-center gap-3 pt-1">
              {showcases.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Architecture */}
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Built with
            </p>
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t pt-6 text-xs text-muted-foreground">
          <span>
            Designed & built by{" "}
            <a
              href="https://wei-dev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline-offset-2 hover:underline"
            >
              Wei
            </a>
          </span>
          <span>Powered by AI &middot; OpenRouter</span>
        </div>
      </div>
    </footer>
  );
}
