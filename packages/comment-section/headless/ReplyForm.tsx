import React, { useState, useCallback, useEffect } from 'react';
import type { CommentUser } from '../core/types';
import { useOptionalCommentSection } from './useComments';
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
 * Props for the headless reply form.
 * Works with or without CommentSectionProvider.
 */
export interface HeadlessReplyFormProps {
    /** Render function receiving form state and handlers */
    children: (props: HeadlessReplyFormChildrenProps) => React.ReactNode;
    /** Called with trimmed content on submit. Can return a Promise for async operations. */
    onSubmit: (content: string) => void | Promise<void>;
    onCancel?: () => void;
    maxCharLimit?: number;
    autoFocus?: boolean;
    disabled?: boolean;
    initialContent?: string;
    submitOnEnter?: boolean;
    /** Current user (for standalone use) */
    currentUser?: CommentUser | null;
    /** Whether the form is submitting (for standalone use) */
    isSubmitting?: boolean;
}

/**
 * Headless reply form: provides form state and handlers via render props.
 * Works with or without CommentSectionProvider.
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
    currentUser: currentUserProp,
    isSubmitting: isSubmittingProp = false,
}) => {
    const context = useOptionalCommentSection();
    const currentUser = currentUserProp ?? context?.currentUser;
    const isSubmittingFromContext = isSubmittingProp;

    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useAutoResize(content, 200);
    const { count, isOverLimit, remaining } = useCharacterCount(content, maxCharLimit);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus, textareaRef]);

    const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);

    const handleSubmit = useCallback(() => {
        if (!content.trim() || isSubmittingFromContext || isSubmittingInternal || isOverLimit) return;
        setError(null);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybePromise: any = onSubmit(content.trim());

        // Support both sync and async onSubmit
        if (maybePromise && typeof maybePromise.then === 'function') {
            setIsSubmittingInternal(true);
            (maybePromise as Promise<void>)
                .then(() => {
                    setContent('');
                    onCancel?.();
                })
                .catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : 'Failed to submit');
                })
                .finally(() => {
                    setIsSubmittingInternal(false);
                });
        } else {
            setContent('');
            onCancel?.();
        }
    }, [content, isSubmittingFromContext, isSubmittingInternal, isOverLimit, onSubmit, onCancel]);

    const handleCancel = useCallback(() => {
        setContent('');
        setError(null);
        onCancel?.();
    }, [onCancel]);

    const isSubmitting = isSubmittingFromContext || isSubmittingInternal;
    const isSubmitDisabled = !content.trim() || isSubmitting || isOverLimit || disabled;
    const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled, { submitOnEnter });

    return (
        <>
            {children({
                content,
                setContent,
                isSubmitting,
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
