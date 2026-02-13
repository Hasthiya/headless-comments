import { DocNav } from '@/components/docs/DocNav';
import { DocNavMobile } from '@/components/docs/DocNavMobile';

const docSections = [
  { id: 'installation', label: 'Installation' },
  { id: 'basic-example', label: 'Basic Example' },
  { id: 'styling', label: 'Styling' },
  { id: 'examples', label: 'Examples' },
  { id: 'components', label: 'Components' },
  { id: 'component-api', label: 'Component API' },
  { id: 'styled-example', label: 'Styled Example' },
  { id: 'styled-components', label: 'Styled Components', href: '/docs/styled-components' },
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
