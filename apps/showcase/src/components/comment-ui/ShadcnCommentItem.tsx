'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { CommentItemProps } from '@comment-section/react';
import type { CommentUser, CommentTexts } from '@comment-section/react';
import {
  useCommentSection,
  useReplyForm,
  useEditMode,
  useReactions,
  useRelativeTime,
  formatDate,
  truncateToLines,
} from '@comment-section/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronUp, ChevronDown, ChevronRight } from 'lucide-react';
import { ShadcnAvatar } from './ShadcnAvatar';
import { ShadcnActionBar } from './ShadcnActionBar';
import { ShadcnReplyForm } from './ShadcnReplyForm';

function UserBadge({ author, texts }: { author: CommentUser; texts: Required<CommentTexts> }) {
  const role = author.role ?? (author.isVerified ? 'verified' : null);
  if (!role) return null;
  const label =
    role === 'verified'
      ? texts.verified
      : role === 'instructor'
        ? texts.instructor
        : role === 'moderator'
          ? texts.moderator
          : texts.staff;
  return (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]"
      title={label}
      aria-label={label}
      role="img"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </span>
  );
}

export const ShadcnCommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUser,
  onReply,
  onReaction,
  onEdit,
  onDelete,
  maxDepth = 3,
  depth = 0,
  renderContent,
  renderAvatar,
  renderReactions,
  renderActions,
  renderTimestamp,
  showReplyForm: _showReplyForm,
  showReactions = true,
  showMoreOptions = true,
  availableReactions,
  className = '',
  style = {},
  locale,
  showVerifiedBadge = true,
  readOnly = false,
  theme: customTheme,
  maxCommentLines,
}) => {
  const context = useCommentSection();
  const texts = context.texts;
  const theme = customTheme || context.theme;
  const reactions = availableReactions ?? context.availableReactions;
  const maxDepthValue = maxDepth ?? context.maxDepth;
  const readOnlyValue = readOnly ?? context.readOnly;
  const localeValue = locale ?? context.locale;

  const replyForm = useReplyForm();
  const editMode = useEditMode();
  const { toggleReaction, isPending: isReactionPending } = useReactions(
    onReaction,
    context.enableOptimisticUpdates
  );
  const [showReplies, setShowReplies] = useState(true);
  const isAuthor = currentUser?.id === comment.author.id;

  const hasVoteStrip = useMemo(() => {
    const ids = new Set(reactions.map((r) => r.id));
    return ids.has('like') && ids.has('dislike');
  }, [reactions]);

  const likeReaction = comment.reactions?.find((r) => r.id === 'like');
  const dislikeReaction = comment.reactions?.find((r) => r.id === 'dislike');
  const voteScore = (likeReaction?.count ?? 0) - (dislikeReaction?.count ?? 0);
  const isUpvoted = likeReaction?.isActive ?? false;
  const isDownvoted = dislikeReaction?.isActive ?? false;

  const handleReplyClick = useCallback(
    () => replyForm.openReply(comment.id),
    [comment.id, replyForm]
  );
  const handleEditClick = useCallback(
    () => editMode.startEdit(comment.id, comment.content),
    [comment.id, comment.content, editMode]
  );
  const handleReaction = useCallback(
    (reactionId: string) => {
      if (!isReactionPending(comment.id, reactionId)) toggleReaction(comment.id, reactionId);
    },
    [comment.id, toggleReaction, isReactionPending]
  );
  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(comment.id);
  }, [comment.id, onDelete]);
  const handleReplySubmit = useCallback(
    (content: string) => {
      if (!onReply) throw new Error('onReply is required');
      onReply(comment.id, content);
      replyForm.closeReply();
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
  const maxLines = maxCommentLines ?? 5;
  const { text: displayContent, isTruncated } = truncateToLines(comment.content, maxLines);
  const showReadMore = isTruncated && !expanded;

  const replyCount = comment.replies?.length ?? 0;
  const hasReplies = replyCount > 0 && depth < maxDepthValue;

  return (
    <div
      className={cn(
        'relative py-2 transition-opacity',
        comment.isPending && 'opacity-70',
        comment.hasError && 'border-2 border-destructive/50 rounded-lg p-2',
        className
      )}
      style={style}
      data-comment-id={comment.id}
    >
      <div className="flex gap-2">
        {/* Reddit-style vote strip (left) */}
        {hasVoteStrip && !readOnlyValue && (
          <div className="flex flex-col items-center gap-0 py-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6 text-muted-foreground hover:text-foreground',
                isUpvoted && 'text-primary'
              )}
              onClick={() => handleReaction('like')}
              disabled={isReactionPending(comment.id, 'like')}
              aria-label="Upvote"
              aria-pressed={isUpvoted}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium tabular-nums text-muted-foreground min-w-[1.5rem] text-center">
              {voteScore}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'h-6 w-6 text-muted-foreground hover:text-foreground',
                isDownvoted && 'text-primary'
              )}
              onClick={() => handleReaction('dislike')}
              disabled={isReactionPending(comment.id, 'dislike')}
              aria-label="Downvote"
              aria-pressed={isDownvoted}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Content (right): avatar + body + actions + replies */}
        <div className="flex-1 min-w-0 flex gap-2">
          <div className="flex-shrink-0 pt-0.5">
            {renderAvatar ? (
              renderAvatar(comment.author)
            ) : (
              <ShadcnAvatar user={comment.author} size="sm" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0 mb-0.5">
              <span className="font-medium text-sm text-foreground">{comment.author.name}</span>
              {showVerifiedBadge && (comment.author.isVerified || comment.author.role) && (
                <UserBadge author={comment.author} texts={texts} />
              )}
              <span
                className="text-xs text-muted-foreground cursor-help"
                title={formatDate(comment.createdAt, localeValue)}
                aria-label={`Posted at ${formatDate(comment.createdAt, localeValue)}`}
              >
                {formattedTime}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-muted-foreground italic">{texts.edited}</span>
              )}
            </div>

            {editMode.isEditing && editMode.editingCommentId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editMode.editValue}
                  onChange={(e) => editMode.setEditValue(e.target.value)}
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={() => handleEditSubmit(editMode.editValue)}>
                    {texts.submit}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={editMode.cancelEdit}>
                    {texts.cancel}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
                {renderContent
                  ? renderContent(comment)
                  : showReadMore
                    ? displayContent
                    : comment.content}
                {showReadMore && (
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto p-0 ml-1 text-xs font-medium"
                    onClick={() => setExpanded(true)}
                    aria-label={texts.readMore}
                  >
                    {texts.readMore}
                  </Button>
                )}
              </div>
            )}

            {comment.hasError && comment.errorMessage && (
              <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
                <strong>Error:</strong> {comment.errorMessage}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleReplySubmit(comment.content)}
                >
                  Retry
                </Button>
              </div>
            )}

            {renderReactions ? (
              renderReactions(comment)
            ) : (
              !readOnlyValue && (
                <ShadcnActionBar
                  comment={comment}
                  currentUser={currentUser}
                  onReply={depth < maxDepthValue ? handleReplyClick : undefined}
                  onReaction={handleReaction}
                  onEdit={isAuthor ? handleEditClick : undefined}
                  onDelete={isAuthor ? handleDelete : undefined}
                  availableReactions={availableReactions}
                  showReactions={showReactions && !hasVoteStrip}
                  showMoreOptions={showMoreOptions}
                  texts={texts}
                  theme={theme}
                  isAuthor={isAuthor}
                />
              )
            )}
            {renderActions && renderActions(comment)}

            {replyForm.isOpen && replyForm.activeCommentId === comment.id && (
              <div className="mt-3">
                <ShadcnReplyForm
                  parentComment={comment}
                  currentUser={currentUser}
                  onSubmit={handleReplySubmit}
                  onCancel={replyForm.closeReply}
                  maxCharLimit={500}
                  showCharCount
                  autoFocus
                  theme={theme}
                />
              </div>
            )}

            {hasReplies && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowReplies(!showReplies)}
                  aria-expanded={showReplies}
                >
                  <ChevronRight
                    className={cn('h-4 w-4 mr-1 transition-transform', showReplies && 'rotate-90')}
                  />
                  {showReplies ? texts.hideReplies : `${texts.showReplies} (${replyCount})`}
                </Button>
              </div>
            )}

            {showReplies && hasReplies && comment.replies && (
              <div className="mt-2 pl-4 border-l-2 border-muted space-y-1">
                {comment.replies.map((reply) => (
                  <ShadcnCommentItem
                    key={reply.id}
                    comment={reply}
                    maxCommentLines={maxCommentLines}
                    currentUser={currentUser}
                    onReply={onReply}
                    onReaction={onReaction}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    maxDepth={maxDepthValue}
                    depth={depth + 1}
                    renderContent={renderContent}
                    renderAvatar={renderAvatar}
                    renderReactions={renderReactions}
                    renderActions={renderActions}
                    renderTimestamp={renderTimestamp}
                    showReactions={showReactions}
                    showMoreOptions={showMoreOptions}
                    availableReactions={availableReactions}
                    locale={localeValue}
                    showVerifiedBadge={showVerifiedBadge}
                    readOnly={readOnlyValue}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ShadcnCommentItem.displayName = 'ShadcnCommentItem';
