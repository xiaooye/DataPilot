"use client";

import { useRef } from "react";
import { Send, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
}: {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value.trim();
    if (!value || isStreaming) return;
    onSend(value);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="Ask about your data..."
        disabled={disabled || isStreaming}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        className="flex-1"
        autoFocus
      />
      {isStreaming ? (
        <Button
          variant="outline"
          size="icon"
          onClick={onStop}
          aria-label="Stop streaming"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={disabled}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
