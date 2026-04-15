"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export function DemoBadge() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-medium shadow-lg transition-colors hover:bg-muted"
      >
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Portfolio Demo
        {expanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronUp className="h-3 w-3" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 w-64 rounded-xl border bg-card p-4 shadow-lg">
          <h4 className="mb-2 text-xs font-semibold">DataPilot</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            AI data analysis showcase demonstrating LLM API integration,
            streaming, and tool use via OpenRouter.
          </p>
          <div className="mb-3 space-y-1 text-xs text-muted-foreground">
            <p>Next.js &middot; Tailwind &middot; shadcn/ui</p>
            <p>OpenRouter AI &middot; Recharts &middot; Zustand</p>
          </div>
          <div className="flex gap-2">
            <a
              href="https://github.com/xiaooye"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://wei-dev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Portfolio <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
