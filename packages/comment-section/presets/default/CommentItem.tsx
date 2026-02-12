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
import { formatRelativeTime } from '../../core/utils';
import { Avatar } from './Avatar';
import { ActionBar } from './ActionBar';
import { ReplyForm } from './ReplyForm';

/**
 * CommentItem component displays a single comment with all features
 */
export const CommentItem: React.FC<CommentItemProps> = ({
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

  // Container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    padding: `${theme.commentSpacing} 0`,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize,
    color: theme.textColor,
    opacity: comment.isPending ? 0.7 : 1,
    ...style,
  };

  // Reply indicator line style
  const replyLineStyle: React.CSSProperties = {
    position: 'absolute',
    left: '18px',
    top: '60px',
    bottom: '0',
    width: '2px',
    backgroundColor: theme.borderColor,
    borderRadius: '1px',
    display: depth < maxDepthValue && comment.replies && comment.replies.length > 0 && showReplies ? 'block' : 'none',
  };

  // Comment content wrapper
  const commentWrapperStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
  };

  // Content area styles
  const contentAreaStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  // Header styles
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  };

  // Username styles
  const usernameStyle: React.CSSProperties = {
    fontWeight: 600,
    color: theme.textColor,
    fontSize: '14px',
  };

  // Verified badge styles
  const verifiedBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: '10px',
  };

  // Timestamp styles
  const timestampStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.secondaryTextColor,
  };

  // Comment text styles
  const commentTextStyle: React.CSSProperties = {
    lineHeight: '1.5',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    color: theme.textColor,
  };

  // Edited indicator styles
  const editedStyle: React.CSSProperties = {
    fontSize: '12px',
    color: theme.secondaryTextColor,
    fontStyle: 'italic',
    marginLeft: '4px',
  };

  // Replies container styles
  const repliesContainerStyle: React.CSSProperties = {
    marginLeft: '40px',
    marginTop: '8px',
    borderLeft: `2px solid ${theme.borderColor}`,
    paddingLeft: '16px',
  };

  // Toggle replies button styles
  const toggleRepliesStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    marginTop: '8px',
    border: 'none',
    background: 'transparent',
    color: theme.primaryColor,
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: theme.borderRadius,
    transition: `background-color ${theme.animationDuration} ease`,
  };

  // Edit textarea styles
  const editTextareaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    borderRadius: theme.borderRadius,
    border: `1px solid ${theme.borderColor}`,
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    resize: 'vertical',
    outline: 'none',
    marginBottom: '8px',
  };

  // Error message styles
  const errorStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: '#fef2f2',
    border: `1px solid #fecaca`,
    borderRadius: theme.borderRadius,
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '8px',
  };

  return (
    <div
      className={`cs-comment-item ${comment.isPending ? 'cs-comment-pending' : ''} ${comment.hasError ? 'cs-comment-error' : ''} ${className}`}
      style={containerStyle}
      data-comment-id={comment.id}
    >
      {/* Reply line indicator */}
      {depth > 0 && <div style={replyLineStyle} />}

      <div style={commentWrapperStyle}>
        {/* Avatar */}
        {renderAvatar ? (
          renderAvatar(comment.author)
        ) : (
          <Avatar user={comment.author} size="md" />
        )}

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <span style={usernameStyle}>{comment.author.name}</span>
            {showVerifiedBadge && comment.author.isVerified && (
              <span style={verifiedBadgeStyle} title={texts.verified}>
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
            <span style={timestampStyle}>{formattedTime}</span>
            {comment.isEdited && <span style={editedStyle}>{texts.edited}</span>}
          </div>

          {/* Comment Content or Edit Form */}
          {editMode.isEditing && editMode.editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editMode.editValue}
                onChange={(e) => editMode.setEditValue(e.target.value)}
                style={editTextareaStyle}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleEditSubmit(editMode.editValue)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: theme.primaryColor,
                    color: '#fff',
                    border: 'none',
                    borderRadius: theme.borderRadius,
                    cursor: 'pointer',
                  }}
                >
                  {texts.submit}
                </button>
                <button
                  type="button"
                  onClick={editMode.cancelEdit}
                  style={{
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    color: theme.secondaryTextColor,
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: theme.borderRadius,
                    cursor: 'pointer',
                  }}
                >
                  {texts.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div style={commentTextStyle}>
              {renderContent ? renderContent(comment) : comment.content}
            </div>
          )}

          {/* Error Message */}
          {comment.hasError && comment.errorMessage && (
            <div style={errorStyle}>
              <strong>Error:</strong> {comment.errorMessage}
              <button
                type="button"
                onClick={() => handleReplySubmit(comment.content)}
                style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  backgroundColor: theme.primaryColor,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
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
              <ActionBar
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
            <ReplyForm
              parentComment={comment}
              currentUser={currentUser}
              onSubmit={handleReplySubmit}
              onCancel={replyForm.closeReply}
              maxCharLimit={500}
              showCharCount
              autoFocus
              theme={theme}
            />
          )}

          {/* Toggle Replies Button */}
          {comment.replies && comment.replies.length > 0 && depth < maxDepthValue && (
            <button
              type="button"
              style={toggleRepliesStyle}
              onClick={() => setShowReplies(!showReplies)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.hoverBackgroundColor ?? '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: showReplies ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: `transform ${theme.animationDuration} ease`,
                }}
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
              <div style={repliesContainerStyle}>
                {comment.replies.map((reply) => (
                  <CommentItem
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

CommentItem.displayName = 'CommentItem';

export default CommentItem;
