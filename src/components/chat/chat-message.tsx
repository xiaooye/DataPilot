"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { AutoChart } from "@/components/charts/auto-chart";
import type { ChatMessage } from "@/types";

export function ChatMessageBubble({
  message,
  data,
  isStreaming,
}: {
  message: ChatMessage;
  data: Record<string, unknown>[];
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
            {isStreaming && !message.content && (
              <span className="inline-block h-4 w-1.5 animate-pulse bg-foreground/50" />
            )}
          </div>
        )}

        {/* Inline charts from tool_use */}
        {message.charts?.map((spec, i) => (
          <div key={i} className="mt-3">
            <AutoChart spec={spec} data={data} />
          </div>
        ))}
      </div>
    </div>
  );
}
