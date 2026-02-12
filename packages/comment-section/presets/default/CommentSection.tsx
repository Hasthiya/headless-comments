/**
 * CommentSection component - Main entry point (default preset)
 * @module @comment-section/presets/default/CommentSection
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { CommentSectionProps } from '../../headless/types';
import type { Comment } from '../../core/types';
import { CommentSectionProvider } from '../../headless/CommentProvider';
import { useOptimisticUpdates } from '../../headless/useOptimisticUpdates';
import { useInfiniteScroll } from '../../headless/hooks';
import { sortComments } from '../../core/sorting';
import {
  themeToCSSVariables,
  generateUniqueId,
  defaultReactions,
  mergeTheme,
} from '../../core/utils';
import { CommentItem } from './CommentItem';
import { ReplyForm } from './ReplyForm';

/**
 * Internal component that renders the comment section content
 */
type CommentThemeRequired = Required<NonNullable<CommentSectionProps['theme']>>;

const CommentSectionInternal: React.FC<
  CommentSectionProps & { internalTheme: CommentThemeRequired }
> = ({
  comments: externalComments,
  currentUser,
  onSubmitComment,
  onReply,
  onReaction,
  onEdit,
  onDelete,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  maxDepth = 3,
  renderComment,
  renderContent,
  renderAvatar,
  renderReactions,
  renderActions,
  renderTimestamp,
  renderEmpty,
  renderLoading,
  renderError,
  renderHeader,
  renderFooter,
  showReactions = true,
  showMoreOptions = true,
  availableReactions,
  className = '',
  style = {},
  locale = 'en',
  showVerifiedBadge = true,
  texts,
  readOnly = false,
  internalTheme,
  inputPlaceholder,
  maxCharLimit,
  showCharCount = false,
  autoFocus = false,
  sortOrder = 'newest',
  enableOptimisticUpdates = true,
  generateId = generateUniqueId,
}) => {
    // Optimistic updates state
    const optimistic = useOptimisticUpdates<Comment>(externalComments);

    // Loading more state
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Scroll sentinel for infinite scroll
    const scrollSentinelRef = useInfiniteScroll(
      async () => {
        if (hasMore && onLoadMore && !isLoadingMore) {
          setIsLoadingMore(true);
          try {
            await onLoadMore();
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { enabled: hasMore && !isLoadingMore }
    );



    // Sort comments
    const sortedComments = useMemo(() => {
      const commentsToSort = enableOptimisticUpdates ? optimistic.data : externalComments;
      return sortComments(commentsToSort, sortOrder);
    }, [enableOptimisticUpdates, optimistic.data, externalComments, sortOrder]);

    // Handle new comment submission
    const handleSubmitComment = useCallback(
      async (content: string): Promise<Comment> => {
        if (!onSubmitComment) throw new Error('onSubmitComment is required');
        setError(null);

        if (enableOptimisticUpdates && currentUser) {
          const optimisticComment: Comment = {
            id: generateId(),
            content,
            author: currentUser,
            createdAt: new Date(),
            reactions: defaultReactions.map((r) => ({
              id: r.id,
              label: r.label,
              emoji: r.emoji,
              count: 0,
              isActive: false,
            })),
            isPending: true,
            replies: [],
          };

          optimistic.add(optimisticComment);

          try {
            const result = await onSubmitComment(content);
            optimistic.update(optimisticComment.id, {
              ...result,
              isPending: false,
            });
            optimistic.confirm();
            return result;
          } catch (err) {
            optimistic.update(optimisticComment.id, {
              isPending: false,
              hasError: true,
              errorMessage: err instanceof Error ? err.message : 'Failed to submit',
            });
            throw err;
          }
        }
        return await Promise.resolve(onSubmitComment(content));
      },
      [onSubmitComment, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reply
    const handleReply = useCallback(
      async (commentId: string, content: string): Promise<Comment> => {
        if (!onReply) throw new Error('onReply is required');

        if (enableOptimisticUpdates && currentUser) {
          const optimisticReply: Comment = {
            id: generateId(),
            content,
            author: currentUser,
            createdAt: new Date(),
            parentId: commentId,
            reactions: defaultReactions.map((r) => ({
              id: r.id,
              label: r.label,
              emoji: r.emoji,
              count: 0,
              isActive: false,
            })),
            isPending: true,
            replies: [],
          };

          optimistic.add(optimisticReply);

          try {
            const result = await onReply(commentId, content);
            optimistic.update(optimisticReply.id, {
              ...result,
              isPending: false,
            });
            optimistic.confirm();
            return result;
          } catch (err) {
            optimistic.update(optimisticReply.id, {
              isPending: false,
              hasError: true,
              errorMessage: err instanceof Error ? err.message : 'Failed to submit reply',
            });
            throw err;
          }
        }
        return onReply(commentId, content);
      },
      [onReply, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reaction
    const handleReaction = useCallback(
      async (commentId: string, reactionId: string) => {
        if (!onReaction) return;

        // Optimistic update
        if (enableOptimisticUpdates) {
          const comment = optimistic.data.find((c) => c.id === commentId);
          if (comment) {
            const updatedReactions = comment.reactions?.map((r) => {
              if (r.id === reactionId) {
                return {
                  ...r,
                  count: r.isActive ? r.count - 1 : r.count + 1,
                  isActive: !r.isActive,
                };
              }
              return r;
            });
            optimistic.update(commentId, { reactions: updatedReactions });
          }
        }

        try {
          await onReaction(commentId, reactionId);
          if (enableOptimisticUpdates) {
            optimistic.confirm();
          }
        } catch (err) {
          if (enableOptimisticUpdates) {
            optimistic.rollback();
          }
          setError(err instanceof Error ? err : new Error('Failed to react'));
        }
      },
      [onReaction, enableOptimisticUpdates, optimistic]
    );

    // Handle edit
    const handleEdit = useCallback(
      async (commentId: string, content: string): Promise<Comment> => {
        if (!onEdit) throw new Error('onEdit is required');

        if (enableOptimisticUpdates) {
          optimistic.update(commentId, { content, isEdited: true, isPending: true });
        }

        try {
          const result = await onEdit(commentId, content);
          if (enableOptimisticUpdates) {
            optimistic.update(commentId, { ...result, isPending: false });
            optimistic.confirm();
          }
          return result;
        } catch (err) {
          if (enableOptimisticUpdates) {
            optimistic.rollback();
          }
          setError(err instanceof Error ? err : new Error('Failed to edit'));
          throw err;
        }
      },
      [onEdit, enableOptimisticUpdates, optimistic]
    );

    // Handle delete
    const handleDelete = useCallback(
      async (commentId: string) => {
        if (!onDelete) return;

        if (enableOptimisticUpdates) {
          optimistic.remove(commentId);
        }

        try {
          await onDelete(commentId);
          if (enableOptimisticUpdates) {
            optimistic.confirm();
          }
        } catch (err) {
          if (enableOptimisticUpdates) {
            optimistic.rollback();
          }
          setError(err instanceof Error ? err : new Error('Failed to delete'));
        }
      },
      [onDelete, enableOptimisticUpdates, optimistic]
    );

    // Container styles
    const containerStyle: React.CSSProperties = {
      ...themeToCSSVariables(internalTheme),
      fontFamily: internalTheme.fontFamily,
      fontSize: internalTheme.fontSize,
      color: internalTheme.textColor,
      backgroundColor: internalTheme.backgroundColor,
      borderRadius: internalTheme.borderRadius,
      ...style,
    };

    // Loading state
    if (isLoading && sortedComments.length === 0) {
      return (
        <div className={`cs-comment-section ${className}`} style={containerStyle}>
          {renderLoading ? (
            renderLoading()
          ) : (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: internalTheme.secondaryTextColor,
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  border: `2px solid ${internalTheme.borderColor}`,
                  borderTopColor: internalTheme.primaryColor,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <p style={{ marginTop: '12px' }}>Loading comments...</p>
            </div>
          )}
        </div>
      );
    }

    // Error state
    if (error && sortedComments.length === 0) {
      return (
        <div className={`cs-comment-section ${className}`} style={containerStyle}>
          {renderError ? (
            renderError(error)
          ) : (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: '#ef4444',
                backgroundColor: '#fef2f2',
                borderRadius: internalTheme.borderRadius,
              }}
            >
              <p>{error.message}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                style={{
                  marginTop: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: internalTheme.borderRadius,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={`cs-comment-section ${className}`} style={containerStyle}>
        {/* Header */}
        {renderHeader && renderHeader()}

        {/* New Comment Form */}
        {!readOnly && currentUser && onSubmitComment && (
          <ReplyForm
            currentUser={currentUser}
            onSubmit={handleSubmitComment}
            placeholder={inputPlaceholder}
            maxCharLimit={maxCharLimit}
            showCharCount={showCharCount}
            autoFocus={autoFocus}
            theme={internalTheme}
          />
        )}

        {/* Comments List */}
        <div className="cs-comments-list" style={{ marginTop: '16px' }}>
          {sortedComments.length === 0 ? (
            renderEmpty ? (
              renderEmpty()
            ) : (
              <div
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: internalTheme.secondaryTextColor,
                  backgroundColor: internalTheme.hoverBackgroundColor,
                  borderRadius: internalTheme.borderRadius,
                }}
              >
                {texts?.noComments || 'No comments yet. Be the first to comment!'}
              </div>
            )
          ) : (
            sortedComments.map((comment) =>
              renderComment ? (
                renderComment(comment, {
                  comment,
                  currentUser,
                  onReply: handleReply,
                  onReaction: handleReaction,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                  maxDepth,
                  depth: 0,
                  renderContent,
                  renderAvatar,
                  renderReactions,
                  renderActions,
                  renderTimestamp,
                  showReactions,
                  showMoreOptions,
                  availableReactions,
                  locale,
                  showVerifiedBadge,
                  readOnly,
                  theme: internalTheme,
                })
              ) : (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onReply={handleReply}
                  onReaction={handleReaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  maxDepth={maxDepth}
                  depth={0}
                  renderContent={renderContent}
                  renderAvatar={renderAvatar}
                  renderReactions={renderReactions}
                  renderActions={renderActions}
                  renderTimestamp={renderTimestamp}
                  showReactions={showReactions}
                  showMoreOptions={showMoreOptions}
                  availableReactions={availableReactions}
                  locale={locale}
                  showVerifiedBadge={showVerifiedBadge}
                  readOnly={readOnly}
                  theme={internalTheme}
                />
              )
            )
          )}
        </div>

        {/* Load More */}
        {hasMore && (
          <div
            ref={scrollSentinelRef}
            style={{
              padding: '16px',
              textAlign: 'center',
            }}
          >
            {isLoadingMore ? (
              <div
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: `2px solid ${internalTheme.borderColor}`,
                  borderTopColor: internalTheme.primaryColor,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            ) : (
              onLoadMore && (
                <button
                  type="button"
                  onClick={onLoadMore}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: internalTheme.primaryColor,
                    backgroundColor: 'transparent',
                    border: `1px solid ${internalTheme.borderColor}`,
                    borderRadius: internalTheme.borderRadius,
                    cursor: 'pointer',
                    transition: `all ${internalTheme.animationDuration} ease`,
                  }}
                >
                  {texts?.loadMore || 'Load more comments'}
                </button>
              )
            )}
          </div>
        )}

        {/* Footer */}
        {renderFooter && renderFooter()}

        {/* Global Styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cs-comment-section { box-sizing: border-box; }
        .cs-comment-section *,
        .cs-comment-section *::before,
        .cs-comment-section *::after { box-sizing: inherit; }
      `,
          }}
        />
      </div>
    );
  };

/**
 * CommentSection component - Main entry point for the comment section
 *
 * @example
 * ```tsx
 * import { CommentSection } from '@comment-section/react';
 *
 * function App() {
 *   return (
 *     <CommentSection
 *       comments={comments}
 *       currentUser={currentUser}
 *       onSubmitComment={handleSubmit}
 *       onReply={handleReply}
 *       onReaction={handleReaction}
 *       enableOptimisticUpdates
 *     />
 *   );
 * }
 * ```
 */
export const CommentSection: React.FC<CommentSectionProps> = (props) => {
  const { theme, texts, availableReactions, locale, ...rest } = props;

  // Merge theme with defaults
  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);

  return (
    <CommentSectionProvider
      currentUser={props.currentUser}
      availableReactions={availableReactions}
      texts={texts}
      theme={mergedTheme}
      locale={locale}
      enableOptimisticUpdates={props.enableOptimisticUpdates}
      maxDepth={props.maxDepth}
      readOnly={props.readOnly}
      generateId={props.generateId}
      onReply={props.onReply}
      onReaction={props.onReaction}
      onEdit={props.onEdit}
      onDelete={props.onDelete}
    >
      <CommentSectionInternal {...rest} internalTheme={mergedTheme} texts={texts} />
    </CommentSectionProvider>
  );
};

CommentSection.displayName = 'CommentSection';

export default CommentSection;
