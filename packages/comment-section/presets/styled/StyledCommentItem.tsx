'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { Comment, CommentUser, CommentTexts } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useEditComment } from '../../headless/useEditComment';
import { useReplyTo } from '../../headless/useReplyTo';
import { useCommentReaction } from '../../headless/useCommentReaction';
import { formatRelativeTime, truncateToLines } from '../../core/utils';
import { StyledAvatar } from './StyledAvatar';
import { StyledActionBar } from './StyledActionBar';
import { StyledReplyForm } from './StyledReplyForm';
import { IconChevronDown } from './icons';

/* ── Badge helper ─────────────────────────────────────────────────────── */
function UserBadge({
    author,
    texts,
}: {
    author: CommentUser;
    texts: Required<CommentTexts>;
}) {
    if (!author.role) return null;

    const labels: Record<string, string> = {
        verified: texts.verified,
        instructor: texts.instructor,
        moderator: texts.moderator,
        staff: texts.staff,
    };

    const modifiers: Record<string, string> = {
        verified: 'cs-comment__badge--verified',
        instructor: 'cs-comment__badge--instructor',
        moderator: 'cs-comment__badge--moderator',
        staff: 'cs-comment__badge--staff',
    };

    return (
        <span className={`cs-comment__badge ${modifiers[author.role] || ''}`}>
            {labels[author.role] || author.role}
        </span>
    );
}

/* ── Comment Item ─────────────────────────────────────────────────────── */
export interface StyledCommentItemProps {
    comment: Comment;
    depth?: number;
    maxDepth?: number;
    readOnly?: boolean;
    showReactions?: boolean;
    showMoreOptions?: boolean;
    showVerifiedBadge?: boolean;
    maxCommentLines?: number;
    className?: string;
}

export const StyledCommentItem: React.FC<StyledCommentItemProps> = ({
    comment,
    depth = 0,
    maxDepth: propMaxDepth,
    readOnly = false,
    showReactions = true,
    showMoreOptions = true,
    showVerifiedBadge = true,
    maxCommentLines,
    className = '',
}) => {
    const context = useCommentSection();
    const {
        currentUser,
        texts,
        locale,
        maxDepth: contextMaxDepth,
    } = context;

    const maxDepth = propMaxDepth ?? contextMaxDepth;

    // Composable hooks (scoped to this comment)
    const editHook = useEditComment(comment.id);
    const replyHook = useReplyTo(comment.id);
    const reactionHook = useCommentReaction(comment.id, {
        reactions: comment.reactions,
    });

    // Local state
    const [showReplies, setShowReplies] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const isAuthor = currentUser?.id === comment.author.id;
    const replies = comment.replies || [];

    // Truncation
    const truncated = useMemo(() => {
        if (!maxCommentLines) return null;
        return truncateToLines(comment.content, maxCommentLines);
    }, [comment.content, maxCommentLines]);

    const displayContent =
        truncated && !isExpanded && truncated.isTruncated
            ? truncated.text
            : comment.content;

    // Handlers
    const handleReplyOpen = useCallback(() => {
        replyHook.openReply();
    }, [replyHook]);

    const handleEditStart = useCallback(() => {
        editHook.startEditing(comment.content);
    }, [comment.content, editHook]);

    const handleEditSubmit = useCallback(() => {
        if (editHook.editContent.trim()) {
            editHook.submitEdit();
        }
    }, [editHook]);

    const handleDelete = useCallback(() => {
        context.deleteComment(comment.id);
    }, [comment.id, context]);

    const handleReaction = useCallback(
        (reactionId: string) => {
            reactionHook.toggle(reactionId);
        },
        [reactionHook]
    );

    const handleReplySubmit = useCallback(
        (content: string) => {
            context.replyToComment(comment.id, content);
            replyHook.cancelReply();
        },
        [comment.id, context, replyHook]
    );

    const timeStr = formatRelativeTime(comment.createdAt, locale, texts);

    return (
        <div
            className={`cs-comment${comment.isPending ? ' cs-comment--pending' : ''} ${className}`.trim()}
            id={`comment-${comment.id}`}
        >
            <div style={{ flexShrink: 0 }}>
                <StyledAvatar user={comment.author} size={depth > 0 ? 'sm' : 'md'} />
            </div>
            <div className="cs-comment__body">
                {/* Header */}
                <div className="cs-comment__header">
                    <span className="cs-comment__author">{comment.author.name}</span>
                    {showVerifiedBadge && comment.author.role && (
                        <UserBadge author={comment.author} texts={texts} />
                    )}
                    <span className="cs-comment__time">{timeStr}</span>
                    {comment.isEdited && (
                        <span className="cs-comment__edited">{texts.edited}</span>
                    )}
                </div>

                {/* Content or Edit form */}
                {editHook.isEditing ? (
                    <div className="cs-edit-form">
                        <textarea
                            className="cs-edit-form__textarea"
                            value={editHook.editContent}
                            onChange={(e) => editHook.setEditContent(e.target.value)}
                            rows={3}
                            autoFocus
                        />
                        <div className="cs-edit-form__actions">
                            <button
                                type="button"
                                className="cs-btn cs-btn--primary cs-btn--sm"
                                onClick={handleEditSubmit}
                                disabled={!editHook.editContent.trim()}
                            >
                                {texts.submit}
                            </button>
                            <button
                                type="button"
                                className="cs-btn cs-btn--outline cs-btn--sm"
                                onClick={editHook.cancelEdit}
                            >
                                {texts.cancel}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="cs-comment__content">
                        {displayContent}
                        {truncated?.isTruncated && !isExpanded && (
                            <button
                                type="button"
                                className="cs-comment__read-more"
                                onClick={() => setIsExpanded(true)}
                            >
                                {texts.readMore}
                            </button>
                        )}
                    </div>
                )}

                {/* Action Bar */}
                {!readOnly && !editHook.isEditing && (
                    <StyledActionBar
                        comment={comment}
                        onReply={depth < maxDepth ? handleReplyOpen : undefined}
                        onReaction={showReactions ? handleReaction : undefined}
                        onEdit={isAuthor ? handleEditStart : undefined}
                        onDelete={isAuthor ? handleDelete : undefined}
                        isAuthor={isAuthor}
                        disabled={!!comment.isPending}
                    />
                )}

                {/* Inline Reply Form */}
                {replyHook.isReplying && (
                    <StyledReplyForm
                        parentComment={comment}
                        currentUser={currentUser}
                        onSubmit={handleReplySubmit}
                        onCancel={replyHook.cancelReply}
                        autoFocus
                    />
                )}

                {/* Replies */}
                {replies.length > 0 && depth < maxDepth && (
                    <>
                        <button
                            type="button"
                            className="cs-replies-toggle"
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            <span
                                className={`cs-replies-toggle__icon${showReplies ? ' cs-replies-toggle__icon--expanded' : ''}`}
                            >
                                <IconChevronDown />
                            </span>
                            {showReplies ? texts.hideReplies : texts.showReplies} ({replies.length})
                        </button>
                        {showReplies && (
                            <div className="cs-replies">
                                {replies.map((reply) => (
                                    <StyledCommentItem
                                        key={reply.id}
                                        comment={reply}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                        readOnly={readOnly}
                                        showReactions={showReactions}
                                        showMoreOptions={showMoreOptions}
                                        showVerifiedBadge={showVerifiedBadge}
                                        maxCommentLines={maxCommentLines}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

StyledCommentItem.displayName = 'StyledCommentItem';
