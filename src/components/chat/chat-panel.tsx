"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAnalysisStore } from "@/stores/analysis-store";
import { streamChat } from "@/lib/chat-client";
import { ChatMessageBubble } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { SuggestedQuestions } from "@/components/chat/suggested-questions";
import type { ChartSpec } from "@/types";

export function ChatPanel() {
  const store = useAnalysisStore();
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [store.messages, streamText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!store.summary || isStreaming) return;

      const userMsg = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content: text,
        timestamp: Date.now(),
      };
      store.addMessage(userMsg);

      // Add placeholder assistant message
      const assistantMsg = {
        id: crypto.randomUUID(),
        role: "assistant" as const,
        content: "",
        timestamp: Date.now(),
      };
      store.addMessage(assistantMsg);

      setIsStreaming(true);
      setStreamText("");

      let accumulated = "";

      const conversationHistory = [...store.messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      abortRef.current = streamChat(
        {
          messages: conversationHistory,
          columns: store.columns,
          summary: store.summary,
        },
        {
          onTextDelta(delta) {
            accumulated += delta;
            setStreamText(accumulated);
            store.updateLastMessage(accumulated);
          },
          onToolUse(name, input) {
            if (name === "suggest_charts" && input.charts) {
              for (const chart of input.charts as ChartSpec[]) {
                store.addChartToLastMessage(chart);
              }
            }
          },
          onDone() {
            setIsStreaming(false);
            setStreamText("");
          },
          onError(message) {
            store.updateLastMessage(
              accumulated + `\n\n*Error: ${message}*`,
            );
            setIsStreaming(false);
            setStreamText("");
          },
        },
      );
    },
    [store, isStreaming],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamText("");
  }, []);

  const userMessageCount = store.messages.filter(
    (m) => m.role === "user",
  ).length;
  const showSuggestions =
    userMessageCount < 2 && store.suggestedQuestions.length > 0;

  const isReady = store.status === "ready";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Chat with your data</h3>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {store.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">
              {isReady
                ? "Ask a question about your data"
                : "Waiting for analysis to complete..."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {store.messages.map((msg, i) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                data={store.rawData}
                isStreaming={
                  isStreaming && i === store.messages.length - 1
                }
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Suggested questions */}
      {showSuggestions && (
        <div className="border-t px-4 py-3">
          <SuggestedQuestions
            questions={store.suggestedQuestions}
            onSelect={sendMessage}
          />
        </div>
      )}

      {/* Input */}
      <div className="border-t px-4 py-3">
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
          disabled={!isReady}
        />
      </div>
    </div>
  );
}
