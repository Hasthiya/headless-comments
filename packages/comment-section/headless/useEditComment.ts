'use client';

/**
 * Composable hook for editing a specific comment.
 * Works with or without CommentSectionProvider (context-optional pattern).
 * Supports both sync and async onEdit handlers — isSubmitting reflects in-flight state.
 * @module @headless-comments/react/headless/useEditComment
 */

import { useState, useCallback } from 'react';
import { useOptionalCommentSection } from './useComments';

export interface UseEditCommentOptions {
    /** Called when the edit is submitted. Can return a Promise for async operations. If omitted, uses Provider context. */
    onEdit?: (commentId: string, content: string) => void | Promise<void>;
}

export interface UseEditCommentReturn {
    /** Whether this comment is currently being edited */
    isEditing: boolean;
    /** Current edit content */
    editContent: string;
    /** Update edit content */
    setEditContent: (content: string) => void;
    /** Enter edit mode (pre-fills with current content) */
    startEditing: (currentContent: string) => void;
    /** Submit the edit */
    submitEdit: () => void;
    /** Cancel editing */
    cancelEdit: () => void;
    /** Whether the edit is in-flight (true while an async onEdit is pending) */
    isSubmitting: boolean;
}

/**
 * Hook for editing a specific comment. Scoped to a single commentId.
 *
 * Context-optional: when used inside a Provider, auto-wires to context.editComment.
 * When used standalone, pass onEdit in options.
 *
 * @param commentId - The id of the comment this hook manages
 * @param options - Optional callbacks
 */
export function useEditComment(
    commentId: string,
    options: UseEditCommentOptions = {}
): UseEditCommentReturn {
    const context = useOptionalCommentSection();
    const onEdit = options.onEdit ?? context?.editComment;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const startEditing = useCallback((currentContent: string) => {
        setEditContent(currentContent);
        setIsEditing(true);
    }, []);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditContent('');
        setIsSubmitting(false);
    }, []);

    const submitEdit = useCallback(() => {
        if (!onEdit) {
            throw new Error(
                'useEditComment: no onEdit handler provided. Either wrap in CommentSectionProvider or pass onEdit in options.'
            );
        }
        if (!editContent.trim()) return;

        setIsSubmitting(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybePromise: any = onEdit(commentId, editContent);

        // Support both sync and async handlers
        if (maybePromise && typeof maybePromise.then === 'function') {
            (maybePromise as Promise<void>)
                .then(() => {
                    setIsEditing(false);
                    setEditContent('');
                })
                .catch(() => {
                    // Keep editing state on error so user can retry
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            setIsEditing(false);
            setEditContent('');
            setIsSubmitting(false);
        }
    }, [commentId, editContent, onEdit]);

    return {
        isEditing,
        editContent,
        setEditContent,
        startEditing,
        submitEdit,
        cancelEdit,
        isSubmitting,
    };
}
