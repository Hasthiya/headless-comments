'use client';

import React, { useState, useCallback } from 'react';
import type { CommentItemProps } from '@comment-section/react';
import {
  useCommentSection,
  useReplyForm,
  useEditMode,
  useReactions,
  useRelativeTime,
  formatDate,
  getDefaultAvatar,
  truncateToLines,
} from '@comment-section/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FacebookInlineReplyForm } from './InlineReplyForms';
import { ThumbsUp, MoreHorizontal } from 'lucide-react';

/**
 * Facebook-style comment item: rounded avatars, blue "Like" / "Reply" link-style actions.
 * Uses headless hooks; same data contract as CommentItemProps.
 */
export const FacebookCommentItem: React.FC<CommentItemProps> = ({
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
}) => {
  const context = useCommentSection();
  const texts = context.texts;
  const maxDepthValue = maxDepth ?? context.maxDepth;
  const readOnlyValue = readOnly ?? context.readOnly;
  const localeValue = locale ?? context.locale;

  const replyForm = useReplyForm();
  const editMode = useEditMode();
  const { toggleReaction, isPending: isReactionPending } = useReactions(
    onReaction,
    context.enableOptimisticUpdates
  );
  const [showReplies, setShowReplies] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const isAuthor = currentUser?.id === comment.author.id;

  const likeReaction = comment.reactions?.find((r) => r.id === 'like');
  const likeCount = likeReaction?.count ?? 0;
  const isLiked = likeReaction?.isActive ?? false;

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

  const replyCount = comment.replies?.length ?? 0;
  const hasReplies = replyCount > 0 && depth < maxDepthValue;

  const avatarUrl = comment.author.avatarUrl ?? getDefaultAvatar(comment.author.name);
  const initials = comment.author.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
            className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center text-sm font-semibold bg-muted text-foreground"
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
          <div className="inline-flex flex-wrap items-center gap-x-1 rounded-2xl bg-muted px-3 py-2">
            <span className="font-semibold text-[15px] text-foreground">
              {comment.author.name}
            </span>
            <span
              className="text-[15px] text-foreground whitespace-pre-wrap break-words"
              aria-label={`Comment by ${comment.author.name}`}
            >
              {renderContent ? renderContent(comment) : showReadMore ? displayContent : comment.content}
              {showReadMore && (
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-foreground hover:underline focus:outline-none focus:underline font-medium"
                  onClick={() => setExpanded(true)}
                  aria-label={texts.readMore}
                >
                  {texts.readMore}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 ml-1">
            <span
              className="text-xs text-muted-foreground cursor-default"
              title={formatDate(comment.createdAt, localeValue)}
            >
              {formattedTime}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground italic">· {texts.edited}</span>
            )}
          </div>

          {editMode.isEditing && editMode.editingCommentId === comment.id ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={editMode.editValue}
                onChange={(e) => editMode.setEditValue(e.target.value)}
                className="min-h-[72px] text-[15px] rounded-2xl border-border"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleEditSubmit(editMode.editValue)}
                >
                  {texts.submit}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border"
                  onClick={editMode.cancelEdit}
                >
                  {texts.cancel}
                </Button>
              </div>
            </div>
          ) : null}

          {!readOnlyValue && (
            <div className="flex items-center gap-4 mt-1 ml-1">
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0866ff] focus:ring-offset-1 rounded',
                  isLiked
                    ? 'text-[#0866ff] dark:text-[#8b9dc3]'
                    : 'text-muted-foreground hover:text-[#0866ff] dark:hover:text-[#8b9dc3]'
                )}
                onClick={() => handleReaction('like')}
                disabled={isReactionPending(comment.id, 'like')}
                aria-label={isLiked ? 'Unlike' : 'Like'}
                aria-pressed={isLiked}
              >
                <ThumbsUp
                  className={cn('h-3.5 w-3.5', isLiked && 'fill-current')}
                  aria-hidden
                />
                {likeCount > 0 && <span>Like</span>}
                {likeCount > 0 && <span className="text-muted-foreground">·</span>}
                {likeCount > 0 && <span>{likeCount}</span>}
              </button>
              {depth < maxDepthValue && onReply && (
                <button
                  type="button"
                  className="text-[13px] font-semibold text-muted-foreground hover:text-[#0866ff] dark:hover:text-[#8b9dc3] focus:outline-none focus:underline"
                  onClick={handleReplyClick}
                >
                  {texts.reply}
                </button>
              )}
              {isAuthor && (onEdit || onDelete) && (
                <div className="relative">
                  <button
                    type="button"
                    className="p-1 rounded-full text-muted-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
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
                            className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent"
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
                            className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
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
              <FacebookInlineReplyForm
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
            <div className="mt-2">
              <button
                type="button"
                className="text-[13px] font-semibold text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                onClick={() => setShowReplies(!showReplies)}
                aria-expanded={showReplies}
              >
                {showReplies ? texts.hideReplies : `${texts.showReplies} (${replyCount})`}
              </button>
            </div>
          )}

          {showReplies && hasReplies && comment.replies && (
            <div className="mt-2 pl-4 space-y-1">
              {comment.replies.map((reply) => (
                <FacebookCommentItem
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FacebookCommentItem.displayName = 'FacebookCommentItem';
