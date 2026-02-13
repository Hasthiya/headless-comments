'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { codeToHtml } from 'shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** When true, removes border/rounded for embedding in CodeTabs */
  embedded?: boolean;
}

export function CodeBlock({ code, lang = 'tsx', embedded }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';

    codeToHtml(code, {
      lang,
      theme,
    })
      .then(setHtml)
      .catch(() => setHtml(null));
  }, [code, lang, resolvedTheme, mounted]);

  const containerClass = embedded
    ? 'overflow-x-auto bg-muted/50 p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:font-mono [&_pre]:leading-relaxed'
    : 'overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:font-mono [&_pre]:leading-relaxed';

  if (!mounted || !html) {
    return (
      <pre
        className={embedded ? 'overflow-x-auto bg-muted/50 p-4 text-sm font-mono text-muted-foreground' : 'overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm font-mono text-muted-foreground'}
        data-lang={lang}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className={containerClass}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
