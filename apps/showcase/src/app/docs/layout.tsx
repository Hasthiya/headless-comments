import { DocNav } from '@/components/docs/DocNav';
import { DocNavMobile } from '@/components/docs/DocNavMobile';

const docSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'demo-headless', label: '▸ Demo: Headless' },
  { id: 'demo-shadcn', label: '▸ Demo: ShadCN' },
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
    <div className="flex flex-1 justify-center w-full">
      <div className="flex w-full max-w-6xl flex-1">
        <aside className="hidden lg:block w-56 shrink-0 border-r border-border">
          <nav className="sticky top-[3.5rem] py-6 pl-4 pr-2">
            <DocNav sections={docSections} />
          </nav>
        </aside>
        <main className="flex-1 min-w-0">
          <DocNavMobile sections={docSections} />
          {children}
        </main>
      </div>
    </div>
  );
}
