'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ReplyFormProps } from '@hasthiya_/headless-comments-react';
import {
  useCommentSection,
  useAutoResize,
  useEnterSubmit,
} from '@hasthiya_/headless-comments-react';
import { getDefaultAvatar } from '@hasthiya_/headless-comments-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function avatarInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/** Reddit-style inline reply form (ReplyFormProps): orange ring/border, pill button. */
export function RedditInlineReplyForm({
  parentComment,
  currentUser,
  onSubmit,
  onCancel,
  placeholder,
  autoFocus = false,
  disabled = false,
  className = '',
}: ReplyFormProps) {
  const { texts } = useCommentSection();
  const isSubmitting = false;
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 200);
  const handleSubmit = useCallback(() => {
    if (!content.trim() || isSubmitting || disabled) return;
    onSubmit(content.trim());
    setContent('');
    onCancel?.();
  }, [content, isSubmitting, disabled, onSubmit, onCancel]);
  const isSubmitDisabled = !content.trim() || isSubmitting || disabled;
  const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus, textareaRef]);

  const inputPlaceholder = placeholder ?? texts.replyPlaceholder;
  const initials = currentUser ? avatarInitials(currentUser.name) : '';
  const avatarUrl = currentUser?.avatarUrl ?? (currentUser ? getDefaultAvatar(currentUser.name) : null);

  return (
    <div className={cn('flex gap-2 py-2', className)}>
      {currentUser && (
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground text-xs font-medium border border-border overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-1.5">
        {parentComment && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Replying to</span>
            <span className="text-orange-500 font-medium">@{parentComment.author.name}</span>
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
          className="min-h-[80px] max-h-[200px] resize-none focus-visible:ring-orange-500 focus-visible:border-orange-500"
          aria-label={inputPlaceholder}
        />
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" onClick={onCancel} disabled={disabled || isSubmitting}>
              {texts.cancel}
            </Button>
          )}
          <Button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size="sm"
            className="min-h-[44px] sm:min-h-0 h-auto rounded-full px-4 py-1.5 text-xs font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                {texts.submit}
              </span>
            ) : (
              texts.submit
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Instagram-style inline reply form: underline input, Post link. */
export function InstagramInlineReplyForm({
  parentComment,
  currentUser,
  onSubmit,
  onCancel,
  placeholder,
  autoFocus = false,
  disabled = false,
  className = '',
}: ReplyFormProps) {
  const { texts } = useCommentSection();
  const isSubmitting = false;
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 200);
  const handleSubmit = useCallback(() => {
    if (!content.trim() || isSubmitting || disabled) return;
    onSubmit(content.trim());
    setContent('');
    onCancel?.();
  }, [content, isSubmitting, disabled, onSubmit, onCancel]);
  const isSubmitDisabled = !content.trim() || isSubmitting || disabled;
  const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus, textareaRef]);

  const inputPlaceholder = placeholder ?? texts.replyPlaceholder;
  const initials = currentUser ? avatarInitials(currentUser.name) : '';
  const avatarUrl = currentUser?.avatarUrl ?? (currentUser ? getDefaultAvatar(currentUser.name) : null);

  return (
    <div className={cn('flex gap-3 py-3', className)}>
      {currentUser && (
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-foreground text-xs font-semibold border border-border overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        {parentComment && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Replying to</span>
            <span className="font-medium bg-gradient-to-r from-[#E1306C] to-[#F77737] bg-clip-text text-transparent">@{parentComment.author.name}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={inputPlaceholder}
            disabled={disabled || isSubmitting}
            rows={3}
            className={cn(
              'flex-1 min-h-[80px] max-h-[200px] resize-none rounded-none border-0 border-b border-border bg-transparent px-0 py-2 shadow-none w-full',
              'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/50'
            )}
            aria-label={inputPlaceholder}
          />
          <div className="flex items-center gap-2 flex-shrink-0 pb-2 sm:pb-2">
            {onCancel && (
              <Button type="button" variant="link" size="sm" className="min-h-[44px] sm:min-h-0 text-muted-foreground flex items-center" onClick={onCancel}>
                {texts.cancel}
              </Button>
            )}
            <Button
              type="button"
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
              className="min-h-[44px] sm:min-h-0 h-auto px-3 py-1.5 text-sm font-semibold bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white border-0 rounded-md hover:opacity-90"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Facebook-style inline reply form: Facebook blue ring, blue Comment button. */
export function FacebookInlineReplyForm({
  parentComment,
  currentUser,
  onSubmit,
  onCancel,
  placeholder,
  autoFocus = false,
  disabled = false,
  className = '',
}: ReplyFormProps) {
  const { texts } = useCommentSection();
  const isSubmitting = false;
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 200);
  const handleSubmit = useCallback(() => {
    if (!content.trim() || isSubmitting || disabled) return;
    onSubmit(content.trim());
    setContent('');
    onCancel?.();
  }, [content, isSubmitting, disabled, onSubmit, onCancel]);
  const isSubmitDisabled = !content.trim() || isSubmitting || disabled;
  const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus, textareaRef]);

  const inputPlaceholder = placeholder ?? texts.replyPlaceholder;
  const initials = currentUser ? avatarInitials(currentUser.name) : '';
  const avatarUrl = currentUser?.avatarUrl ?? (currentUser ? getDefaultAvatar(currentUser.name) : null);

  return (
    <div className={cn('flex gap-3 py-3', className)}>
      {currentUser && (
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        {parentComment && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Replying to</span>
            <span className="text-[#0866ff] dark:text-[#8b9dc3] font-medium">@{parentComment.author.name}</span>
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
          className="min-h-[80px] max-h-[200px] resize-none focus-visible:ring-[#0866ff] focus-visible:border-[#0866ff]"
          aria-label={inputPlaceholder}
        />
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" onClick={onCancel} disabled={disabled || isSubmitting}>
              {texts.cancel}
            </Button>
          )}
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
                {texts.submit}
              </span>
            ) : (
              texts.submit
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Slack-style inline reply form: Slack green accent, clean input. */
export function SlackInlineReplyForm({
  parentComment,
  currentUser,
  onSubmit,
  onCancel,
  placeholder,
  autoFocus = false,
  disabled = false,
  className = '',
}: ReplyFormProps) {
  const { texts } = useCommentSection();
  const isSubmitting = false;
  const [content, setContent] = useState('');
  const textareaRef = useAutoResize(content, 200);
  const handleSubmit = useCallback(() => {
    if (!content.trim() || isSubmitting || disabled) return;
    onSubmit(content.trim());
    setContent('');
    onCancel?.();
  }, [content, isSubmitting, disabled, onSubmit, onCancel]);
  const isSubmitDisabled = !content.trim() || isSubmitting || disabled;
  const onKeyDown = useEnterSubmit(handleSubmit, isSubmitDisabled);

  useEffect(() => {
    if (autoFocus && textareaRef.current) textareaRef.current.focus();
  }, [autoFocus, textareaRef]);

  const inputPlaceholder = placeholder ?? texts.replyPlaceholder;
  const initials = currentUser ? avatarInitials(currentUser.name) : '';
  const avatarUrl = currentUser?.avatarUrl ?? (currentUser ? getDefaultAvatar(currentUser.name) : null);
  const SLACK_GREEN = '#2EB886';

  return (
    <div className={cn('flex gap-3 py-3', className)}>
      {currentUser && (
        <div className="h-9 w-9 flex-shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      )}
      <div className="flex-1 flex flex-col gap-2">
        {parentComment && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Replying to</span>
            <span className="font-medium" style={{ color: SLACK_GREEN }}>
              @{parentComment.author.name}
            </span>
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
          className="min-h-[80px] max-h-[200px] resize-none rounded border-border focus-visible:ring-2 focus-visible:ring-offset-0"
          style={{ ['--tw-ring-color' as string]: SLACK_GREEN }}
          aria-label={inputPlaceholder}
        />
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" className="min-h-[44px] sm:min-h-0" onClick={onCancel} disabled={disabled || isSubmitting}>
              {texts.cancel}
            </Button>
          )}
          <Button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            size="sm"
            className="min-h-[44px] sm:min-h-0 h-auto px-4 py-2 text-sm font-medium text-white border-0 rounded hover:opacity-90"
            style={{ backgroundColor: SLACK_GREEN }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {texts.submit}
              </span>
            ) : (
              texts.submit
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

