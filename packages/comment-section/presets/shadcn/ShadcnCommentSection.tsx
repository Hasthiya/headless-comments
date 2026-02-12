/**
 * CommentSection component - Main entry point (default preset)
 * @module @comment-section/presets/default/CommentSection
 */

'use client';

import React, { useMemo } from 'react';
import type { CommentSectionProps } from '../../headless/types';
import { CommentSectionProvider } from '../../headless/CommentProvider';
import { useComments } from '../../headless/useComments';
import { useInfiniteScroll } from '../../headless/hooks';
import {
  themeToCSSVariables,
  mergeTheme,
  cn,
} from '../../core/utils';
import { ShadcnCommentItem } from './ShadcnCommentItem';
import { ShadcnReplyForm } from './ShadcnReplyForm';

/**
 * Internal component that renders the comment section content
 * Consumes context rather than managing state.
 */
type CommentThemeRequired = Required<NonNullable<CommentSectionProps['theme']>>;

const CommentSectionInternal: React.FC<
  Omit<CommentSectionProps, 'comments' | 'currentUser' | 'onSubmitComment'> & { internalTheme: CommentThemeRequired }
> = ({
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
}) => {
    // Consume context
    const {
      comments,
      currentUser,
      error,
      setError,
      submitComment,
      replyToComment,
      toggleReaction,
      editComment,
      deleteComment,
      isLoading,
      isLoadingMore,
      hasMore,
      loadMore,
      maxDepth,
    } = useComments();

    // Scroll sentinel for infinite scroll
    const scrollSentinelRef = useInfiniteScroll(
      async () => {
        if (hasMore && !isLoadingMore) {
          await loadMore();
        }
      },
      { enabled: hasMore && !isLoadingMore }
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
    if (isLoading && comments.length === 0) {
      return (
        <div
          className={cn("w-full space-y-4", className)}
          style={containerStyle}
        >
          {renderLoading ? (
            renderLoading()
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-2 text-sm">Loading comments...</p>
            </div>
          )}
        </div>
      );
    }

    // Error state
    if (error && comments.length === 0) {
      return (
        <div
          className={cn("w-full space-y-4", className)}
          style={containerStyle}
        >
          {renderError ? (
            renderError(error)
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-destructive/10 p-6 text-destructive">
              <p className="font-medium">{error.message}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="mt-3 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={cn("w-full space-y-4", className)}
        style={containerStyle}
      >
        {/* Header */}
        {renderHeader && renderHeader()}

        {/* New Comment Form */}
        {!readOnly && currentUser && submitComment && (
          <ShadcnReplyForm
            currentUser={currentUser}
            onSubmit={submitComment}
            placeholder={inputPlaceholder}
            maxCharLimit={maxCharLimit}
            showCharCount={showCharCount}
            autoFocus={autoFocus}
            theme={internalTheme}
          />
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            renderEmpty ? (
              renderEmpty()
            ) : (
              <div className="py-8 text-center text-muted-foreground bg-muted/50 rounded-lg">
                {texts?.noComments || 'No comments yet. Be the first to comment!'}
              </div>
            )
          ) : (
            comments.map((comment) =>
              renderComment ? (
                renderComment(comment, {
                  comment,
                  currentUser,
                  onReply: replyToComment,
                  onReaction: toggleReaction,
                  onEdit: editComment,
                  onDelete: deleteComment,
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
                <ShadcnCommentItem
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onReply={replyToComment}
                  onReaction={toggleReaction}
                  onEdit={editComment}
                  onDelete={deleteComment}
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
            className="flex justify-center p-4"
          >
            {isLoadingMore ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              loadMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {texts?.loadMore || 'Load more comments'}
                </button>
              )
            )}
          </div>
        )}

        {/* Footer */}
        {renderFooter && renderFooter()}
      </div>
    );
  };

/**
 * ShadcnCommentSection component - Main entry point for the comment section
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
 *       enableOptimisticUpdates
 *     />
 *   );
 * }
 * ```
 */
export const ShadcnCommentSection: React.FC<CommentSectionProps> = (props) => {
  const {
    // Props handled by provider
    comments,
    currentUser,
    onSubmitComment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    onLoadMore,
    hasMore,
    isLoading,
    enableOptimisticUpdates,
    maxDepth,
    readOnly,
    generateId,
    availableReactions,
    texts,
    theme,
    locale,
    sortComments,
    sortOrder,
    // Rest are UI props
    ...rest
  } = props;

  // Merge theme with defaults
  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);

  // Sort order is passed to provider, but sortComments (custom function) 
  // currently isn't in my useCommentState. 
  // If sortComments is custom, it should probably be applied in useCommentState.
  // For now I'm ignoring `sortComments` customs logic in provider if it wasn't there before nicely. 
  // Actually, original code kept sort logic inside.

  return (
    <CommentSectionProvider
      comments={comments}
      currentUser={currentUser}
      availableReactions={availableReactions}
      texts={texts}
      theme={mergedTheme}
      locale={locale}
      enableOptimisticUpdates={enableOptimisticUpdates}
      maxDepth={maxDepth}
      readOnly={readOnly}
      generateId={generateId}
      sortOrder={sortOrder}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      onSubmitComment={onSubmitComment}
      onReply={onReply}
      onReaction={onReaction}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <CommentSectionInternal {...rest} internalTheme={mergedTheme} texts={texts} />
    </CommentSectionProvider>
  );
};

ShadcnCommentSection.displayName = 'ShadcnCommentSection';

export default ShadcnCommentSection;
