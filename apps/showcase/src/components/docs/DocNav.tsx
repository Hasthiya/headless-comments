'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Section {
  id: string;
  label: string;
  href?: string;
}

interface DocNavProps {
  sections: Section[];
}

export function DocNav({ sections }: DocNavProps) {
  const pathname = usePathname();
  const isMainDocs = pathname === '/docs';

  return (
    <ul className="space-y-1 text-sm">
      <li className="font-medium text-muted-foreground mb-2">On this page</li>
      {sections.map(({ id, label, href }) => {
        const linkHref = href ?? (isMainDocs ? `#${id}` : `/docs#${id}`);
        return (
          <li key={id}>
            <Link
              href={linkHref}
              className="block min-h-[44px] py-2 px-2 flex items-center text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors duration-300 ease-heartbeat"
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
