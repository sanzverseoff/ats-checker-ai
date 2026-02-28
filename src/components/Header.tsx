import { ThemeToggle } from "./ThemeToggle";
import { FileSearchIcon } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSearchIcon className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">ATS Checker AI</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
