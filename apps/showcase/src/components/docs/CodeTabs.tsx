'use client';

import { useCallback, useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface Tab {
    label: string;
    code: string;
    lang?: string;
}

interface CodeTabsProps {
    tabs: Tab[];
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
            className="shrink-0 px-2 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-colors"
            aria-label={copied ? 'Copied' : 'Copy code'}
        >
            {copied ? 'Copied' : 'Copy'}
        </button>
    );
}

export function CodeTabs({ tabs }: CodeTabsProps) {
    const [active, setActive] = useState(0);
    const currentTab = tabs[active];

    return (
        <div className="rounded-lg overflow-hidden bg-muted/50">
            {/* Tab bar + Copy */}
            <div className="flex items-center justify-between bg-muted/50 border-b border-border/50">
                <div className="flex overflow-x-auto flex-nowrap scrollbar-thin [scrollbar-width:thin] min-h-[44px]">
                    {tabs.map((tab, i) => (
                        <button
                            key={tab.label}
                            onClick={() => setActive(i)}
                            className={`shrink-0 px-4 py-3 text-xs font-medium transition-colors duration-300 ease-heartbeat relative ${active === i
                                    ? 'text-foreground bg-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                        >
                            {tab.label}
                            {active === i && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </button>
                    ))}
                </div>
                {currentTab && <CopyButton code={currentTab.code} />}
            </div>
            {/* Code block — Shiki highlighted */}
            {currentTab && (
                <CodeBlock
                    code={currentTab.code}
                    lang={currentTab.lang ?? 'tsx'}
                    embedded
                />
            )}
        </div>
    );
}
