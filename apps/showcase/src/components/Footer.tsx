import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <Link
            href="/docs"
            className="hover:text-foreground transition-colors duration-300 ease-heartbeat underline-offset-4 hover:underline"
          >
            Documentation
          </Link>
          <a
            href="https://github.com/yourusername/comment-section"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300 ease-heartbeat underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          <span className="font-mono text-xs">@hasthiya_/headless-comments-react</span>
        </div>
      </div>
    </footer>
  );
}

