'use client';

import Link from 'next/link';
import { Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors"
          >
            Comment Section
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/yourusername/comment-section"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </header>
  );
}
