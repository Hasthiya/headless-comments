/**
 * ReplyForm component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ReplyForm
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ReplyFormProps } from '../../headless/types';
import { useCommentSection } from '../../headless/useComments';
import { useAutoResize, useCharacterCount, useEnterSubmit } from '../../headless/hooks';
import { cn } from '../../core/utils';
import { ShadcnAvatar } from './ShadcnAvatar';

/**
 * ShadcnReplyForm component displays a form for writing replies or new comments
 */
export const ShadcnReplyForm: React.FC<ReplyFormProps> = ({
    parentComment,
    currentUser,
    onSubmit,
    onCancel,
    placeholder,
    maxCharLimit,
    showCharCount = false,
    autoFocus = false,
    className = '',
    theme: _customTheme,
    disabled = false,
}) => {
    const context = useCommentSection();
    const texts = context.texts;
    const isSubmitting = parentComment ? context.isSubmittingReply : context.isSubmittingComment;

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

    const isSubmitDisabled = !content.trim() || isSubmitting || isOverLimit || disabled;
    const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

    const handleCancel = useCallback(() => {
        setContent('');
        setError(null);
        onCancel?.();
    }, [onCancel]);


    const inputPlaceholder =
        placeholder ||
        (parentComment
            ? texts.replyPlaceholder
            : texts.inputPlaceholder);

    return (
        <div className={cn("flex gap-3 py-3", className)}>
            {/* User Avatar */}
            {currentUser && (
                <div className="flex-shrink-0">
                    <ShadcnAvatar user={currentUser} size="md" />
                </div>
            )}

            {/* Form Content */}
            <div className="flex-1 flex flex-col gap-2">
                {/* Reply to indicator */}
                {parentComment && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span>Replying to</span>
                        <span className="text-primary font-medium">
                            @{parentComment.author.name}
                        </span>
                    </div>
                )}

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={inputPlaceholder}
                    disabled={disabled || isSubmitting}
                    className={cn(
                        "w-full min-h-[80px] p-3 text-sm rounded-md border border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
                        error && "border-destructive focus-visible:ring-destructive",
                        isOverLimit && "border-destructive focus-visible:ring-destructive"
                    )}
                    rows={3}
                    maxLength={maxCharLimit}
                    aria-label={inputPlaceholder}
                />

                {/* Error message */}
                {error && <div className="text-xs text-destructive">{error}</div>}

                {/* Footer */}
                <div className="flex items-center justify-between gap-3">
                    {/* Character count */}
                    {showCharCount && maxCharLimit && (
                        <span className={cn(
                            "text-xs text-muted-foreground",
                            isOverLimit && "text-destructive"
                        )}>
                            {remaining !== undefined ? remaining : count}/{maxCharLimit}
                        </span>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center gap-2 ml-auto">
                        {onCancel && (
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                onClick={handleCancel}
                                disabled={disabled || isSubmitting}
                            >
                                {texts.cancel}
                            </button>
                        )}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                            onClick={handleSubmit}
                            disabled={
                                disabled ||
                                isSubmitting ||
                                !content.trim() ||
                                isOverLimit
                            }
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="animate-spin"
                                    >
                                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
                                        <path d="M21 12a9 9 0 01-9 9" />
                                    </svg>
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

ShadcnReplyForm.displayName = 'ShadcnReplyForm';

export default ShadcnReplyForm;
