'use client';

import React, { useState, useCallback } from 'react';
import type { CommentItemProps } from '@headless-comments/react';
import type { Comment } from '@headless-comments/react';
import {
  useCommentSection,
  useReplyForm,
  useEditMode,
  useReactions,
  useRelativeTime,
  useClickOutside,
  formatDate,
  getDefaultAvatar,
  truncateToLines,
} from '@headless-comments/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SlackInlineReplyForm } from './InlineReplyForms';
import { MoreHorizontal } from 'lucide-react';

/** Slack brand green for links and primary actions */
const SLACK_ACCENT = '#2EB886';

function getLastReplyDate(comment: Comment): Date | null {
  const replies = comment.replies ?? [];
  if (replies.length === 0) return null;
  let latest: Date | null = null;
  const walk = (c: Comment) => {
    const d = c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt);
    if (!latest || d > latest) latest = d;
    (c.replies ?? []).forEach(walk);
  };
  replies.forEach(walk);
  return latest;
}

function getReplyAuthors(comment: Comment, max = 4): Comment['author'][] {
  const replies = comment.replies ?? [];
  const authors: Comment['author'][] = [];
  const seen = new Set<string>();
  const walk = (c: Comment) => {
    if (authors.length >= max) return;
    if (!seen.has(c.author.id)) {
      seen.add(c.author.id);
      authors.push(c.author);
    }
    (c.replies ?? []).forEach(walk);
  };
  replies.forEach(walk);
  return authors;
}

function countReplies(comment: Comment): number {
  let n = 0;
  const walk = (c: Comment) => {
    n += 1;
    (c.replies ?? []).forEach(walk);
  };
  (comment.replies ?? []).forEach(walk);
  return n;
}

/**
 * Slack-style comment item: clean layout, name + timestamp on one line,
 * message body below, thread summary with avatars, "X replies", "Last reply X ago".
 */
export const SlackCommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onReply,
  onReaction,
  onEdit,
  onDelete,
  maxDepth = 3,
  depth = 0,
  renderContent,
  renderTimestamp,
  showReactions = true,
  readOnly = false,
  locale,
  maxCommentLines = 5,
  availableReactions: availableReactionsProp,
}) => {
  const context = useCommentSection();
  const texts = context.texts;
  const maxDepthValue = maxDepth ?? context.maxDepth;
  const readOnlyValue = readOnly ?? context.readOnly;
  const localeValue = locale ?? context.locale;
  const availableReactions = availableReactionsProp ?? context.availableReactions;

  const replyForm = useReplyForm();
  const editMode = useEditMode();
  const { toggleReaction, isPending: isReactionPending } = useReactions(
    onReaction,
    context.enableOptimisticUpdates
  );
  const [showReplies, setShowReplies] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReactionPopup, setShowReactionPopup] = useState(false);
  const isAuthor = currentUser?.id === comment.author.id;

  const reactionPickerRef = useClickOutside<HTMLDivElement>(
    () => setShowReactionPopup(false),
    showReactionPopup
  );

  const commentReactions = (availableReactions ?? []).map((config) => {
    const existing = comment.reactions?.find((r) => r.id === config.id);
    return {
      id: config.id,
      label: config.label,
      emoji: config.emoji,
      count: existing?.count ?? 0,
      isActive: existing?.isActive ?? false,
    };
  });

  const totalReactionCount = commentReactions.reduce((sum, r) => sum + r.count, 0);
  const hasAnyReaction = totalReactionCount > 0;
  const topReactions = commentReactions
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const handleReplyClick = useCallback(() => replyForm.openReply(comment.id), [comment.id, replyForm]);
  const handleEditClick = useCallback(
    () => editMode.startEdit(comment.id, comment.content),
    [comment.id, comment.content, editMode]
  );
  const handleReaction = useCallback(
    (id: string) => {
      if (!isReactionPending(comment.id, id)) toggleReaction(comment.id, id);
    },
    [comment.id, toggleReaction, isReactionPending]
  );
  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(comment.id);
    setShowMoreMenu(false);
  }, [comment.id, onDelete]);
  const handleReplySubmit = useCallback(
    (content: string) => {
      if (onReply) {
        onReply(comment.id, content);
        replyForm.closeReply();
      }
    },
    [comment.id, onReply, replyForm]
  );
  const handleEditSubmit = useCallback(
    (content: string) => {
      if (onEdit) {
        onEdit(comment.id, content);
        editMode.cancelEdit();
      }
    },
    [comment.id, onEdit, editMode]
  );

  const relativeTime = useRelativeTime(comment.createdAt, localeValue, texts);
  const formattedTime = renderTimestamp ? renderTimestamp(comment.createdAt) : relativeTime;
  const [expanded, setExpanded] = useState(false);
  const { text: displayContent, isTruncated } = truncateToLines(comment.content, maxCommentLines);
  const showReadMore = isTruncated && !expanded;

  const replyCount = countReplies(comment);
  const hasReplies = replyCount > 0 && depth < maxDepthValue;
  const lastReplyDate = getLastReplyDate(comment);
  const replyAuthors = getReplyAuthors(comment, 4);

  const avatarUrl = comment.author.avatarUrl ?? getDefaultAvatar(comment.author.name);
  const initials = comment.author.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const lastReplyRelative = useRelativeTime(
    lastReplyDate ?? comment.createdAt,
    localeValue,
    texts
  );
  const lastReplyLabel = lastReplyDate ? lastReplyRelative : null;

  return (
    <div
      className={cn(
        'relative py-2 transition-opacity',
        comment.isPending && 'opacity-70',
        comment.hasError && 'rounded-lg border-2 border-destructive/50 p-2'
      )}
      data-comment-id={comment.id}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div
            className="h-9 w-9 rounded overflow-hidden flex items-center justify-center text-sm font-semibold bg-[#E8E8E8] dark:bg-muted text-foreground"
            aria-hidden
          >
            {comment.author.avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-[15px] text-foreground">
              {comment.author.name}
            </span>
            <span
              className="text-[13px] text-muted-foreground"
              title={formatDate(comment.createdAt, localeValue)}
            >
              {formattedTime}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground italic">· {texts.edited}</span>
            )}
          </div>
          <div
            className="text-[15px] text-foreground whitespace-pre-wrap break-words mt-0.5"
            aria-label={`Comment by ${comment.author.name}`}
          >
            {renderContent ? renderContent(comment) : showReadMore ? displayContent : comment.content}
            {showReadMore && (
              <button
                type="button"
                className="ml-1 text-muted-foreground hover:underline focus:outline-none focus:underline font-medium"
                style={{ color: SLACK_ACCENT }}
                onClick={() => setExpanded(true)}
                aria-label={texts.readMore}
              >
                {texts.readMore}
              </button>
            )}
          </div>

          {editMode.isEditing && editMode.editingCommentId === comment.id ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editMode.editValue}
                onChange={(e) => editMode.setEditValue(e.target.value)}
                className="min-h-[72px] text-[15px] rounded border-border"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  style={{ backgroundColor: SLACK_ACCENT }}
                  className="text-white border-0 hover:opacity-90"
                  onClick={() => handleEditSubmit(editMode.editValue)}
                >
                  {texts.submit}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={editMode.cancelEdit}
                >
                  {texts.cancel}
                </Button>
              </div>
            </div>
          ) : null}

          {!readOnlyValue && (
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {showReactions && commentReactions.length > 0 && (
                <div className="relative" ref={reactionPickerRef}>
                  <button
                    type="button"
                    className={cn(
                      'min-h-[36px] flex items-center gap-1.5 text-[13px] font-medium py-1.5 px-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1',
                      'text-muted-foreground hover:bg-muted/80'
                    )}
                    style={{ ['--tw-ring-color' as string]: SLACK_ACCENT }}
                    onClick={() => setShowReactionPopup((v) => !v)}
                    aria-haspopup="true"
                    aria-expanded={showReactionPopup}
                    aria-label={
                      hasAnyReaction
                        ? `Reactions: ${topReactions.map((r) => `${r.label} ${r.count}`).join(', ')}`
                        : 'Add reaction'
                    }
                  >
                    {hasAnyReaction ? (
                      topReactions.map((r) => (
                        <span
                          key={r.id}
                          className="inline-flex items-center gap-0.5 text-base leading-none"
                          aria-hidden
                        >
                          <span>{r.emoji}</span>
                          <span className="text-xs tabular-nums">{r.count}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground/80">Add reaction</span>
                    )}
                  </button>
                  {showReactionPopup && (
                    <div
                      className={cn(
                        'absolute left-0 z-20 flex gap-0.5 p-1.5 rounded-lg bg-popover text-popover-foreground border border-border shadow-lg max-h-[50vh] overflow-auto flex-wrap',
                        'top-full mt-1 sm:top-auto sm:mt-0 sm:bottom-full sm:mb-1'
                      )}
                      role="menu"
                      aria-label="Reactions"
                    >
                      {commentReactions.map((reaction) => (
                        <button
                          key={reaction.id}
                          type="button"
                          role="menuitem"
                          className={cn(
                            'flex items-center justify-center h-8 w-8 rounded text-lg leading-none transition-colors',
                            reaction.isActive ? 'bg-muted' : 'hover:bg-accent'
                          )}
                          onClick={() => {
                            handleReaction(reaction.id);
                            setShowReactionPopup(false);
                          }}
                          disabled={isReactionPending(comment.id, reaction.id)}
                          aria-label={reaction.label}
                          title={reaction.label}
                        >
                          {reaction.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {depth < maxDepthValue && onReply && (
                <button
                  type="button"
                  className="min-h-[36px] flex items-center py-1.5 text-[13px] font-medium hover:underline focus:outline-none"
                  style={{ color: SLACK_ACCENT }}
                  onClick={handleReplyClick}
                >
                  {texts.reply}
                </button>
              )}
              {isAuthor && (onEdit || onDelete) && (
                <div className="relative">
                  <button
                    type="button"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded text-muted-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                    onClick={() => setShowMoreMenu((v) => !v)}
                    aria-label="More options"
                    aria-expanded={showMoreMenu}
                  >
                    <MoreHorizontal className="h-4 w-4" aria-hidden />
                  </button>
                  {showMoreMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        aria-hidden
                        onClick={() => setShowMoreMenu(false)}
                      />
                      <div className="absolute left-0 top-full mt-1 py-1 min-w-[120px] rounded-lg bg-popover border border-border shadow-lg z-20">
                        {onEdit && (
                          <button
                            type="button"
                            className="w-full text-left min-h-[44px] flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent"
                            onClick={() => {
                              handleEditClick();
                              setShowMoreMenu(false);
                            }}
                          >
                            {texts.edit}
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="w-full text-left min-h-[44px] flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                            onClick={handleDelete}
                          >
                            {texts.delete}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {replyForm.isOpen && replyForm.activeCommentId === comment.id && (
            <div className="mt-3">
              <SlackInlineReplyForm
                parentComment={comment}
                currentUser={currentUser ?? undefined}
                onSubmit={handleReplySubmit}
                onCancel={replyForm.closeReply}
                placeholder={texts.replyPlaceholder}
                autoFocus
              />
            </div>
          )}

          {hasReplies && (
            <button
              type="button"
              className="mt-2 flex items-center gap-2 text-[13px] text-left w-full rounded hover:bg-muted/50 px-2 py-1.5 -mx-2"
              onClick={() => setShowReplies(!showReplies)}
              aria-expanded={showReplies}
            >
              <div className="flex -space-x-1.5 flex-shrink-0">
                {replyAuthors.slice(0, 4).map((author) => {
                  const url = author.avatarUrl ?? getDefaultAvatar(author.name);
                  const inits = author.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <div
                      key={author.id}
                      className="h-5 w-5 rounded-full overflow-hidden border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium"
                      title={author.name}
                    >
                      {url ? (
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        inits
                      )}
                    </div>
                  );
                })}
              </div>
              <span
                className="font-medium hover:underline"
                style={{ color: SLACK_ACCENT }}
              >
                {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </span>
              {lastReplyLabel && (
                <span className="text-muted-foreground">
                  Last reply {lastReplyLabel}
                </span>
              )}
            </button>
          )}

          {showReplies && hasReplies && comment.replies && (
            <div className="mt-2 pl-4 border-l-2 border-muted space-y-1">
              {comment.replies.map((reply) => (
                <SlackCommentItem
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={onReply}
                  onReaction={onReaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  maxDepth={maxDepthValue}
                  depth={depth + 1}
                  renderContent={renderContent}
                  renderTimestamp={renderTimestamp}
                  showReactions={showReactions}
                  readOnly={readOnlyValue}
                  locale={localeValue}
                  maxCommentLines={maxCommentLines}
                  availableReactions={availableReactions}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SlackCommentItem.displayName = 'SlackCommentItem';
