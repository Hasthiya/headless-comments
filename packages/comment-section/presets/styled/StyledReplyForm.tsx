'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { Comment, CommentUser } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useAutoResize, useCharacterCount, useEnterSubmit } from '../../headless/hooks';
import { StyledAvatar } from './StyledAvatar';

export interface StyledReplyFormProps {
    parentComment?: Comment;
    currentUser?: CommentUser | null;
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    maxCharLimit?: number;
    showCharCount?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    className?: string;
}

export const StyledReplyForm: React.FC<StyledReplyFormProps> = ({
    parentComment,
    currentUser,
    onSubmit,
    onCancel,
    placeholder,
    maxCharLimit,
    showCharCount = false,
    autoFocus = false,
    disabled = false,
    className = '',
}) => {
    const context = useCommentSection();
    const texts = context.texts;
    const isSubmitting = parentComment
        ? context.isSubmittingReply
        : context.isSubmittingComment;

    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useAutoResize(content, 200);
    const { count, isOverLimit, remaining } = useCharacterCount(content, maxCharLimit);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus, textareaRef]);

    const handleSubmit = useCallback(() => {
        if (!content.trim() || isSubmitting || isOverLimit) return;
        setError(null);
        try {
            onSubmit(content.trim());
            setContent('');
            onCancel?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        }
    }, [content, isSubmitting, isOverLimit, onSubmit, onCancel]);

    const isSubmitDisabled =
        !content.trim() || isSubmitting || isOverLimit || disabled;
    const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

    const handleCancel = useCallback(() => {
        setContent('');
        setError(null);
        onCancel?.();
    }, [onCancel]);

    const inputPlaceholder =
        placeholder ||
        (parentComment ? texts.replyPlaceholder : texts.inputPlaceholder);

    const textareaClasses = [
        'cs-reply-form__textarea',
        error && 'cs-reply-form__textarea--error',
        isOverLimit && 'cs-reply-form__textarea--error',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`cs-reply-form ${className}`.trim()}>
            {currentUser && (
                <div style={{ flexShrink: 0 }}>
                    <StyledAvatar user={currentUser} size="md" />
                </div>
            )}
            <div className="cs-reply-form__body">
                {parentComment && (
                    <div className="cs-reply-form__replying-to">
                        <span>Replying to</span>
                        <span className="cs-reply-form__replying-to-name">
                            @{parentComment.author.name}
                        </span>
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={inputPlaceholder}
                    disabled={disabled || isSubmitting}
                    rows={3}
                    maxLength={maxCharLimit}
                    aria-label={inputPlaceholder}
                    className={textareaClasses}
                />
                {error && <div className="cs-reply-form__error">{error}</div>}
                <div className="cs-reply-form__footer">
                    {showCharCount && maxCharLimit && (
                        <span
                            className={`cs-reply-form__char-count${isOverLimit ? ' cs-reply-form__char-count--over' : ''}`}
                        >
                            {remaining !== undefined ? remaining : count}/{maxCharLimit}
                        </span>
                    )}
                    <div className="cs-reply-form__actions">
                        {onCancel && (
                            <button
                                type="button"
                                className="cs-btn cs-btn--outline cs-btn--sm"
                                onClick={handleCancel}
                                disabled={disabled || isSubmitting}
                            >
                                {texts.cancel}
                            </button>
                        )}
                        <button
                            type="button"
                            className="cs-btn cs-btn--primary cs-btn--sm"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                        >
                            {isSubmitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span className="cs-spinner" />
                                    Submitting...
                                </span>
                            ) : (
                                texts.submit
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

StyledReplyForm.displayName = 'StyledReplyForm';
