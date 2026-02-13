'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Section {
  id: string;
  label: string;
  href?: string;
}

interface DocNavMobileProps {
  sections: Section[];
}

export function DocNavMobile({ sections }: DocNavMobileProps) {
  const pathname = usePathname();
  const isMainDocs = pathname === '/docs';
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, close]);

  return (
    <>
      {/* Sticky trigger — only on viewports where sidebar is hidden */}
      <div className="lg:hidden sticky top-14 z-30 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-8">
        <button
          type="button"
          className="w-full min-h-[44px] flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring rounded-md"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Open table of contents"
        >
          <List className="h-4 w-4 shrink-0" aria-hidden />
          On this page
        </button>
      </div>

      {/* Overlay + sheet */}
      <div
        className={cn('fixed inset-0 z-40 lg:hidden', open ? 'visible' : 'invisible')}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-200"
          style={{ opacity: open ? 1 : 0 }}
          onClick={close}
          aria-label="Close"
        />
        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-full max-w-xs bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-200 ease-heartbeat',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
            <span className="font-medium text-foreground">On this page</span>
            <button
              type="button"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={close}
              aria-label="Close"
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
          <nav className="flex-1 overflow-auto py-4" aria-label="Page sections">
            <ul className="space-y-0">
              {sections.map(({ id, label, href }) => {
                const linkHref = href ?? (isMainDocs ? `#${id}` : `/docs#${id}`);
                return (
                  <li key={id}>
                    <Link
                      href={linkHref}
                      className="min-h-[44px] px-6 flex items-center text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      onClick={close}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
