/**
 * Default (headless) CommentSection — Provider + minimal unstyled UI.
 * Use renderReplyForm / renderComment to supply your own UI.
 * @module @headless-comments/react/presets/default/DefaultCommentSection
 */

'use client';

import React, { useMemo } from 'react';
import type { CommentSectionProps, CommentItemProps } from '../../headless/types';
import type { Comment } from '../../core/types';
import { CommentSectionProvider } from '../../headless/CommentProvider';
import { useCommentSection } from '../../headless/useComments';
import { HeadlessReplyForm } from '../../headless/ReplyForm';
import { HeadlessCommentItem } from '../../headless/CommentItem';
import { mergeTheme } from '../../core/utils';

type CommentThemeRequired = Required<NonNullable<CommentSectionProps['theme']>>;

function MinimalCommentItem({
  comment,
  depth,
  maxDepth,
  readOnly,
}: {
  comment: Comment;
  depth: number;
  maxDepth: number;
  readOnly: boolean;
}) {
  return (
    <HeadlessCommentItem
      comment={comment}
      depth={depth}
      maxDepth={maxDepth}
    >
      {({ comment: c, edit, reply, isAuthor, showReplies, toggleReplies, deleteComment: onDelete }) => (
        <div style={{ marginLeft: depth * 16, marginTop: 8, padding: 8, border: '1px solid #eee' }}>
          <div style={{ fontSize: 12, color: '#666' }}>{c.author.name}</div>
          <div style={{ marginTop: 4 }}>{c.content}</div>
          {!readOnly && (
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={() => reply.openReply()}>Reply</button>
              {isAuthor && (
                <>
                  <button type="button" onClick={() => edit.startEditing(c.content)}>Edit</button>
                  <button type="button" onClick={onDelete}>Delete</button>
                </>
              )}
            </div>
          )}
          {(c.replies ?? []).length > 0 && depth < maxDepth && (
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={toggleReplies}>{showReplies ? 'Hide' : 'Show'} replies</button>
              {showReplies &&
                (c.replies ?? []).map((r) => (
                  <MinimalCommentItem
                    key={r.id}
                    comment={r}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    readOnly={readOnly}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </HeadlessCommentItem>
  );
}

const DefaultCommentSectionInternal: React.FC<
  Omit<CommentSectionProps, 'comments' | 'currentUser' | 'onSubmitComment'> & { internalTheme: CommentThemeRequired }
> = ({
  renderComment,
  renderReplyForm,
  renderEmpty,
  inputPlaceholder,
  readOnly = false,
  internalTheme,
  maxDepth: propMaxDepth,
  ...rest
}) => {
  const {
    comments,
    currentUser,
    submitComment,
    replyToComment,
    toggleReaction,
    editComment,
    deleteComment,
    maxDepth: contextMaxDepth,
  } = useCommentSection();
  const maxDepth = propMaxDepth ?? contextMaxDepth;

  return (
    <div style={{ fontFamily: internalTheme.fontFamily, fontSize: internalTheme.fontSize }}>
      {!readOnly && currentUser && submitComment && (
        renderReplyForm ? (
          renderReplyForm({
            onSubmit: (content) => { submitComment(content); },
            placeholder: inputPlaceholder,
            disabled: false,
          })
        ) : (
          <HeadlessReplyForm onSubmit={(content) => { submitComment(content); }}>
            {({ content, setContent, onSubmit, onCancel, onKeyDown, isSubmitting, disabled, textareaRef }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={inputPlaceholder ?? 'Add a comment...'}
                  disabled={disabled || isSubmitting}
                  rows={3}
                  style={{ padding: 8, width: '100%', minHeight: 80 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={onSubmit} disabled={disabled || isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button type="button" onClick={onCancel}>Cancel</button>
                </div>
              </div>
            )}
          </HeadlessReplyForm>
        )
      )}
      {comments.length === 0 && (renderEmpty ? renderEmpty() : <p>No comments yet. Be the first to comment.</p>)}
      {comments.length > 0 &&
        (renderComment
          ? comments.map((comment) => {
              const itemProps: CommentItemProps = {
                comment,
                currentUser: currentUser ?? null,
                onReply: replyToComment,
                onReaction: toggleReaction,
                onEdit: editComment,
                onDelete: deleteComment,
                maxDepth,
                depth: 0,
                readOnly,
                theme: rest.theme,
                locale: rest.locale,
                showReactions: rest.showReactions,
                showMoreOptions: rest.showMoreOptions,
                availableReactions: rest.availableReactions,
                showVerifiedBadge: rest.showVerifiedBadge,
                maxCommentLines: rest.maxCommentLines,
              };
              return renderComment(comment, itemProps);
            })
          : comments.map((comment) => (
              <MinimalCommentItem
                key={comment.id}
                comment={comment}
                depth={0}
                maxDepth={maxDepth}
                readOnly={readOnly}
              />
            )))}
    </div>
  );
};

export const DefaultCommentSection: React.FC<CommentSectionProps> = (props) => {
  const { theme, ...rest } = props;
  const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);
  return (
    <CommentSectionProvider
      initialComments={props.comments ?? []}
      currentUser={props.currentUser}
      tree={props.tree}
      availableReactions={props.availableReactions}
      texts={props.texts}
      theme={mergedTheme}
      locale={props.locale}
      maxDepth={props.maxDepth}
      readOnly={props.readOnly}
      generateId={props.generateId}
      sortOrder={props.sortOrder}
      onReport={props.onReport}
      includeDislike={props.includeDislike}
    >
      <DefaultCommentSectionInternal {...rest} internalTheme={mergedTheme as CommentThemeRequired} />
    </CommentSectionProvider>
  );
};

DefaultCommentSection.displayName = 'DefaultCommentSection';
