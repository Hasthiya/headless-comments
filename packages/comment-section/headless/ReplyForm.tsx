import React, { useState, useCallback, useEffect } from 'react';
import { useCommentSection } from './useComments';
import { useAutoResize, useCharacterCount, useKeyboardShortcut } from './hooks';

export interface HeadlessReplyFormChildrenProps {
    content: string;
    setContent: (content: string) => void;
    isSubmitting: boolean;
    error: string | null;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    characterCount: number;
    isOverLimit: boolean;
    remainingCharacters?: number;
    onSubmit: () => Promise<void>;
    onCancel: () => void;
    disabled: boolean;
    currentUser: any;
}

export interface HeadlessReplyFormProps {
    children: (props: HeadlessReplyFormChildrenProps) => React.ReactNode;
    onSubmit: (content: string) => Promise<void>;
    onCancel?: () => void;
    maxCharLimit?: number;
    autoFocus?: boolean;
    disabled?: boolean;
    initialContent?: string;
    submitOnEnter?: boolean; // Ctrl+Enter
}

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

    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useAutoResize(content, 200);
    const { count, isOverLimit, remaining } = useCharacterCount(content, maxCharLimit);

    // Sync ref focus
    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus, textareaRef]);

    const handleSubmit = useCallback(async () => {
        if (!content.trim() || isSubmitting || isOverLimit) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await onSubmit(content.trim());
            setContent('');
            onCancel?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setIsSubmitting(false);
        }
    }, [content, isSubmitting, isOverLimit, onSubmit, onCancel]);

    const handleCancel = useCallback(() => {
        setContent('');
        setError(null);
        onCancel?.();
    }, [onCancel]);

    // Keyboard shortcut for submit (Ctrl/Cmd + Enter)
    useKeyboardShortcut(
        'Enter',
        () => {
            if (submitOnEnter && !isSubmitting && content.trim() && !isOverLimit) {
                handleSubmit();
            }
        },
        { ctrl: true }
    );

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
                disabled,
                currentUser,
            })}
        </>
    );
};
