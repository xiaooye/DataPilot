"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-6 text-muted-foreground">
        An unexpected error occurred.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
