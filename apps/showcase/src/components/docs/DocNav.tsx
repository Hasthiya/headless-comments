'use client';

interface Section {
  id: string;
  label: string;
}

interface DocNavProps {
  sections: Section[];
}

export function DocNav({ sections }: DocNavProps) {
  return (
    <ul className="space-y-1 text-sm">
      <li className="font-medium text-muted-foreground mb-2">On this page</li>
      {sections.map(({ id, label }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            className="block py-1 text-muted-foreground hover:text-foreground rounded px-2 hover:bg-muted"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
