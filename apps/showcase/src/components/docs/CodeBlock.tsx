interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = 'tsx' }: CodeBlockProps) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm font-mono"
      data-lang={lang}
    >
      <code>{code}</code>
    </pre>
  );
}
