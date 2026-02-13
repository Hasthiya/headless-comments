'use client';

import {
  StyledCommentSection,
  useCommentTree,
  type Comment,
  type CommentUser,
  type ReactionConfig,
} from '@hasthiya_/headless-comments-react';
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { themeAwareDemoTheme } from '@/lib/demo-theme';

const currentUser: CommentUser = {
  id: 'current',
  name: 'You',
  isVerified: true,
  avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You',
};

/** 5 emoji reactions */
const emojiReactions: ReactionConfig[] = [
  { id: 'like', label: 'Like', emoji: '👍' },
  { id: 'heart', label: 'Love', emoji: '❤️' },
  { id: 'haha', label: 'Laugh', emoji: '😂' },
  { id: 'wow', label: 'Wow', emoji: '😮' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
];

function makeEmojiReactions(overrides?: Partial<Record<string, { count: number; isActive: boolean }>>): Comment['reactions'] {
  return emojiReactions.map((r) => ({
    id: r.id,
    label: r.label,
    emoji: r.emoji,
    count: overrides?.[r.id]?.count ?? 0,
    isActive: overrides?.[r.id]?.isActive ?? false,
  }));
}

const sampleComments: Comment[] = [
  {
    id: '1',
    content: 'The Styled preset uses CSS variables only — no Tailwind or Radix.',
    author: { id: 'u1', name: 'Alice', isVerified: true, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alice' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: makeEmojiReactions({ like: { count: 1, isActive: false } }),
    replies: [
      {
        id: '1-1',
        content: 'Perfect for dropping into any stack.',
        author: { id: 'u2', name: 'Bob', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: '1',
        reactions: makeEmojiReactions(),
      },
    ],
  },
  {
    id: '2',
    content: 'Theme it with --cs-primary-color, --cs-bg-color, and more.',
    author: { id: 'u3', name: 'Charlie', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlie' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    reactions: makeEmojiReactions(),
  },
];

export function StyledDemo() {
  const tree = useCommentTree({
    initialComments: sampleComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  return (
    <div className="rounded-lg bg-background overflow-hidden">
      <StyledCommentSection
        tree={tree}
        currentUser={currentUser}
        theme={themeAwareDemoTheme}
        showSortBar={false}
        showReactions
        showMoreOptions
        availableReactions={emojiReactions}
        inputPlaceholder="Add a comment..."
      />
    </div>
  );
}
