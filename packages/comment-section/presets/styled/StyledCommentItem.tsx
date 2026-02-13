'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { Comment, CommentUser, CommentTexts } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useReplyForm } from '../../headless/useReplyForm';
import { useEditMode } from '../../headless/useEditMode';
import { useReactions } from '../../headless/useReactions';
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
        replyToComment,
        toggleReaction: contextToggleReaction,
        editComment,
        deleteComment,
        enableOptimisticUpdates,
    } = context;

    const maxDepth = propMaxDepth ?? contextMaxDepth;

    // Hooks
    const replyForm = useReplyForm();
    const editMode = useEditMode();
    const { toggleReaction } = useReactions(
        (commentId: string, reactionId: string) =>
            contextToggleReaction(commentId, reactionId),
        enableOptimisticUpdates
    );

    // Local state
    const [showReplies, setShowReplies] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [editContent, setEditContent] = useState('');

    const isAuthor = currentUser?.id === comment.author.id;
    const isEditing =
        editMode.isEditing && editMode.editingCommentId === comment.id;
    const isReplying = replyForm.activeCommentId === comment.id;
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
        replyForm.openReply(comment.id);
    }, [comment.id, replyForm]);

    const handleEditStart = useCallback(() => {
        editMode.startEdit(comment.id, comment.content);
        setEditContent(comment.content);
    }, [comment.id, comment.content, editMode]);

    const handleEditSubmit = useCallback(() => {
        if (editContent.trim()) {
            editComment(comment.id, editContent.trim());
            editMode.cancelEdit();
        }
    }, [comment.id, editContent, editComment, editMode]);

    const handleDelete = useCallback(() => {
        deleteComment(comment.id);
    }, [comment.id, deleteComment]);

    const handleReaction = useCallback(
        (reactionId: string) => {
            toggleReaction(comment.id, reactionId);
        },
        [comment.id, toggleReaction]
    );

    const handleReplySubmit = useCallback(
        (content: string) => {
            replyToComment(comment.id, content);
            replyForm.closeReply();
        },
        [comment.id, replyToComment, replyForm]
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
                {isEditing ? (
                    <div className="cs-edit-form">
                        <textarea
                            className="cs-edit-form__textarea"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={3}
                            autoFocus
                        />
                        <div className="cs-edit-form__actions">
                            <button
                                type="button"
                                className="cs-btn cs-btn--primary cs-btn--sm"
                                onClick={handleEditSubmit}
                                disabled={!editContent.trim()}
                            >
                                {texts.submit}
                            </button>
                            <button
                                type="button"
                                className="cs-btn cs-btn--outline cs-btn--sm"
                                onClick={editMode.cancelEdit}
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
                {!readOnly && !isEditing && (
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
                {isReplying && (
                    <StyledReplyForm
                        parentComment={comment}
                        currentUser={currentUser}
                        onSubmit={handleReplySubmit}
                        onCancel={replyForm.closeReply}
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
