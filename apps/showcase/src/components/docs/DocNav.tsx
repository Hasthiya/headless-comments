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
            className="block min-h-[44px] py-2 px-2 flex items-center text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors duration-300 ease-heartbeat"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
