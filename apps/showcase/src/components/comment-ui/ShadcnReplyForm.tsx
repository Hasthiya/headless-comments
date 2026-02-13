'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ReplyFormProps } from '@hasthiya_/headless-comments-react';
import {
  useCommentSection,
  useAutoResize,
  useCharacterCount,
  useEnterSubmit,
} from '@hasthiya_/headless-comments-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ShadcnAvatar } from './ShadcnAvatar';
import { Loader2 } from 'lucide-react';

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
    placeholder || (parentComment ? texts.replyPlaceholder : texts.inputPlaceholder);

  return (
    <div className={cn('flex gap-3 py-3', className)}>
      {currentUser && (
        <div className="flex-shrink-0">
          <ShadcnAvatar user={currentUser} size="md" />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        {parentComment && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Replying to</span>
            <span className="text-primary font-medium">@{parentComment.author.name}</span>
          </div>
        )}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={inputPlaceholder}
          disabled={disabled || isSubmitting}
          rows={3}
          maxLength={maxCharLimit}
          aria-label={inputPlaceholder}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            isOverLimit && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {error && <div className="text-xs text-destructive">{error}</div>}
        <div className="flex items-center justify-between gap-3">
          {showCharCount && maxCharLimit && (
            <span
              className={cn(
                'text-xs text-muted-foreground',
                isOverLimit && 'text-destructive'
              )}
            >
              {remaining !== undefined ? remaining : count}/{maxCharLimit}
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
                onClick={handleCancel}
                disabled={disabled || isSubmitting}
              >
                {texts.cancel}
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              className="min-h-[44px] sm:min-h-0"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                texts.submit
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ShadcnReplyForm.displayName = 'ShadcnReplyForm';

