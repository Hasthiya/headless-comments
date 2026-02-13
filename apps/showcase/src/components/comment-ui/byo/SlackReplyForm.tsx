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

const SLACK_GREEN = '#2EB886';

/**
 * Slack-style comment composer: clean layout, Slack green Send button.
 */
export function SlackReplyForm({
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
        className="h-9 w-9 flex-shrink-0 rounded overflow-hidden bg-[#E8E8E8] dark:bg-muted flex items-center justify-center text-sm font-semibold text-foreground"
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
          className="min-h-[80px] max-h-[200px] resize-none rounded border-border focus-visible:ring-2 focus-visible:ring-offset-0"
          style={{ ['--tw-ring-color' as string]: SLACK_GREEN }}
          aria-label={placeholder ?? texts.inputPlaceholder}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size="sm"
            className="min-h-[44px] sm:min-h-0 h-auto rounded px-4 py-2 text-sm font-medium text-white border-0 hover:opacity-90"
            style={{ backgroundColor: SLACK_GREEN }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Send
              </span>
            ) : (
              'Send'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
