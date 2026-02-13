'use client';

import { useState } from 'react';
import {
  useCommentTree,
  type Comment,
  type CommentUser,
  type ReactionConfig,
} from '@hasthiya_/headless-comments-react';
import { ShadcnCommentSection } from '@/components/comment-ui';
import {
  InstagramCommentItem,
  FacebookCommentItem,
  SlackCommentItem,
  RedditReplyForm,
  InstagramReplyForm,
  FacebookReplyForm,
  SlackReplyForm,
  RedditInlineReplyForm,
} from '@/components/comment-ui/byo';
import { themeAwareDemoTheme } from '@/lib/demo-theme';
import { cn } from '@/lib/utils';

const currentUser: CommentUser = {
  id: 'current',
  name: 'You',
  isVerified: true,
};

/** 5 emoji reactions for Facebook, Slack, and Instagram tabs */
const emojiReactions: ReactionConfig[] = [
  { id: 'like', label: 'Like', emoji: '👍' },
  { id: 'heart', label: 'Love', emoji: '❤️' },
  { id: 'haha', label: 'Laugh', emoji: '😂' },
  { id: 'wow', label: 'Wow', emoji: '😮' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
];

/** Helper to create the 5-emoji reaction instances for sample comments */
function makeEmojiReactions(overrides?: Partial<Record<string, { count: number; isActive: boolean }>>): Comment['reactions'] {
  return emojiReactions.map((r) => ({
    id: r.id,
    label: r.label,
    emoji: r.emoji,
    count: overrides?.[r.id]?.count ?? 0,
    isActive: overrides?.[r.id]?.isActive ?? false,
  }));
}

/** Helper to create like/dislike reaction instances for Reddit */
function makeVoteReactions(overrides?: Partial<Record<string, { count: number; isActive: boolean }>>): Comment['reactions'] {
  return [
    { id: 'like', label: 'Like', emoji: '👍', count: overrides?.like?.count ?? 0, isActive: overrides?.like?.isActive ?? false },
    { id: 'dislike', label: 'Dislike', emoji: '👎', count: overrides?.dislike?.count ?? 0, isActive: overrides?.dislike?.isActive ?? false },
  ];
}

/** Sample comments for Reddit (like/dislike) */
const redditComments: Comment[] = [
  {
    id: 'r1',
    content: 'This is a great example of the comment section component!',
    author: { id: 'u1', name: 'Alice', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: makeVoteReactions({ like: { count: 5, isActive: false } }),
    replies: [
      {
        id: 'r1-1',
        content: 'I agree, really easy to use.',
        author: { id: 'u2', name: 'Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: 'r1',
        reactions: makeVoteReactions({ like: { count: 2, isActive: false } }),
      },
    ],
  },
  {
    id: 'r2',
    content: 'Looking forward to trying it in my Next.js app.',
    author: { id: 'u3', name: 'Charlie', isVerified: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: makeVoteReactions(),
  },
  {
    id: 'r3',
    content: 'The nested replies and reactions make it feel really polished. Great for community features!',
    author: { id: 'u4', name: 'Dana', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reactions: makeVoteReactions({ like: { count: 8, isActive: false }, dislike: { count: 1, isActive: false } }),
    replies: [
      {
        id: 'r3-1',
        content: 'Same here — we shipped it in a week.',
        author: { id: 'u5', name: 'Eve' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        parentId: 'r3',
        reactions: makeVoteReactions({ like: { count: 3, isActive: false } }),
      },
    ],
  },
];

/** Sample comments for emoji-based tabs (Facebook, Slack, Instagram) */
const emojiComments: Comment[] = [
  {
    id: 'e1',
    content: 'This is a great example of the comment section component!',
    author: { id: 'u1', name: 'Alice', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: makeEmojiReactions({ like: { count: 2, isActive: false }, heart: { count: 1, isActive: true } }),
    replies: [
      {
        id: 'e1-1',
        content: 'I agree, really easy to use.',
        author: { id: 'u2', name: 'Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: 'e1',
        reactions: makeEmojiReactions(),
      },
    ],
  },
  {
    id: 'e2',
    content: 'Looking forward to trying it in my Next.js app.',
    author: { id: 'u3', name: 'Charlie', isVerified: false },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: makeEmojiReactions(),
  },
  {
    id: 'e3',
    content: 'The nested replies and reactions make it feel really polished. Great for community features!',
    author: { id: 'u4', name: 'Dana', isVerified: true },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reactions: makeEmojiReactions({ like: { count: 3, isActive: false } }),
    replies: [
      {
        id: 'e3-1',
        content: 'Same here — we shipped it in a week.',
        author: { id: 'u5', name: 'Eve' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        parentId: 'e3',
        reactions: makeEmojiReactions({ haha: { count: 1, isActive: false } }),
      },
    ],
  },
];

type TabId = 'reddit' | 'instagram' | 'facebook' | 'slack';

const TABS: { id: TabId; label: string; description: string }[] = [
  { id: 'reddit', label: 'Reddit', description: 'Upvote / downvote strip, compact type.' },
  { id: 'instagram', label: 'Instagram', description: 'Compact rows, heart for like, minimal Reply link.' },
  { id: 'facebook', label: 'Facebook', description: 'Rounded avatars, bubble comments, Like and Reply links.' },
  { id: 'slack', label: 'Slack', description: 'Clean layout, name + time, thread summary with avatars and reply count.' },
];

export default function BringYourOwnUIPage() {
  const [activeTab, setActiveTab] = useState<TabId>('reddit');

  // Separate trees per tab with mutual exclusivity
  const redditTree = useCommentTree({
    initialComments: redditComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  const instaTree = useCommentTree({
    initialComments: emojiComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  const facebookTree = useCommentTree({
    initialComments: emojiComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  const slackTree = useCommentTree({
    initialComments: emojiComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  return (
    <main className="min-h-screen">
      <section className="container mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Bring Your Own UI
        </h1>
        <p className="text-muted-foreground mb-8">
          The same headless comment engine drives four different UIs. Each tab has its own
          state — switch tabs to see Reddit-style votes, Instagram-style hearts, Facebook-style bubbles, and Slack-style threads.
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
                'min-h-[44px] px-4 py-3 sm:py-2.5 text-sm font-medium rounded-md transition-colors',
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
                tree={redditTree}
                currentUser={currentUser}
                theme={themeAwareDemoTheme}
                inputPlaceholder="Add a comment..."
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
                tree={instaTree}
                currentUser={currentUser}
                theme={themeAwareDemoTheme}
                inputPlaceholder="Add a comment..."
                availableReactions={emojiReactions}
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
                tree={facebookTree}
                currentUser={currentUser}
                theme={themeAwareDemoTheme}
                inputPlaceholder="Add a comment..."
                availableReactions={emojiReactions}
                includeDislike={false}
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
          {activeTab === 'slack' && (
            <div
              role="tabpanel"
              id="panel-slack"
              aria-labelledby="tab-slack"
              className="space-y-2"
            >
              <p className="text-sm text-muted-foreground mb-4">
                {TABS.find((t) => t.id === 'slack')?.description}
              </p>
              <ShadcnCommentSection
                tree={slackTree}
                currentUser={currentUser}
                theme={themeAwareDemoTheme}
                inputPlaceholder="Add a comment..."
                availableReactions={emojiReactions}
                includeDislike={false}
                renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
                  <SlackReplyForm
                    onSubmit={onSubmit}
                    placeholder={placeholder}
                    disabled={disabled}
                    isSubmitting={isSubmitting}
                  />
                )}
                renderComment={(comment, props) => (
                  <SlackCommentItem key={comment.id} {...props} comment={comment} />
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
