'use client';

import { useCallback, useState } from 'react';
import {
  StyledCommentSection,
  generateUniqueId,
  type Comment,
  type CommentUser,
} from '@comment-section/react';
import '@comment-section/react/presets/styled/styles.css';
import { themeAwareDemoTheme } from '@/lib/demo-theme';

const currentUser: CommentUser = {
  id: 'current',
  name: 'You',
  isVerified: true,
};

const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'The Styled preset uses CSS variables only — no Tailwind or Radix.',
    author: { id: 'u1', name: 'Alice', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: [
      { id: 'like', label: 'Like', emoji: '👍', count: 1, isActive: false },
      { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
    ],
    replies: [
      {
        id: '1-1',
        content: 'Perfect for dropping into any stack.',
        author: { id: 'u2', name: 'Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: '1',
        reactions: [{ id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false }],
      },
    ],
  },
  {
    id: '2',
    content: 'Theme it with --cs-primary-color, --cs-bg-color, and more.',
    author: { id: 'u3', name: 'Charlie' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    reactions: [{ id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false }],
  },
];

export function StyledDemo() {
  const [comments, setComments] = useState<Comment[]>(() => sampleComments);

  const handleSubmitComment = useCallback((content: string): Comment => {
    const newComment: Comment = {
      id: generateUniqueId(),
      content,
      author: currentUser,
      createdAt: new Date(),
      reactions: [
        { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
        { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
      ],
    };
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  }, []);

  const handleReply = useCallback((commentId: string, content: string): Comment => {
    const newReply: Comment = {
      id: generateUniqueId(),
      content,
      author: currentUser,
      createdAt: new Date(),
      parentId: commentId,
      reactions: [
        { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
        { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
      ],
    };
    const addReplyTo = (list: Comment[], parentId: string): Comment[] =>
      list.map((c) => {
        if (c.id === parentId) return { ...c, replies: [...(c.replies ?? []), newReply] };
        if (c.replies) return { ...c, replies: addReplyTo(c.replies, parentId) };
        return c;
      });
    setComments((prev) => addReplyTo(prev, commentId));
    return newReply;
  }, []);

  const handleReaction = useCallback((commentId: string, reactionId: string) => {
    const toggleIn = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id !== commentId) {
          if (c.replies) return { ...c, replies: toggleIn(c.replies) };
          return c;
        }
        const reactions = (c.reactions ?? []).map((r) => {
          if (r.id !== reactionId) return r;
          const isActive = !r.isActive;
          return {
            ...r,
            count: isActive ? r.count + 1 : Math.max(0, r.count - 1),
            isActive,
          };
        });
        return { ...c, reactions };
      });
    setComments((prev) => toggleIn(prev));
  }, []);

  const handleEdit = useCallback((commentId: string, content: string): Comment => {
    let updated: Comment | null = null;
    const applyEdit = (list: Comment[]): Comment[] =>
      list.map((c) => {
        if (c.id === commentId) {
          updated = { ...c, content, updatedAt: new Date(), isEdited: true };
          return updated;
        }
        if (c.replies) return { ...c, replies: applyEdit(c.replies) };
        return c;
      });
    setComments((prev) => applyEdit(prev));
    return updated ?? { id: commentId, content, author: currentUser, createdAt: new Date(), updatedAt: new Date(), isEdited: true };
  }, []);

  const handleDelete = useCallback((commentId: string) => {
    const remove = (list: Comment[]): Comment[] =>
      list.filter((c) => c.id !== commentId).map((c) => (c.replies ? { ...c, replies: remove(c.replies) } : c));
    setComments((prev) => remove(prev));
  }, []);

  return (
    <div className="rounded-lg bg-background overflow-hidden">
      <StyledCommentSection
        comments={comments}
        currentUser={currentUser}
        onSubmitComment={handleSubmitComment}
        onReply={handleReply}
        onReaction={handleReaction}
        onEdit={handleEdit}
        onDelete={handleDelete}
        theme={themeAwareDemoTheme}
        showSortBar={false}
        showReactions
        showMoreOptions
        inputPlaceholder="Add a comment..."
        includeDislike
        enableOptimisticUpdates
      />
    </div>
  );
}
