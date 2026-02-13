'use client';

/**
 * All-in-one composable hook for a single comment.
 * Composes useEditComment, useReplyTo, and useCommentReaction.
 * Works with or without CommentSectionProvider.
 * @module @headless-comments/react/headless/useComment
 */

import { useState, useCallback, useMemo } from 'react';
import type { Comment, CommentUser } from '../core/types';
import { useOptionalCommentSection } from './useComments';
import { useEditComment } from './useEditComment';
import type { UseEditCommentReturn } from './useEditComment';
import { useReplyTo } from './useReplyTo';
import type { UseReplyToReturn } from './useReplyTo';
import { useCommentReaction } from './useCommentReaction';
import type { UseCommentReactionReturn } from './useCommentReaction';

/** Edit return with startEditing optional arg (defaults to comment content when used via useComment). */
export interface UseCommentEditReturn extends Omit<UseEditCommentReturn, 'startEditing'> {
    /** Enter edit mode. When called with no args, pre-fills with the comment's current content. */
    startEditing: (currentContent?: string) => void;
}

/**
 * Options for useComment. All callbacks are optional; when omitted, the hook
 * uses handlers from CommentSectionProvider context when available.
 */
export interface UseCommentOptions {
    /** Called when the comment is edited. Signature: (commentId, content) => void | Promise<void> */
    onEdit?: (commentId: string, content: string) => void | Promise<void>;
    /** Called when a reply is submitted. Signature: (commentId, content) => void | Promise<void> */
    onReply?: (commentId: string, content: string) => void | Promise<void>;
    /** Called when a reaction is toggled. Signature: (commentId, reactionId) => void | Promise<void> */
    onReaction?: (commentId: string, reactionId: string) => void | Promise<void>;
    /** Called when the comment is deleted. Signature: (commentId) => void */
    onDelete?: (commentId: string) => void;
    /** Current user (for determining isAuthor). Falls back to Provider context. */
    currentUser?: CommentUser;
}

export interface UseCommentReturn<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The comment data */
    comment: Comment<T>;
    /** Whether the current user is the author of this comment */
    isAuthor: boolean;
    /** Edit state and handlers (startEditing() with no args pre-fills with comment.content) */
    edit: UseCommentEditReturn;
    /** Reply state and handlers */
    reply: UseReplyToReturn;
    /** Reaction state and handlers */
    reaction: UseCommentReactionReturn;
    /** Whether replies are expanded */
    showReplies: boolean;
    /** Toggle reply visibility */
    toggleReplies: () => void;
    /** Delete this comment */
    deleteComment: () => void;
    /** True while a delete is in progress (when deleteComment returns a Promise) */
    isPendingDelete: boolean;
}

/**
 * All-in-one hook for a single comment. Composes the granular hooks
 * (useEditComment, useReplyTo, useCommentReaction) into a single return value.
 *
 * Context-optional: works with or without CommentSectionProvider.
 *
 * @param comment - The comment data
 * @param options - Optional callbacks and config
 */
export function useComment<T extends Record<string, unknown> = Record<string, unknown>>(
    comment: Comment<T>,
    options: UseCommentOptions = {}
): UseCommentReturn<T> {
    const context = useOptionalCommentSection();

    const currentUser = options.currentUser ?? context?.currentUser;
    const onDelete = options.onDelete ?? context?.deleteComment;

    const isAuthor = currentUser?.id === comment.author.id;

    // Compose granular hooks
    const edit = useEditComment(comment.id, { onEdit: options.onEdit });
    const reply = useReplyTo(comment.id, { onReply: options.onReply });
    const reaction = useCommentReaction(comment.id, {
        reactions: comment.reactions,
        onReaction: options.onReaction,
    });

    // Reply visibility
    const [showReplies, setShowReplies] = useState(true);
    const toggleReplies = useCallback(() => setShowReplies((prev) => !prev), []);

    // Delete and pending state (when onDelete returns a Promise)
    const [isPendingDelete, setIsPendingDelete] = useState(false);
    const deleteComment = useCallback(() => {
        if (!onDelete) {
            throw new Error(
                'useComment: no onDelete handler provided. Either wrap in CommentSectionProvider or pass onDelete in options.'
            );
        }
        const result = onDelete(comment.id);
        if (result != null && typeof (result as Promise<unknown>).then === 'function') {
            setIsPendingDelete(true);
            (result as Promise<void>).finally(() => setIsPendingDelete(false));
        }
    }, [comment.id, onDelete]);

    // Wrap edit so startEditing() with no args defaults to comment.content
    const editWithDefault = useMemo(
        (): UseCommentEditReturn => ({
            ...edit,
            startEditing: (content?: string) => edit.startEditing(content ?? comment.content),
        }),
        [edit, comment.content]
    );

    return useMemo(
        () => ({
            comment,
            isAuthor,
            edit: editWithDefault,
            reply,
            reaction,
            showReplies,
            toggleReplies,
            deleteComment,
            isPendingDelete,
        }),
        [comment, isAuthor, editWithDefault, reply, reaction, showReplies, toggleReplies, deleteComment, isPendingDelete]
    );
}
