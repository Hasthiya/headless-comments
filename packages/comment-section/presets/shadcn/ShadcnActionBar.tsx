/**
 * ActionBar component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ActionBar
 */

'use client';

import React, { useState, useCallback } from 'react';
import type { ActionBarProps } from '../../headless/types';
import type { Reaction } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useClickOutside } from '../../headless/hooks';
import { ShadcnReactionButton } from './ShadcnReactionButton';
import { cn, getCommentPermalink, copyToClipboard } from '../../core/utils';

/**
 * ShadcnActionBar component displays action buttons for a comment
 */
export const ShadcnActionBar: React.FC<ActionBarProps & { className?: string }> = ({
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
    theme: _customTheme,
    disabled = false,
    isAuthor = false,
    className,
}) => {
    const context = useCommentSection();
    const texts = customTexts || context.texts;
    const reportComment = context.reportComment;
    const reactions = availableReactions || context.availableReactions;

    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showReportSubmenu, setShowReportSubmenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [reportThanks, setReportThanks] = useState(false);

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

    const handleReport = useCallback(
        (reason: string) => {
            const reportComment = context.reportComment;
            if (reportComment) {
                reportComment(comment.id, reason);
            }
            setShowReportSubmenu(false);
            setShowMoreMenu(false);
            setReportThanks(true);
            setTimeout(() => setReportThanks(false), 3000);
        },
        [comment.id, context.reportComment]
    );

    const handleCopyLink = useCallback(async () => {
        const url = getCommentPermalink(comment.id);
        const ok = await copyToClipboard(url);
        if (ok) {
            setShowMoreMenu(false);
        }
    }, [comment.id]);

    const handleDeleteClick = useCallback(() => {
        setShowMoreMenu(false);
        setShowDeleteConfirm(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        onDelete?.();
        setShowDeleteConfirm(false);
    }, [onDelete]);

    const handleDeleteCancel = useCallback(() => {
        setShowDeleteConfirm(false);
    }, []);

    return (
        <div className={cn("flex items-center gap-3 mt-2", className)}>
            {/* Primary Reaction (Like) */}
            {showReactions && primaryReaction && (
                <ShadcnReactionButton
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
                <div className="relative" ref={reactionPickerRef}>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        disabled={disabled}
                        aria-label="More reactions"
                    >
                        <span className="text-base leading-none">😊</span>
                    </button>
                    {showReactionPicker && (
                        <div className="absolute bottom-full left-0 mb-2 flex gap-1 p-1 bg-popover text-popover-foreground rounded-md border shadow-md z-50">
                            {commentReactions.map((reaction) => (
                                <ShadcnReactionButton
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
                    )}
                </div>
            )}

            {/* Reply Button */}
            {onReply && (
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    onClick={onReply}
                    disabled={disabled}
                    aria-label={texts.reply}
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
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                    <span>{texts.reply}</span>
                </button>
            )}

            {/* More Options */}
            {showMoreOptions && (
                <div className="relative ml-auto" ref={moreMenuRef}>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
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
                    {showMoreMenu && (
                        <div className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md z-50 animate-in fade-in-0 zoom-in-95">
                            {isAuthor && onEdit && (
                                <button
                                    type="button"
                                    className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                    onClick={() => {
                                        onEdit();
                                        setShowMoreMenu(false);
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
                                    className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-destructive/10 text-destructive hover:text-destructive"
                                    onClick={handleDeleteClick}
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
                            <button
                                type="button"
                                className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                onClick={handleCopyLink}
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
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                </svg>
                                {texts.copyLink}
                            </button>
                            {!isAuthor && reportComment && (
                                showReportSubmenu ? (
                                    <div className="space-y-0.5 border-t pt-1 mt-1">
                                        <button
                                            type="button"
                                            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => handleReport('spam')}
                                        >
                                            {texts.reportSpam}
                                        </button>
                                        <button
                                            type="button"
                                            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => handleReport('harassment')}
                                        >
                                            {texts.reportHarassment}
                                        </button>
                                        <button
                                            type="button"
                                            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => handleReport('off-topic')}
                                        >
                                            {texts.reportOffTopic}
                                        </button>
                                        <button
                                            type="button"
                                            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                            onClick={() => handleReport('other')}
                                        >
                                            {texts.reportOther}
                                        </button>
                                        <button
                                            type="button"
                                            className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none text-muted-foreground hover:bg-accent"
                                            onClick={() => setShowReportSubmenu(false)}
                                        >
                                            Back
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground"
                                        onClick={() => setShowReportSubmenu(true)}
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
                                        {texts.report}
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-confirm-title"
            >
                <div className="mx-4 max-w-sm rounded-lg border bg-popover p-4 shadow-lg">
                    <h3 id="delete-confirm-title" className="font-semibold text-foreground">
                        {texts.deleteConfirm}
                    </h3>
                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
                            onClick={handleDeleteCancel}
                        >
                            {texts.cancel}
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDeleteConfirm}
                        >
                            {texts.delete}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Report thanks feedback */}
        {reportThanks && (
            <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg">
                {texts.reportThanks}
            </div>
        )}
    </div>
);
};

ShadcnActionBar.displayName = 'ShadcnActionBar';

export default ShadcnActionBar;
