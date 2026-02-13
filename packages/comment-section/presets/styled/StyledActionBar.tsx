'use client';

import React, { useState, useCallback } from 'react';
import type { Comment, Reaction, ReactionConfig } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useClickOutside } from '../../headless/hooks';
import { getCommentPermalink, copyToClipboard } from '../../core/utils';
import {
    IconReply,
    IconEdit,
    IconTrash,
    IconShare,
    IconMore,
    IconFlag,
    IconLink,
} from './icons';

export interface StyledActionBarProps {
    comment: Comment;
    onReply?: () => void;
    onReaction?: (reactionId: string) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    isAuthor?: boolean;
    disabled?: boolean;
    className?: string;
}

export const StyledActionBar: React.FC<StyledActionBarProps> = ({
    comment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    isAuthor = false,
    disabled = false,
    className = '',
}) => {
    const context = useCommentSection();
    const texts = context.texts;
    const reportComment = context.reportComment;
    const reactions = context.availableReactions;

    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showReportSub, setShowReportSub] = useState(false);
    const [reportThanks, setReportThanks] = useState(false);

    const reactionPickerRef = useClickOutside<HTMLDivElement>(
        () => setShowReactionPicker(false),
        showReactionPicker
    );

    const dropdownRef = useClickOutside<HTMLDivElement>(
        () => {
            setShowDropdown(false);
            setShowReportSub(false);
        },
        showDropdown
    );

    const commentReactions: Reaction[] = reactions.map((config: ReactionConfig) => {
        const existing = comment.reactions?.find((r) => r.id === config.id);
        return {
            id: config.id,
            label: config.label,
            emoji: config.emoji,
            count: existing?.count || 0,
            isActive: existing?.isActive || false,
        };
    });

    const handleReactionClick = (reactionId: string) => {
        if (!disabled) {
            onReaction?.(reactionId);
            setShowReactionPicker(false);
        }
    };

    /* Show up to 5 reactions in the picker (or all if fewer) */
    const pickerReactions = commentReactions.slice(0, 5);

    const handleReport = useCallback(
        (reason: string) => {
            if (reportComment) reportComment(comment.id, reason);
            setReportThanks(true);
            setShowDropdown(false);
            setShowReportSub(false);
            setTimeout(() => setReportThanks(false), 3000);
        },
        [comment.id, reportComment]
    );

    const handleCopyLink = useCallback(async () => {
        await copyToClipboard(getCommentPermalink(comment.id));
        setShowDropdown(false);
    }, [comment.id]);

    const handleDeleteClick = useCallback(() => {
        setShowDropdown(false);
        setShowDeleteConfirm(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        onDelete?.();
        setShowDeleteConfirm(false);
    }, [onDelete]);

    return (
        <div className={`cs-action-bar ${className}`.trim()}>
            {/* Single smiley icon: click opens reaction picker with up to 5 reactions (emoji + count) */}
            {pickerReactions.length > 0 && (
                <div className="cs-reaction-picker" ref={reactionPickerRef}>
                    <button
                        type="button"
                        className="cs-btn cs-btn--ghost cs-btn--icon cs-reaction-trigger"
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        disabled={disabled}
                        aria-label="Reactions"
                        aria-expanded={showReactionPicker}
                    >
                        <span className="cs-reaction-trigger__emoji" aria-hidden>😊</span>
                    </button>
                    {showReactionPicker && (
                        <div className="cs-reaction-picker__popover">
                            {pickerReactions.map((reaction) => (
                                <button
                                    key={reaction.id}
                                    type="button"
                                    className={`cs-reaction cs-reaction-picker__item${reaction.isActive ? ' cs-reaction--active' : ''}`}
                                    onClick={() => handleReactionClick(reaction.id)}
                                    disabled={disabled}
                                    aria-pressed={reaction.isActive}
                                    aria-label={`${reaction.label}${reaction.count > 0 ? ` (${reaction.count})` : ''}`}
                                >
                                    <span className="cs-reaction__emoji">{reaction.emoji}</span>
                                    <span className="cs-reaction__count">{reaction.count}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reply */}
            {onReply && (
                <button
                    type="button"
                    className="cs-btn cs-btn--ghost cs-btn--sm"
                    onClick={onReply}
                    disabled={disabled}
                    aria-label={texts.reply}
                >
                    <IconReply />
                    {texts.reply}
                </button>
            )}

            {/* Share / Copy Link */}
            <button
                type="button"
                className="cs-btn cs-btn--ghost cs-btn--sm"
                onClick={handleCopyLink}
                disabled={disabled}
                aria-label={texts.copyLink}
            >
                <IconShare />
                {texts.copyLink}
            </button>

            {/* More Options Dropdown */}
            <div className="cs-dropdown" ref={dropdownRef}>
                <button
                    type="button"
                    className="cs-btn cs-btn--ghost cs-btn--icon"
                    onClick={() => setShowDropdown(!showDropdown)}
                    disabled={disabled}
                    aria-label="More options"
                >
                    <IconMore />
                </button>
                {showDropdown && (
                    <div className="cs-dropdown__menu">
                        {isAuthor && onEdit && (
                            <button
                                type="button"
                                className="cs-dropdown__item"
                                onClick={() => {
                                    onEdit();
                                    setShowDropdown(false);
                                }}
                            >
                                <IconEdit />
                                {texts.edit}
                            </button>
                        )}
                        {isAuthor && onDelete && (
                            <button
                                type="button"
                                className="cs-dropdown__item cs-dropdown__item--destructive"
                                onClick={handleDeleteClick}
                            >
                                <IconTrash />
                                {texts.delete}
                            </button>
                        )}
                        {isAuthor && (onEdit || onDelete) && (
                            <div className="cs-dropdown__separator" />
                        )}
                        <button
                            type="button"
                            className="cs-dropdown__item"
                            onClick={handleCopyLink}
                        >
                            <IconLink />
                            {texts.copyLink}
                        </button>
                        {!isAuthor && reportComment && (
                            <div className="cs-dropdown__sub">
                                <button
                                    type="button"
                                    className="cs-dropdown__sub-trigger"
                                    onClick={() => setShowReportSub(!showReportSub)}
                                >
                                    <IconFlag />
                                    {texts.report}
                                </button>
                                {showReportSub && (
                                    <div className="cs-dropdown__sub-menu">
                                        <button
                                            type="button"
                                            className="cs-dropdown__item"
                                            onClick={() => handleReport('spam')}
                                        >
                                            {texts.reportSpam}
                                        </button>
                                        <button
                                            type="button"
                                            className="cs-dropdown__item"
                                            onClick={() => handleReport('harassment')}
                                        >
                                            {texts.reportHarassment}
                                        </button>
                                        <button
                                            type="button"
                                            className="cs-dropdown__item"
                                            onClick={() => handleReport('off-topic')}
                                        >
                                            {texts.reportOffTopic}
                                        </button>
                                        <button
                                            type="button"
                                            className="cs-dropdown__item"
                                            onClick={() => handleReport('other')}
                                        >
                                            {texts.reportOther}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div
                    className="cs-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cs-delete-title"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowDeleteConfirm(false);
                    }}
                >
                    <div className="cs-dialog">
                        <h3 className="cs-dialog__title" id="cs-delete-title">
                            {texts.deleteConfirm}
                        </h3>
                        <p className="cs-dialog__description">
                            This action cannot be undone.
                        </p>
                        <div className="cs-dialog__actions">
                            <button
                                type="button"
                                className="cs-btn cs-btn--outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                {texts.cancel}
                            </button>
                            <button
                                type="button"
                                className="cs-btn cs-btn--destructive"
                                onClick={handleDeleteConfirm}
                            >
                                {texts.delete}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Thanks Toast */}
            {reportThanks && (
                <div className="cs-toast">{texts.reportThanks}</div>
            )}
        </div>
    );
};

StyledActionBar.displayName = 'StyledActionBar';
