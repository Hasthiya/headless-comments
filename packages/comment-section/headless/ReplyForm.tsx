import React, { useState, useCallback, useEffect } from 'react';
import type { CommentUser } from '../core/types';
import { useCommentSection } from './useComments';
import { useAutoResize, useCharacterCount, useEnterSubmit } from './hooks';

/**
 * Props passed to the render function (children) of HeadlessReplyForm.
 */
export interface HeadlessReplyFormChildrenProps {
    content: string;
    setContent: (content: string) => void;
    isSubmitting: boolean;
    error: string | null;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    characterCount: number;
    isOverLimit: boolean;
    remainingCharacters?: number;
    onSubmit: () => void;
    onCancel: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    disabled: boolean;
    /** Current logged-in user, or null/undefined if not authenticated */
    currentUser: CommentUser | null | undefined;
}

/**
 * Props for the headless reply form. Use for new comments (submitComment) or replies (replyToComment(commentId, content)).
 */
export interface HeadlessReplyFormProps {
    /** Render function receiving form state and handlers */
    children: (props: HeadlessReplyFormChildrenProps) => React.ReactNode;
    /** Called with trimmed content on submit */
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    maxCharLimit?: number;
    autoFocus?: boolean;
    disabled?: boolean;
    initialContent?: string;
    submitOnEnter?: boolean;
}

/**
 * Headless reply form: provides form state and handlers via render props.
 * Must be used inside CommentSectionProvider. Use with submitComment for top-level or replyToComment(commentId, content) for replies.
 */
export const HeadlessReplyForm: React.FC<HeadlessReplyFormProps> = ({
    children,
    onSubmit,
    onCancel,
    maxCharLimit,
    autoFocus = false,
    disabled = false,
    initialContent = '',
    submitOnEnter = true,
}) => {
    const context = useCommentSection();
    const currentUser = context.currentUser;
    const isSubmittingFromContext = context.isSubmittingComment ?? context.isSubmittingReply ?? false;

    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useAutoResize(content, 200);
    const { count, isOverLimit, remaining } = useCharacterCount(content, maxCharLimit);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus, textareaRef]);

    const handleSubmit = useCallback(() => {
        if (!content.trim() || isSubmittingFromContext || isOverLimit) return;
        setError(null);
        try {
            onSubmit(content.trim());
            setContent('');
            onCancel?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        }
    }, [content, isSubmittingFromContext, isOverLimit, onSubmit, onCancel]);

    const handleCancel = useCallback(() => {
        setContent('');
        setError(null);
        onCancel?.();
    }, [onCancel]);

    const isSubmitDisabled = !content.trim() || isSubmittingFromContext || isOverLimit || disabled;
    const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled, { submitOnEnter });

    return (
        <>
            {children({
                content,
                setContent,
                isSubmitting: isSubmittingFromContext,
                error,
                textareaRef,
                characterCount: count,
                isOverLimit,
                remainingCharacters: remaining,
                onSubmit: handleSubmit,
                onCancel: handleCancel,
                onKeyDown,
                disabled,
                currentUser,
            })}
        </>
    );
};
