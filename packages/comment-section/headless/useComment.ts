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

export interface UseCommentOptions {
    /** Called when the comment is edited */
    onEdit?: (commentId: string, content: string) => void | Promise<void>;
    /** Called when a reply is submitted */
    onReply?: (commentId: string, content: string) => void | Promise<void>;
    /** Called when a reaction is toggled */
    onReaction?: (commentId: string, reactionId: string) => void | Promise<void>;
    /** Called when the comment is deleted */
    onDelete?: (commentId: string) => void;
    /** Current user (for determining isAuthor). Falls back to Provider context. */
    currentUser?: CommentUser;
}

export interface UseCommentReturn<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The comment data */
    comment: Comment<T>;
    /** Whether the current user is the author of this comment */
    isAuthor: boolean;
    /** Edit state and handlers */
    edit: UseEditCommentReturn;
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

    // Delete
    const deleteComment = useCallback(() => {
        if (!onDelete) {
            throw new Error(
                'useComment: no onDelete handler provided. Either wrap in CommentSectionProvider or pass onDelete in options.'
            );
        }
        onDelete(comment.id);
    }, [comment.id, onDelete]);

    return useMemo(
        () => ({
            comment,
            isAuthor,
            edit,
            reply,
            reaction,
            showReplies,
            toggleReplies,
            deleteComment,
        }),
        [comment, isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment]
    );
}
