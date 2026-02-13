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
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Instagram-style comment composer: minimal, small avatar, single-line feel.
 */
export function InstagramReplyForm({
  onSubmit,
  placeholder,
  disabled = false,
  isSubmitting = false,
}: RenderReplyFormProps) {
  const { currentUser, texts } = useCommentSection();
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 120);
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
        className="h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground text-xs font-semibold border border-border overflow-hidden"
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
      <div className="flex-1 flex flex-col sm:flex-row sm:items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder ?? texts.inputPlaceholder}
          disabled={disabled || isSubmitting}
          rows={3}
          className={cn(
            'flex-1 min-h-[80px] max-h-[200px] resize-none rounded-none border-0 border-b border-border bg-transparent px-0 py-2 shadow-none w-full',
            'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/50'
          )}
          aria-label={placeholder ?? texts.inputPlaceholder}
        />
        <Button
          type="button"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
          className="flex-shrink-0 min-h-[44px] sm:min-h-0 h-auto px-3 py-1.5 text-sm font-semibold bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white border-0 rounded-md hover:opacity-90"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            'Post'
          )}
        </Button>
      </div>
    </div>
  );
}
