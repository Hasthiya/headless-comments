'use client';

import { useCallback, useState } from 'react';
import {
  generateUniqueId,
  type Comment,
  type CommentUser,
} from '@comment-section/react';
import { ShadcnCommentSection } from '@/components/comment-ui';
import {
  InstagramCommentItem,
  FacebookCommentItem,
  RedditReplyForm,
  InstagramReplyForm,
  FacebookReplyForm,
  RedditInlineReplyForm,
} from '@/components/comment-ui/byo';
import { themeAwareDemoTheme } from '@/lib/demo-theme';
import { cn } from '@/lib/utils';

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
      { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
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
          { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
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
      { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
    ],
  },
  {
    id: '3',
    content: 'The nested replies and reactions make it feel really polished. Great for community features!',
    author: { id: 'u4', name: 'Dana', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reactions: [
      { id: 'like', label: 'Like', emoji: '👍', count: 3, isActive: false },
      { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
      { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
    ],
    replies: [
      {
        id: '3-1',
        content: 'Same here — we shipped it in a week.',
        author: { id: 'u5', name: 'Eve' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        parentId: '3',
        reactions: [
          { id: 'like', label: 'Like', emoji: '👍', count: 1, isActive: false },
          { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
        ],
      },
    ],
  },
];

function useByoCommentState() {
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
        { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
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
        { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
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
  }, []);

  const handleReaction = useCallback((commentId: string, reactionId: string) => {
    const updateReactions = (reactions: Comment['reactions']): Comment['reactions'] => {
      const list = reactions ?? [];
      if (reactionId === 'like' || reactionId === 'dislike') {
        const like = list.find((r) => r.id === 'like');
        const dislike = list.find((r) => r.id === 'dislike');
        const ensure = (
          id: 'like' | 'dislike',
          current: (typeof list)[0] | undefined
        ) => ({
          id,
          label: id === 'dislike' ? 'Dislike' : 'Like',
          emoji: id === 'dislike' ? '👎' : '👍',
          count: current?.count ?? 0,
          isActive: current?.isActive ?? false,
        });
        let nextLike = ensure('like', like);
        let nextDislike = ensure('dislike', dislike);
        if (reactionId === 'like') {
          if (nextDislike.isActive) {
            nextDislike = { ...nextDislike, count: Math.max(0, nextDislike.count - 1), isActive: false };
          }
          nextLike = nextLike.isActive
            ? { ...nextLike, count: Math.max(0, nextLike.count - 1), isActive: false }
            : { ...nextLike, count: nextLike.count + 1, isActive: true };
        } else {
          if (nextLike.isActive) {
            nextLike = { ...nextLike, count: Math.max(0, nextLike.count - 1), isActive: false };
          }
          nextDislike = nextDislike.isActive
            ? { ...nextDislike, count: Math.max(0, nextDislike.count - 1), isActive: false }
            : { ...nextDislike, count: nextDislike.count + 1, isActive: true };
        }
        const rest = list.filter((r) => r.id !== 'like' && r.id !== 'dislike');
        return [...rest, nextLike, nextDislike];
      }
      const existing = list.find((r) => r.id === reactionId);
      if (existing) {
        return list.map((r) =>
          r.id === reactionId
            ? { ...r, count: r.count + (r.isActive ? -1 : 1), isActive: !r.isActive }
            : r
        );
      }
      return [
        ...list,
        {
          id: reactionId,
          label: reactionId === 'dislike' ? 'Dislike' : reactionId,
          emoji: reactionId === 'dislike' ? '👎' : '👍',
          count: 1,
          isActive: true,
        },
      ];
    };
    const updateComment = (c: Comment): Comment => {
      if (c.id === commentId) return { ...c, reactions: updateReactions(c.reactions) };
      if (c.replies?.length) return { ...c, replies: c.replies.map(updateComment) };
      return c;
    };
    setComments((prev) => prev.map(updateComment));
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
      return (
        updated ?? {
          id: commentId,
          content,
          author: currentUser,
          createdAt: new Date(),
          updatedAt,
          isEdited: true,
        }
      );
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

  return {
    comments,
    handleSubmitComment,
    handleReply,
    handleReaction,
    handleEdit,
    handleDelete,
  };
}

type TabId = 'reddit' | 'instagram' | 'facebook';

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: 'reddit', label: 'Reddit', description: 'Upvote / downvote strip, compact type.' },
  { id: 'instagram', label: 'Instagram', description: 'Compact rows, heart for like, minimal Reply link.' },
  { id: 'facebook', label: 'Facebook', description: 'Rounded avatars, bubble comments, Like and Reply links.' },
];

export default function BringYourOwnUIPage() {
  const [activeTab, setActiveTab] = useState<TabId>('reddit');
  const {
    comments,
    handleSubmitComment,
    handleReply,
    handleReaction,
    handleEdit,
    handleDelete,
  } = useByoCommentState();

  const commonProps = {
    comments,
    currentUser,
    onSubmitComment: handleSubmitComment,
    onReply: handleReply,
    onReaction: handleReaction,
    onEdit: handleEdit,
    onDelete: handleDelete,
    enableOptimisticUpdates: true,
    inputPlaceholder: 'Add a comment...',
    theme: themeAwareDemoTheme,
  };

  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Bring Your Own UI
        </h1>
        <p className="text-muted-foreground mb-8">
          The same headless comment engine drives three different UIs. One state, one set of
          handlers — switch tabs to see Reddit-style votes, Instagram-style hearts, and Facebook-style bubbles.
        </p>

        <div
          role="tablist"
          aria-label="Comment UI style"
          className="flex flex-wrap gap-1 p-1 rounded-lg bg-muted/60 border border-border mb-6"
        >
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              className={cn(
                'px-4 py-2.5 text-sm font-medium rounded-md transition-colors',
                activeTab === id
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pt-2">
          {activeTab === 'reddit' && (
            <div
              role="tabpanel"
              id="panel-reddit"
              aria-labelledby="tab-reddit"
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {TABS.find((t) => t.id === 'reddit')?.description}
              </p>
              <ShadcnCommentSection
                {...commonProps}
                renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
                  <RedditReplyForm
                    onSubmit={onSubmit}
                    placeholder={placeholder}
                    disabled={disabled}
                    isSubmitting={isSubmitting}
                  />
                )}
                renderInlineReplyForm={(props) => <RedditInlineReplyForm {...props} />}
                showReactions
                showMoreOptions
                includeDislike
              />
            </div>
          )}
          {activeTab === 'instagram' && (
            <div
              role="tabpanel"
              id="panel-instagram"
              aria-labelledby="tab-instagram"
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {TABS.find((t) => t.id === 'instagram')?.description}
              </p>
              <ShadcnCommentSection
                {...commonProps}
                renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
                  <InstagramReplyForm
                    onSubmit={onSubmit}
                    placeholder={placeholder}
                    disabled={disabled}
                    isSubmitting={isSubmitting}
                  />
                )}
                renderComment={(comment, props) => (
                  <InstagramCommentItem key={comment.id} {...props} comment={comment} />
                )}
                showReactions
                showMoreOptions={false}
              />
            </div>
          )}
          {activeTab === 'facebook' && (
            <div
              role="tabpanel"
              id="panel-facebook"
              aria-labelledby="tab-facebook"
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {TABS.find((t) => t.id === 'facebook')?.description}
              </p>
              <ShadcnCommentSection
                {...commonProps}
                renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
                  <FacebookReplyForm
                    onSubmit={onSubmit}
                    placeholder={placeholder}
                    disabled={disabled}
                    isSubmitting={isSubmitting}
                  />
                )}
                renderComment={(comment, props) => (
                  <FacebookCommentItem key={comment.id} {...props} comment={comment} />
                )}
                showReactions
                showMoreOptions={false}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
