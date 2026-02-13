'use client';

import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface Tab {
    label: string;
    code: string;
    lang?: string;
}

interface CodeTabsProps {
    tabs: Tab[];
}

export function CodeTabs({ tabs }: CodeTabsProps) {
    const [active, setActive] = useState(0);
    const currentTab = tabs[active];

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            {/* Tab bar — horizontal scroll on narrow screens, 44px min touch target */}
            <div className="flex bg-muted/50 border-b border-border overflow-x-auto flex-nowrap scrollbar-thin [scrollbar-width:thin]">
                {tabs.map((tab, i) => (
                    <button
                        key={tab.label}
                        onClick={() => setActive(i)}
                        className={`min-h-[44px] shrink-0 px-4 py-3 text-xs font-medium transition-colors duration-300 ease-heartbeat relative ${active === i
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
