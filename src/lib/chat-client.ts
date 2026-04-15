import type { ColumnMeta, Summary } from "@/types";

interface StreamCallbacks {
  onTextDelta: (text: string) => void;
  onDone: () => void;
  onError: (message: string) => void;
}

export function streamChat(
  params: {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
    columns: ColumnMeta[];
    summary: Summary;
  },
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        callbacks.onError(data.error ?? `Chat failed (${response.status})`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        callbacks.onError("No response body");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6);

          try {
            const event = JSON.parse(json);
            switch (event.type) {
              case "text_delta":
                callbacks.onTextDelta(event.content);
                break;
              case "done":
                callbacks.onDone();
                return;
              case "error":
                callbacks.onError(event.message);
                return;
            }
          } catch {
            // Skip malformed events
          }
        }
      }

      callbacks.onDone();
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      callbacks.onError(
        err instanceof Error ? err.message : "Stream failed",
      );
    }
  })();

  return controller;
}
