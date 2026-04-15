import { BarChart3 } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            DataPilot
          </span>
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
