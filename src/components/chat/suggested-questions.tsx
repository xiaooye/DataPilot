"use client";

import { Button } from "@/components/ui/button";

export function SuggestedQuestions({
  questions,
  onSelect,
}: {
  questions: string[];
  onSelect: (question: string) => void;
}) {
  if (questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {questions.map((q, i) => (
        <Button
          key={i}
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal py-1.5 text-left text-xs"
          onClick={() => onSelect(q)}
        >
          {q}
        </Button>
      ))}
    </div>
  );
}
