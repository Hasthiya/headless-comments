/**
 * ActionBar component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ActionBar
 */

'use client';

import React, { useState } from 'react';
import type { ActionBarProps } from '../../headless/types';
import type { Reaction } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useClickOutside } from '../../headless/hooks';
import { ReactionButton } from './ReactionButton';

/**
 * ActionBar component displays action buttons for a comment
 */
export const ActionBar: React.FC<ActionBarProps> = ({
    comment,
    currentUser: _currentUser,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    availableReactions,
    showReactions = true,
    showMoreOptions = true,
    texts: customTexts,
    theme: customTheme,
    disabled = false,
    isAuthor = false,
}) => {
    const context = useCommentSection();
    const texts = customTexts || context.texts;
    const theme = customTheme || context.theme;
    const reactions = availableReactions || context.availableReactions;

    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    const reactionPickerRef = useClickOutside<HTMLDivElement>(
        () => setShowReactionPicker(false),
        showReactionPicker
    );

    const moreMenuRef = useClickOutside<HTMLDivElement>(
        () => setShowMoreMenu(false),
        showMoreMenu
    );

    // Build reactions array from comment
    const commentReactions: Reaction[] = reactions.map((config) => {
        const existingReaction = comment.reactions?.find((r) => r.id === config.id);
        return {
            id: config.id,
            label: config.label,
            emoji: config.emoji,
            count: existingReaction?.count || 0,
            isActive: existingReaction?.isActive || false,
        };
    });

    // Get primary reaction (usually the first one)
    const primaryReaction = commentReactions[0];

    const handleReactionClick = (reactionId: string) => {
        if (!disabled) {
            onReaction?.(reactionId);
            setShowReactionPicker(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '8px',
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
    };

    const buttonBaseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        border: 'none',
        background: 'transparent',
        color: theme.secondaryTextColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit',
        borderRadius: theme.borderRadius,
        transition: `all ${theme.animationDuration} ease`,
        opacity: disabled ? 0.6 : 1,
    };

    const moreButtonStyle: React.CSSProperties = {
        ...buttonBaseStyle,
        padding: '4px',
    };

    const reactionPickerStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '100%',
        left: '0',
        marginBottom: '8px',
        display: showReactionPicker ? 'flex' : 'none',
        gap: '4px',
        padding: '8px',
        backgroundColor: theme.backgroundColor,
        borderRadius: theme.borderRadius,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme.borderColor}`,
        zIndex: 100,
    };

    const moreMenuStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        right: '0',
        marginTop: '4px',
        display: showMoreMenu ? 'flex' : 'none',
        flexDirection: 'column',
        minWidth: '120px',
        backgroundColor: theme.backgroundColor,
        borderRadius: theme.borderRadius,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: `1px solid ${theme.borderColor}`,
        zIndex: 100,
        overflow: 'hidden',
    };

    const menuItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '10px 14px',
        border: 'none',
        background: 'transparent',
        color: theme.textColor,
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit',
        textAlign: 'left',
        transition: `background-color ${theme.animationDuration} ease`,
    };

    return (
        <div className="cs-action-bar" style={containerStyle}>
            {/* Primary Reaction (Like) */}
            {showReactions && primaryReaction && (
                <ReactionButton
                    reaction={primaryReaction}
                    isActive={primaryReaction.isActive}
                    onClick={() => handleReactionClick(primaryReaction.id)}
                    showCount
                    size="sm"
                    disabled={disabled}
                />
            )}

            {/* Reaction Picker */}
            {showReactions && commentReactions.length > 1 && (
                <div style={{ position: 'relative' }} ref={reactionPickerRef}>
                    <button
                        type="button"
                        style={moreButtonStyle}
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        disabled={disabled}
                        aria-label="More reactions"
                    >
                        <span style={{ fontSize: '16px' }}>😊</span>
                    </button>
                    <div style={reactionPickerStyle}>
                        {commentReactions.map((reaction) => (
                            <ReactionButton
                                key={reaction.id}
                                reaction={reaction}
                                isActive={reaction.isActive}
                                onClick={() => handleReactionClick(reaction.id)}
                                showCount={false}
                                size="md"
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Reply Button */}
            {onReply && (
                <button
                    type="button"
                    className="cs-action-reply"
                    style={buttonBaseStyle}
                    onClick={onReply}
                    disabled={disabled}
                    aria-label={texts.reply}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>{texts.reply}</span>
                </button>
            )}

            {/* More Options */}
            {showMoreOptions && (
                <div style={{ position: 'relative', marginLeft: 'auto' }} ref={moreMenuRef}>
                    <button
                        type="button"
                        style={moreButtonStyle}
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        disabled={disabled}
                        aria-label="More options"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>
                    <div style={moreMenuStyle}>
                        {isAuthor && onEdit && (
                            <button
                                type="button"
                                style={menuItemStyle}
                                onClick={() => {
                                    onEdit();
                                    setShowMoreMenu(false);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme.hoverBackgroundColor || '';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                {texts.edit}
                            </button>
                        )}
                        {isAuthor && onDelete && (
                            <button
                                type="button"
                                style={{
                                    ...menuItemStyle,
                                    color: '#ef4444',
                                }}
                                onClick={() => {
                                    if (window.confirm(texts.deleteConfirm)) {
                                        onDelete();
                                    }
                                    setShowMoreMenu(false);
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fef2f2';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    <line x1="10" y1="11" x2="10" y2="17" />
                                    <line x1="14" y1="11" x2="14" y2="17" />
                                </svg>
                                {texts.delete}
                            </button>
                        )}
                        {!isAuthor && (
                            <button
                                type="button"
                                style={menuItemStyle}
                                onClick={() => setShowMoreMenu(false)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme.hoverBackgroundColor || '';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                                    <line x1="4" y1="22" x2="4" y2="15" />
                                </svg>
                                Report
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

ActionBar.displayName = 'ActionBar';

export default ActionBar;
