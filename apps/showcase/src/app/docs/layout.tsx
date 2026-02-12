import Link from 'next/link';
import { DocNav } from '@/components/docs/DocNav';

const docSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'api-components', label: 'Components' },
  { id: 'api-props', label: 'Props' },
  { id: 'api-hooks', label: 'Hooks' },
  { id: 'api-types', label: 'Types' },
  { id: 'api-core', label: 'Core Utilities' },
  { id: 'presets', label: 'Presets' },
  { id: 'customization', label: 'Customization' },
  { id: 'examples', label: 'Examples' },
  { id: 'live-demo', label: 'Live Demo' },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:underline"
          >
            Comment Section – Showcase
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to demo
          </Link>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden lg:block w-56 shrink-0 border-r border-border">
          <nav className="sticky top-[57px] py-6 pl-4 pr-2">
            <DocNav sections={docSections} />
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
