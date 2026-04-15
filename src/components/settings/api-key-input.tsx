"use client";

import { useEffect, useRef, useState } from "react";
import { Key, Check, X, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiKeyStore } from "@/stores/api-key-store";
import { cn } from "@/lib/utils";

export function ApiKeyInput() {
  const { apiKey, setApiKey, clearApiKey } = useApiKeyStore();
  const [value, setValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setValue(useApiKeyStore.getState().apiKey);
    setMounted(true);
  }, []);

  // Sync external changes
  useEffect(() => {
    if (mounted) setValue(apiKey);
  }, [apiKey, mounted]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed) {
      setApiKey(trimmed);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  const hasKey = mounted && apiKey.length > 0;
  const isDirty = mounted && value.trim() !== apiKey;

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">API Key</h3>
        </div>
        {hasKey && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            Using your key
          </span>
        )}
      </div>

      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
        Enter your{" "}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary underline-offset-2 hover:underline"
        >
          OpenRouter API key
          <ExternalLink className="h-3 w-3" />
        </a>{" "}
        to avoid rate limits. Your key is stored locally and never sent to our servers.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type={showKey ? "text" : "password"}
            value={mounted ? value : ""}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="sk-or-v1-..."
            className={cn(
              "h-9 w-full rounded-lg border bg-background px-3 pr-9 font-mono text-xs transition-colors",
              "placeholder:text-muted-foreground/40",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            )}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground"
            tabIndex={-1}
            aria-label={showKey ? "Hide key" : "Show key"}
          >
            {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>

        {hasKey && !isDirty ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="h-9 gap-1.5 text-xs"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!value.trim() || !isDirty}
            className="h-9 gap-1.5 text-xs"
          >
            <Check className="h-3 w-3" />
            Save
          </Button>
        )}
      </div>

      {!hasKey && (
        <p className="mt-2.5 text-xs text-muted-foreground/60">
          Without a key, the free tier will be used (rate limited).
        </p>
      )}
    </div>
  );
}
