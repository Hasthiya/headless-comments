/**
 * Inline SVG icons — no external icon library needed.
 * Each icon is a tiny React component rendering an inline SVG.
 * @module @headless-comments/react/presets/styled/icons
 */

import React from 'react';

const svgProps: React.SVGProps<SVGSVGElement> = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

export const IconReply = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    </span>
);

export const IconEdit = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    </span>
);

export const IconTrash = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    </span>
);

export const IconShare = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
            <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
        </svg>
    </span>
);

export const IconMore = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
        </svg>
    </span>
);

export const IconFlag = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
    </span>
);

export const IconLink = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    </span>
);

export const IconChevronDown = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="m6 9 6 6 6-6" />
        </svg>
    </span>
);

export const IconChevronRight = () => (
    <span className="cs-icon">
        <svg {...svgProps}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    </span>
);
