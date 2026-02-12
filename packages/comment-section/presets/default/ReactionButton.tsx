/**
 * ReactionButton component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ReactionButton
 */

'use client';

import React from 'react';
import type { ReactionButtonProps } from '../../headless/types';
import { useCommentSection } from '../../headless/useComments';

/**
 * ReactionButton component displays a reaction button with emoji and count
 */
export const ReactionButton: React.FC<ReactionButtonProps> = ({
    reaction,
    isActive = false,
    onClick,
    showCount = true,
    className = '',
    theme: customTheme,
    disabled = false,
    size = 'md',
}) => {
    const { theme: contextTheme } = useCommentSection();
    const theme = customTheme || contextTheme;

    // Size mapping
    const sizeMap = {
        sm: { padding: '4px 8px', fontSize: '12px', gap: '4px' },
        md: { padding: '6px 10px', fontSize: '13px', gap: '6px' },
        lg: { padding: '8px 12px', fontSize: '14px', gap: '8px' },
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

    const buttonStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeMap[size].gap,
        padding: sizeMap[size].padding,
        fontSize: sizeMap[size].fontSize,
        fontFamily: theme.fontFamily,
        borderRadius: theme.borderRadius,
        border: '1px solid transparent',
        backgroundColor: isActive ? `${theme.primaryColor}15` : 'transparent',
        color: isActive ? theme.primaryColor : theme.secondaryTextColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: `all ${theme.animationDuration} ease`,
        outline: 'none',
        userSelect: 'none',
    };

    const countStyle: React.CSSProperties = {
        fontWeight: isActive ? 600 : 400,
        minWidth: '16px',
        textAlign: 'center',
    };

    return (
        <button
            type="button"
            className={`cs-reaction-button ${isActive ? 'cs-reaction-active' : ''} ${className}`}
            style={buttonStyle}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`${reaction.label}${showCount ? ` (${reaction.count})` : ''}`}
        >
            <span className="cs-reaction-emoji" style={{ fontSize: '1em' }}>
                {reaction.emoji}
            </span>
            {showCount && reaction.count > 0 && (
                <span className="cs-reaction-count" style={countStyle}>
                    {reaction.count}
                </span>
            )}
        </button>
    );
};

ReactionButton.displayName = 'ReactionButton';

export default ReactionButton;
