'use client';

/**
 * Composable hook for replying to a specific comment.
 * Works with or without CommentSectionProvider (context-optional pattern).
 * Supports both sync and async onReply handlers — isSubmitting reflects in-flight state.
 * @module @headless-comments/react/headless/useReplyTo
 */

import { useState, useCallback } from 'react';
import { useOptionalCommentSection } from './useComments';

export interface UseReplyToOptions {
    /** Called when the reply is submitted. Can return a Promise for async operations. If omitted, uses Provider context. */
    onReply?: (commentId: string, content: string) => void | Promise<void>;
}

export interface UseReplyToReturn {
    /** Whether the reply form is open for this comment */
    isReplying: boolean;
    /** Current reply content */
    replyContent: string;
    /** Update reply content */
    setReplyContent: (content: string) => void;
    /** Open the reply form */
    openReply: () => void;
    /** Submit the reply */
    submitReply: () => void;
    /** Cancel / close the reply form */
    cancelReply: () => void;
    /** Whether the reply is in-flight (true while an async onReply is pending) */
    isSubmitting: boolean;
}

/**
 * Hook for replying to a specific comment. Scoped to a single commentId.
 *
 * Context-optional: when used inside a Provider, auto-wires to context.replyToComment.
 * When used standalone, pass onReply in options.
 *
 * @param commentId - The id of the parent comment
 * @param options - Optional callbacks
 */
export function useReplyTo(
    commentId: string,
    options: UseReplyToOptions = {}
): UseReplyToReturn {
    const context = useOptionalCommentSection();
    const onReply = options.onReply ?? context?.replyToComment;

    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openReply = useCallback(() => {
        setIsReplying(true);
        setReplyContent('');
    }, []);

    const cancelReply = useCallback(() => {
        setIsReplying(false);
        setReplyContent('');
        setIsSubmitting(false);
    }, []);

    const submitReply = useCallback(() => {
        if (!onReply) {
            throw new Error(
                'useReplyTo: no onReply handler provided. Either wrap in CommentSectionProvider or pass onReply in options.'
            );
        }
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybePromise: any = onReply(commentId, replyContent);

        // Support both sync and async handlers
        if (maybePromise && typeof maybePromise.then === 'function') {
            (maybePromise as Promise<void>)
                .then(() => {
                    setIsReplying(false);
                    setReplyContent('');
                })
                .catch(() => {
                    // Keep reply form open on error so user can retry
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setIsReplying(false);
            setReplyContent('');
            setIsSubmitting(false);
        }
    }, [commentId, replyContent, onReply]);

    return {
        isReplying,
        replyContent,
        setReplyContent,
        openReply,
        submitReply,
        cancelReply,
        isSubmitting,
    };
}
