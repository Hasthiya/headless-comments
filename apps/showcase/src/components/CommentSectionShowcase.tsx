'use client';

import { useCallback, useState } from 'react';
import {
  CommentSection,
  defaultTheme,
  generateUniqueId,
  type Comment,
  type CommentUser,
} from '@comment-section/react';

const currentUser: CommentUser = {
  id: 'current',
  name: 'You',
  isVerified: true,
};

const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'This is a great example of the comment section component!',
    author: {
      id: 'u1',
      name: 'Alice',
      isVerified: true,
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: [
      { id: 'like', label: 'Like', emoji: '👍', count: 2, isActive: false },
      { id: 'heart', label: 'Heart', emoji: '❤️', count: 1, isActive: true },
    ],
    replies: [
      {
        id: '1-1',
        content: 'I agree, really easy to use.',
        author: { id: 'u2', name: 'Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: '1',
        reactions: [
          { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
        ],
      },
    ],
  },
  {
    id: '2',
    content: 'Looking forward to trying it in my Next.js app.',
    author: { id: 'u3', name: 'Charlie', isVerified: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: [
      { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
    ],
  },
];

export function CommentSectionShowcase() {
  const [comments, setComments] = useState<Comment[]>(sampleComments);

  const handleSubmitComment = useCallback(
    (content: string): Comment => {
      const newComment: Comment = {
        id: generateUniqueId(),
        content,
        author: currentUser,
        createdAt: new Date(),
        reactions: [
          { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
          { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
        ],
      };
      setComments((prev) => [newComment, ...prev]);
      return newComment;
    },
    []
  );

  const handleReply = useCallback(
    (commentId: string, content: string): Comment => {
      const newReply: Comment = {
        id: generateUniqueId(),
        content,
        author: currentUser,
        createdAt: new Date(),
        parentId: commentId,
        reactions: [
          { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
        ],
      };
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies ?? []), newReply] };
          }
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? { ...r, replies: [...(r.replies ?? []), newReply] }
                  : r
              ),
            };
          }
          return c;
        })
      );
      return newReply;
    },
    []
  );

  const handleReaction = useCallback((commentId: string, reactionId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const reactions = (c.reactions ?? []).map((r) =>
            r.id === reactionId
              ? {
                  ...r,
                  count: r.count + (r.isActive ? -1 : 1),
                  isActive: !r.isActive,
                }
              : r
          );
          return { ...c, reactions };
        }
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId
                ? {
                    ...r,
                    reactions: (r.reactions ?? []).map((re) =>
                      re.id === reactionId
                        ? {
                            ...re,
                            count: re.count + (re.isActive ? -1 : 1),
                            isActive: !re.isActive,
                          }
                        : re
                    ),
                  }
                : r
            ),
          };
        }
        return c;
      })
    );
  }, []);

  const handleEdit = useCallback(
    (commentId: string, content: string): Comment => {
      const updatedAt = new Date();
      const applyEdit = (list: Comment[]): { next: Comment[]; updated: Comment | null } => {
        let updated: Comment | null = null;
        const next = list.map((c) => {
          if (c.id === commentId) {
            updated = { ...c, content, updatedAt, isEdited: true };
            return updated;
          }
          if (c.replies) {
            const { next: replyNext, updated: replyUpdated } = applyEdit(c.replies);
            if (replyUpdated) updated = replyUpdated;
            return { ...c, replies: replyNext };
          }
          return c;
        });
        return { next, updated };
      };
      const { next, updated } = applyEdit(comments);
      setComments(next);
      return updated ?? { id: commentId, content, author: currentUser, createdAt: new Date(), updatedAt, isEdited: true };
    },
    [comments]
  );

  const handleDelete = useCallback((commentId: string) => {
    const remove = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c.id !== commentId)
        .map((c) => (c.replies ? { ...c, replies: remove(c.replies) } : c));
    setComments((prev) => remove(prev));
  }, []);

  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmitComment}
      onReply={handleReply}
      onReaction={handleReaction}
      onEdit={handleEdit}
      onDelete={handleDelete}
      theme={defaultTheme}
      showReactions
      showMoreOptions
      inputPlaceholder="Add a comment..."
    />
  );
}
