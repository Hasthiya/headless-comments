'use client';

import React, { useMemo } from 'react';
import type { CommentSectionProps, Comment, ReplyFormProps } from '@comment-section/react';
import {
  CommentSectionProvider,
  useCommentSection,
  useInfiniteScroll,
  themeToCSSVariables,
  mergeTheme,
} from '@comment-section/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ShadcnCommentItem } from './ShadcnCommentItem';
import { ShadcnReplyForm } from './ShadcnReplyForm';
import { ShadcnCommentSkeleton } from './ShadcnCommentSkeleton';
import { Loader2 } from 'lucide-react';

type CommentThemeRequired = Required<NonNullable<CommentSectionProps['theme']>>;

const CommentSectionInternal: React.FC<
  Omit<CommentSectionProps, 'comments' | 'currentUser' | 'onSubmitComment'> & {
    internalTheme: CommentThemeRequired;
    texts?: CommentSectionProps['texts'];
    sortOrderKey?: string;
    renderInlineReplyForm?: (props: ReplyFormProps) => React.ReactNode;
  }
> = ({
  renderComment,
  renderReplyForm,
  renderInlineReplyForm,
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
  maxCommentLines,
  showCharCount = false,
  autoFocus = false,
  sortOrderKey: _sortOrderKey,
}) => {
  const {
    comments,
    currentUser,
    texts: contextTexts,
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
    isSubmittingComment,
    sortOrder,
    setSortOrder,
  } = useCommentSection();

  const scrollSentinelRef = useInfiniteScroll(
    () => { if (hasMore && !isLoadingMore) loadMore(); },
    { enabled: hasMore && !isLoadingMore }
  );

  const containerStyle: React.CSSProperties = {
    ...themeToCSSVariables(internalTheme),
    fontFamily: internalTheme.fontFamily,
    fontSize: internalTheme.fontSize,
    color: internalTheme.textColor,
    backgroundColor: internalTheme.backgroundColor,
    borderRadius: internalTheme.borderRadius,
    ...style,
  };

  if (isLoading && comments.length === 0) {
    return (
      <div className={cn('w-full space-y-4', className)} style={containerStyle}>
        {renderLoading ? renderLoading() : <ShadcnCommentSkeleton count={4} />}
      </div>
    );
  }

  if (error && comments.length === 0) {
    return (
      <div className={cn('w-full space-y-4', className)} style={containerStyle}>
        {renderError ? (
          renderError(error)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-destructive/10 p-6 text-destructive">
            <p className="font-medium">{error.message}</p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="mt-3"
              onClick={() => setError(null)}
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)} style={containerStyle}>
      {renderHeader && renderHeader()}
      {comments.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort:</span>
          <div className="flex flex-wrap gap-1">
            {(['newest', 'oldest', 'popular'] as const).map((order) => (
              <Button
                key={order}
                type="button"
                variant={sortOrder === order ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 px-2.5 text-xs"
                onClick={() => setSortOrder(order)}
                aria-label={`Sort by ${order}`}
                aria-pressed={sortOrder === order}
              >
                {order === 'newest' && contextTexts.sortNewest}
                {order === 'oldest' && contextTexts.sortOldest}
                {order === 'popular' && contextTexts.sortTop}
              </Button>
            ))}
          </div>
        </div>
      )}
      {!readOnly && currentUser && submitComment && (
        renderReplyForm ? (
          renderReplyForm({
            onSubmit: submitComment,
            placeholder: inputPlaceholder,
            disabled: false,
            isSubmitting: isSubmittingComment,
          })
        ) : (
          <ShadcnReplyForm
            currentUser={currentUser}
            onSubmit={submitComment}
            placeholder={inputPlaceholder ?? contextTexts.inputPlaceholder}
            maxCharLimit={maxCharLimit}
            showCharCount={showCharCount}
            autoFocus={autoFocus}
            theme={internalTheme}
          />
        )
      )}
      <div className="space-y-4">
        {comments.length === 0 ? (
          renderEmpty ? renderEmpty() : (
            <div className="py-8 text-center text-muted-foreground bg-muted/50 rounded-lg">{contextTexts.noComments}</div>
          )
        ) : (
          comments.map((comment: Comment) =>
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
                maxCommentLines={maxCommentLines}
                renderInlineReplyForm={renderInlineReplyForm}
              />
            )
          )
        )}
      </div>
      {hasMore && (
        <div ref={scrollSentinelRef} className="flex justify-center p-4">
          {isLoadingMore ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
          ) : (
            loadMore && (
              <Button type="button" variant="outline" size="sm" onClick={loadMore}>
                {texts?.loadMore ?? contextTexts.loadMore}
              </Button>
            )
          )}
        </div>
      )}
      {renderFooter && renderFooter()}
    </div>
  );
};

export type ShadcnCommentSectionProps = CommentSectionProps & {
  renderInlineReplyForm?: (props: ReplyFormProps) => React.ReactNode;
};

export const ShadcnCommentSection: React.FC<ShadcnCommentSectionProps> = (props) => {
  const {
    comments,
    currentUser,
    onSubmitComment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    onReport,
    onLoadMore,
    hasMore,
    isLoading,
    isSubmittingComment,
    isSubmittingReply,
    enableOptimisticUpdates,
    maxDepth,
    readOnly,
    generateId,
    availableReactions,
    includeDislike,
    texts,
    theme,
    locale,
    sortComments: _sortComments,
    sortOrder,
    sortOrderKey,
    ...rest
  } = props;

  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);

  return (
    <CommentSectionProvider
      comments={comments}
      currentUser={currentUser}
      availableReactions={availableReactions}
      includeDislike={includeDislike}
      texts={texts}
      theme={mergedTheme}
      locale={locale}
      enableOptimisticUpdates={enableOptimisticUpdates}
      maxDepth={maxDepth}
      readOnly={readOnly}
      generateId={generateId}
      sortOrder={sortOrder}
      sortOrderKey={sortOrderKey}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      isSubmittingComment={isSubmittingComment}
      isSubmittingReply={isSubmittingReply}
      onSubmitComment={onSubmitComment}
      onReply={onReply}
      onReaction={onReaction}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
    >
      <CommentSectionInternal {...rest} internalTheme={mergedTheme} texts={texts} sortOrderKey={sortOrderKey} />
    </CommentSectionProvider>
  );
};

ShadcnCommentSection.displayName = 'ShadcnCommentSection';
