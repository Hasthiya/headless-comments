/**
 * ReplyForm component for the Comment Section (default preset)
 * @module @comment-section/presets/default/ReplyForm
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ReplyFormProps } from '../../headless/types';
import { useCommentSection } from '../../headless/useComments';
import { useAutoResize, useCharacterCount, useKeyboardShortcut } from '../../headless/hooks';
import { Avatar } from './Avatar';

/**
 * ReplyForm component displays a form for writing replies or new comments
 */
export const ReplyForm: React.FC<ReplyFormProps> = ({
    parentComment,
    currentUser,
    onSubmit,
    onCancel,
    placeholder,
    maxCharLimit,
    showCharCount = false,
    autoFocus = false,
    className = '',
    theme: customTheme,
    disabled = false,
}) => {
    const context = useCommentSection();
    const texts = context.texts;
    const theme = customTheme || context.theme;

    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const textareaRef = useAutoResize(content, 200);
    const { count, isOverLimit, remaining } = useCharacterCount(content, maxCharLimit);

    // Sync ref
    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus, textareaRef]);

    // Keyboard shortcut for submit (Ctrl/Cmd + Enter)
    useKeyboardShortcut(
        'Enter',
        () => {
            if (!isSubmitting && content.trim() && !isOverLimit) {
                handleSubmit();
            }
        },
        { ctrl: true }
    );

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

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        padding: '12px 0',
        fontFamily: theme.fontFamily,
        fontSize: theme.fontSize,
    };

    const textareaContainerStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    };

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        minHeight: '80px',
        maxHeight: '200px',
        padding: '12px 14px',
        fontSize: '14px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        borderRadius: theme.borderRadius,
        border: `1px solid ${error ? '#ef4444' : theme.borderColor}`,
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        resize: 'none',
        outline: 'none',
        transition: `border-color ${theme.animationDuration} ease`,
        boxSizing: 'border-box',
    };

    const footerStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
    };

    const buttonBaseStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'inherit',
        borderRadius: theme.borderRadius,
        border: '1px solid transparent',
        cursor: disabled || isSubmitting ? 'not-allowed' : 'pointer',
        opacity: disabled || isSubmitting ? 0.6 : 1,
        transition: `all ${theme.animationDuration} ease`,
    };

    const submitButtonStyle: React.CSSProperties = {
        ...buttonBaseStyle,
        backgroundColor: theme.primaryColor,
        color: '#ffffff',
    };

    const cancelButtonStyle: React.CSSProperties = {
        ...buttonBaseStyle,
        backgroundColor: 'transparent',
        color: theme.secondaryTextColor,
        borderColor: theme.borderColor,
    };

    const charCountStyle: React.CSSProperties = {
        fontSize: '12px',
        color: isOverLimit ? '#ef4444' : theme.secondaryTextColor,
    };

    const errorStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#ef4444',
        marginTop: '4px',
    };

    const inputPlaceholder =
        placeholder ||
        (parentComment
            ? `${texts.replyPlaceholder}`
            : 'Write a comment...');

    return (
        <div className={`cs-reply-form ${className}`} style={containerStyle}>
            {/* User Avatar */}
            {currentUser && (
                <Avatar user={currentUser} size="md" />
            )}

            {/* Form Content */}
            <div style={textareaContainerStyle}>
                {/* Reply to indicator */}
                {parentComment && (
                    <div
                        style={{
                            fontSize: '12px',
                            color: theme.secondaryTextColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}
                    >
                        <span>Replying to</span>
                        <span style={{ color: theme.primaryColor, fontWeight: 500 }}>
                            @{parentComment.author.name}
                        </span>
                    </div>
                )}

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={inputPlaceholder}
                    disabled={disabled || isSubmitting}
                    style={textareaStyle}
                    rows={3}
                    maxLength={maxCharLimit}
                    aria-label={inputPlaceholder}
                />

                {/* Error message */}
                {error && <div style={errorStyle}>{error}</div>}

                {/* Footer */}
                <div style={footerStyle}>
                    {/* Character count */}
                    {showCharCount && maxCharLimit && (
                        <span style={charCountStyle}>
                            {remaining !== undefined ? remaining : count}/{maxCharLimit}
                        </span>
                    )}

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                        {onCancel && (
                            <button
                                type="button"
                                style={cancelButtonStyle}
                                onClick={handleCancel}
                                disabled={disabled || isSubmitting}
                            >
                                {texts.cancel}
                            </button>
                        )}
                        <button
                            type="button"
                            style={submitButtonStyle}
                            onClick={handleSubmit}
                            disabled={
                                disabled ||
                                isSubmitting ||
                                !content.trim() ||
                                isOverLimit
                            }
                        >
                            {isSubmitting ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        style={{ animation: 'spin 1s linear infinite' }}
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

ReplyForm.displayName = 'ReplyForm';

export default ReplyForm;
