/**
 * ReactionButton component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ReactionButton
 */

'use client';

import React from 'react';
import type { ReactionButtonProps } from '../../headless/types';
import { useCommentSection } from '../../headless/useComments';
import { cn } from '../../core/utils';

/**
 * ShadcnReactionButton component displays a reaction button with emoji and count
 */
export const ShadcnReactionButton: React.FC<ReactionButtonProps> = ({
    reaction,
    isActive = false,
    onClick,
    showCount = true,
    className = '',
    theme: _customTheme,
    disabled = false,
    size = 'md',
}) => {
    const { theme: _contextTheme } = useCommentSection();

    // Size mapping for Tailwind classes
    const sizeClasses = {
        sm: "h-6 px-2 text-xs gap-1",
        md: "h-7 px-2.5 text-xs gap-1.5",
        lg: "h-8 px-3 text-sm gap-2",
    };

    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <button
            type="button"
            className={cn(
                "inline-flex items-center justify-center rounded-full border border-transparent transition-transform duration-150 ease-[cubic-bezier(0.77,0,0.175,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "active:scale-90 hover:scale-105",
                sizeClasses[size],
                isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                className
            )}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`${reaction.label}${showCount ? ` (${reaction.count})` : ''}`}
        >
            <span className="emoji leading-none" style={{ fontSize: '1.1em' }}>
                {reaction.emoji}
            </span>
            {showCount && reaction.count > 0 && (
                <span className={cn(
                    "font-medium tabular-nums",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}>
                    {reaction.count}
                </span>
            )}
        </button>
    );
};

ShadcnReactionButton.displayName = 'ShadcnReactionButton';

export default ShadcnReactionButton;
