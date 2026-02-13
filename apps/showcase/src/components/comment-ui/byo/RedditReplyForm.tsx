'use client';

import React, { useState, useCallback } from 'react';
import type { RenderReplyFormProps } from '@comment-section/react';
import {
  useCommentSection,
  useAutoResize,
  useEnterSubmit,
} from '@comment-section/react';
import { getDefaultAvatar } from '@comment-section/react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/**
 * Reddit-style comment composer: compact, small avatar, minimal chrome.
 */
export function RedditReplyForm({
  onSubmit,
  placeholder,
  disabled = false,
  isSubmitting = false,
}: RenderReplyFormProps) {
  const { currentUser, texts } = useCommentSection();
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 200);
  const handleSubmit = useCallback(() => {
    if (!content.trim() || isSubmitting || disabled) return;
    onSubmit(content.trim());
    setContent('');
  }, [content, isSubmitting, disabled, onSubmit]);
  const isSubmitDisabled = !content.trim() || isSubmitting || disabled;
  const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

  const initials = currentUser
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <div className="flex gap-2 py-2">
      <div
        className="h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground text-xs font-medium border border-border"
        aria-hidden
      >
        {currentUser?.avatarUrl ? (
          <img
            src={currentUser.avatarUrl ?? getDefaultAvatar(currentUser.name)}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? texts.inputPlaceholder}
          disabled={disabled || isSubmitting}
          rows={3}
          className="min-h-[80px] max-h-[200px] resize-none focus-visible:ring-orange-500 focus-visible:border-orange-500"
          aria-label={placeholder ?? texts.inputPlaceholder}
        />
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size="sm"
            className="h-auto rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                Comment
              </span>
            ) : (
              'Comment'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
