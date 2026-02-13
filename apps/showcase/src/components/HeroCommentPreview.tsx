'use client';

import { useCallback, useState } from 'react';
import { generateUniqueId, type Comment, type CommentUser } from '@hasthiya_/headless-comments-react';
import { ShadcnCommentSection } from '@/components/comment-ui';
import { themeAwareDemoTheme } from '@/lib/demo-theme';

const heroUser: CommentUser = {
  id: 'hero-user',
  name: 'You',
  isVerified: true,
  avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You',
};

const heroComment: Comment[] = [
  {
    id: 'hero-1',
    content: 'Welcome to the comment section. Try replying below.',
    author: { id: 'u-hero-1', name: 'Showcase', isVerified: true, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Showcase' },
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    reactions: [],
  },
];

export function HeroCommentPreview() {
  const [comments, setComments] = useState<Comment[]>(() => heroComment);

  const handleReply = useCallback((commentId: string, content: string): Comment => {
    const newReply: Comment = {
      id: generateUniqueId(),
      content,
      author: heroUser,
      createdAt: new Date(),
      parentId: commentId,
      reactions: [],
    };
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) return { ...c, replies: [...(c.replies ?? []), newReply] };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, replies: [...(r.replies ?? []), newReply] } : r
            ),
          };
        }
        return c;
      })
    );
    return newReply;
  }, []);

  const noopSubmit = useCallback((): Comment => {
    const c: Comment = { id: generateUniqueId(), content: '', author: heroUser, createdAt: new Date(), reactions: [] };
    return c;
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <ShadcnCommentSection
        comments={comments}
        currentUser={heroUser}
        onSubmitComment={noopSubmit}
        onReply={handleReply}
        renderReplyForm={() => null}
        theme={themeAwareDemoTheme}
        showReactions={false}
        showMoreOptions={false}
        inputPlaceholder=""
      />
    </div>
  );
}

