/**
 * CommentItem component for the Comment Section (default preset)
 * @module @comment-section/presets/default/CommentItem
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { CommentItemProps } from '../../headless/types';
import type { Comment } from '../../core/types';
import { useCommentSection } from '../../headless/useComments';
import { useReplyForm } from '../../headless/useReplyForm';
import { useEditMode } from '../../headless/useEditMode';
import { useReactions } from '../../headless/useReactions';
import { formatRelativeTime, cn } from '../../core/utils';
import { ShadcnAvatar } from './ShadcnAvatar';
import { ShadcnActionBar } from './ShadcnActionBar';
import { ShadcnReplyForm } from './ShadcnReplyForm';

/**
 * ShadcnCommentItem component displays a single comment with all features
 */
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
}) => {
  const context = useCommentSection();
  const texts = context.texts;
  const theme = customTheme || context.theme;
  const maxDepthValue = maxDepth ?? context.maxDepth;
  const readOnlyValue = readOnly ?? context.readOnly;
  const localeValue = locale ?? context.locale;

  // Reply form state
  const replyForm = useReplyForm();
  const editMode = useEditMode();

  // Reactions hook
  const { toggleReaction, isPending: isReactionPending } = useReactions(
    onReaction,
    context.enableOptimisticUpdates
  );

  // Show/hide replies state
  const [showReplies, setShowReplies] = useState(true);

  // Check if current user is the author
  const isAuthor = currentUser?.id === comment.author.id;

  // Handle reply click
  const handleReplyClick = useCallback(() => {
    replyForm.openReply(comment.id);
  }, [comment.id, replyForm]);

  // Handle edit click
  const handleEditClick = useCallback(() => {
    editMode.startEdit(comment.id, comment.content);
  }, [comment.id, comment.content, editMode]);

  // Handle reaction
  const handleReaction = useCallback(
    async (reactionId: string) => {
      if (!isReactionPending(comment.id, reactionId)) {
        await toggleReaction(comment.id, reactionId);
      }
    },
    [comment.id, toggleReaction, isReactionPending]
  );

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (onDelete) {
      await onDelete(comment.id);
    }
  }, [comment.id, onDelete]);

  // Handle reply submit
  const handleReplySubmit = useCallback(
    async (content: string): Promise<Comment> => {
      if (!onReply) throw new Error('onReply is required');
      const result = await onReply(comment.id, content);
      replyForm.closeReply();
      return result;
    },
    [comment.id, onReply, replyForm]
  );

  // Handle edit submit
  const handleEditSubmit = useCallback(
    async (content: string) => {
      if (onEdit) {
        await onEdit(comment.id, content);
        editMode.cancelEdit();
      }
    },
    [comment.id, onEdit, editMode]
  );

  // Format timestamp
  const formattedTime = useMemo(() => {
    if (renderTimestamp) {
      return renderTimestamp(comment.createdAt);
    }
    return formatRelativeTime(comment.createdAt, localeValue, texts);
  }, [comment.createdAt, renderTimestamp, localeValue, texts]);


  return (
    <div
      className={cn(
        "relative py-4 transition-opacity",
        comment.isPending && "opacity-70",
        comment.hasError && "border-2 border-destructive/50 rounded-lg p-2",
        className
      )}
      style={style} // Keep style for custom overrides if needed
      data-comment-id={comment.id}
    >
      {/* Reply line indicator */}
      {depth > 0 && (
        <div className={cn(
          "absolute left-[18px] top-[60px] bottom-0 w-[2px] bg-border rounded-full",
          !(depth < maxDepthValue && comment.replies && comment.replies.length > 0 && showReplies) && "hidden"
        )} />
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {renderAvatar ? (
            renderAvatar(comment.author)
          ) : (
            <ShadcnAvatar user={comment.author} size="md" />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author.name}</span>
            {showVerifiedBadge && comment.author.isVerified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[10px]" title={texts.verified}>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
            )}
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
            {comment.isEdited && <span className="text-xs text-muted-foreground italic">{texts.edited}</span>}
          </div>

          {/* Comment Content or Edit Form */}
          {editMode.isEditing && editMode.editingCommentId === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editMode.editValue}
                onChange={(e) => editMode.setEditValue(e.target.value)}
                className="w-full min-h-[80px] p-3 text-sm rounded-md border border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditSubmit(editMode.editValue)}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {texts.submit}
                </button>
                <button
                  type="button"
                  onClick={editMode.cancelEdit}
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-input bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {texts.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words text-foreground">
              {renderContent ? renderContent(comment) : comment.content}
            </div>
          )}

          {/* Error Message */}
          {comment.hasError && comment.errorMessage && (
            <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/20">
              <strong>Error:</strong> {comment.errorMessage}
              <button
                type="button"
                onClick={() => handleReplySubmit(comment.content)}
                className="ml-2 px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Custom Reactions or ActionBar */}
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
                showReactions={showReactions}
                showMoreOptions={showMoreOptions && isAuthor}
                texts={texts}
                theme={theme}
                isAuthor={isAuthor}
              />
            )
          )}

          {/* Custom Actions */}
          {renderActions && renderActions(comment)}

          {/* Reply Form */}
          {replyForm.isOpen && replyForm.activeCommentId === comment.id && (
            <div className="mt-4">
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

          {/* Toggle Replies Button */}
          {comment.replies && comment.replies.length > 0 && depth < maxDepthValue && (
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors",
                showReplies && "bg-transparent text-muted-foreground"
              )}
              onClick={() => setShowReplies(!showReplies)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn("transition-transform", showReplies && "rotate-90")}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {showReplies
                ? texts.hideReplies
                : `${texts.showReplies} (${comment.replies.length})`}
            </button>
          )}

          {/* Nested Replies */}
          {showReplies &&
            comment.replies &&
            comment.replies.length > 0 &&
            depth < maxDepthValue && (
              <div className="ml-2 mt-2 pl-4 border-l-2 border-border space-y-2">
                {comment.replies.map((reply) => (
                  <ShadcnCommentItem
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
  );
};

ShadcnCommentItem.displayName = 'ShadcnCommentItem';

export default ShadcnCommentItem;
