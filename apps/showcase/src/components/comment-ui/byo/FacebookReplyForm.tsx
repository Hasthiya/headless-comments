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
 * Facebook-style comment composer: rounded bubble, Facebook blue Post button.
 */
export function FacebookReplyForm({
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
    <div className="flex gap-3 py-3">
      <div
        className="h-9 w-9 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground overflow-hidden"
        aria-hidden
      >
        {currentUser?.avatarUrl ? (
          <img
            src={currentUser.avatarUrl ?? getDefaultAvatar(currentUser.name)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? texts.inputPlaceholder}
          disabled={disabled || isSubmitting}
          rows={3}
          className="min-h-[80px] max-h-[200px] resize-none focus-visible:ring-[#0866ff] focus-visible:border-[#0866ff]"
          aria-label={placeholder ?? texts.inputPlaceholder}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size="sm"
            className="min-h-[44px] sm:min-h-0 h-auto rounded-full px-4 py-2 text-sm font-semibold bg-[#0866ff] hover:bg-[#1877f2] text-white border-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
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
