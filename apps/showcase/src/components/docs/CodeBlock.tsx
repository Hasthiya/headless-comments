'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import ShikiHighlighter from 'react-shiki';

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** When true, removes border/rounded for embedding in CodeTabs */
  embedded?: boolean;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [code]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 px-2 py-1.5 rounded text-xs font-medium bg-background/80 text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-colors"
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function CodeBlock({ code, lang = 'tsx', embedded }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = resolvedTheme === 'dark' ? 'github-dark' : 'github-light';
  const baseCodeClass =
    'min-w-0 bg-muted/50 text-sm border-0 shadow-none [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-4 [&_pre]:font-mono [&_pre]:leading-relaxed [&_pre]:border-0 [&_pre]:shadow-none [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_*]:border-0';
  const containerClass = embedded
    ? baseCodeClass
    : `relative rounded-lg border-0 shadow-none ${baseCodeClass}`;

  const placeholderClass = embedded
    ? 'min-w-0 bg-muted/50 text-sm font-mono text-muted-foreground border-0 shadow-none py-4 px-4 whitespace-pre-wrap break-words'
    : 'relative min-w-0 rounded-lg bg-muted/50 text-sm font-mono text-muted-foreground border-0 shadow-none py-4 px-4 whitespace-pre-wrap break-words';

  const wrapperClass = embedded ? undefined : 'relative [&_.docs-code-block]:border-0 [&_.docs-code-block]:shadow-none';

  if (!mounted) {
    return (
      <div className={wrapperClass}>
        {!embedded && <CopyButton code={code} />}
        <pre className={`docs-code-block ${placeholderClass}`} data-lang={lang}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {!embedded && <CopyButton code={code} />}
      <div className={`docs-code-block ${containerClass}`}>
        <ShikiHighlighter
          language={lang}
          theme={theme}
          showLanguage={false}
          addDefaultStyles={false}
          className="!p-0 !bg-transparent !border-0 !ring-0 !outline-none min-h-0 [&_pre]:!border-0 [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words"
        >
          {code}
        </ShikiHighlighter>
      </div>
    </div>
  );
}
