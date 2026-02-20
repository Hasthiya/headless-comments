'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Package, Menu, X, Github } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/docs', label: 'Docs' },
  { href: '/bring-your-own-ui', label: 'Bring Your Own UI' },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenChange = (open: boolean) => {
    setMobileMenuOpen(open);
    if (!open) {
      menuButtonRef.current?.focus();
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-display text-lg font-semibold text-foreground hover:text-foreground/80 transition-colors"
          >
            Headless Comments
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <a
            href="https://github.com/Hasthiya/headless-comments"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href="https://www.npmjs.com/package/@hasthiya_/headless-comments-react"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="npm"
          >
            <Package className="h-4 w-4" />
          </a>

          <Sheet open={mobileMenuOpen} onOpenChange={handleOpenChange}>
            <button
              ref={menuButtonRef}
              type="button"
              className="md:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-sheet"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <SheetContent
              id="mobile-nav-sheet"
              side="right"
              className="flex flex-col p-0 w-[min(100%,20rem)] sm:max-w-[20rem]"
              showCloseButton={false}
            >
              <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border h-14 px-4 shrink-0">
                <SheetTitle className="font-display text-lg font-semibold text-foreground">
                  Menu
                </SheetTitle>
                <button
                  type="button"
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetHeader>
              <div className="flex flex-col py-2 overflow-auto">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="min-h-[48px] px-5 flex items-center text-base text-foreground hover:bg-muted/80 active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    onClick={closeMobileMenu}
                  >
                    {label}
                  </Link>
                ))}
                <div className="min-h-[48px] px-5 flex items-center border-t border-border mt-2 pt-2">
                  <ThemeToggle />
                </div>
                <a
                  href="https://github.com/Hasthiya/headless-comments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 flex items-center gap-2 text-base text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={closeMobileMenu}
                >
                  <Github className="h-4 w-4 shrink-0" />
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/@hasthiya_/headless-comments-react"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 flex items-center gap-2 text-base text-muted-foreground hover:text-foreground hover:bg-muted/80 active:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                  onClick={closeMobileMenu}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  npm
                </a>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
