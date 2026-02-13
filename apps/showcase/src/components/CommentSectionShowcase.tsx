'use client';

import { useState } from 'react';
import {
  CommentSection,
  StyledCommentSection,
  useCommentTree,
  type Comment,
  type CommentUser,
  type ReactionConfig,
} from '@hasthiya_/headless-comments-react';
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { ShadcnCommentSection } from '@/components/comment-ui';
import { themeAwareDemoTheme } from '@/lib/demo-theme';

type Preset = 'default' | 'shadcn' | 'styled';

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
    content: 'This is a great example of the comment section component!',
    author: {
      id: 'u1',
      name: 'Alice',
      isVerified: true,
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alice',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: makeEmojiReactions({ like: { count: 2, isActive: false }, heart: { count: 1, isActive: true } }),
    replies: [
      {
        id: '1-1',
        content: 'I agree, really easy to use.',
        author: { id: 'u2', name: 'Bob', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: '1',
        reactions: makeEmojiReactions(),
      },
    ],
  },
  {
    id: '2',
    content: 'Looking forward to trying it in my Next.js app.',
    author: { id: 'u3', name: 'Charlie', isVerified: false, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlie' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: makeEmojiReactions(),
  },
  {
    id: '3',
    content: 'The nested replies and reactions make it feel really polished. Great for community features!',
    author: { id: 'u4', name: 'Dana', isVerified: true, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Dana' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    reactions: makeEmojiReactions({ like: { count: 3, isActive: false } }),
    replies: [
      {
        id: '3-1',
        content: 'Same here — we shipped it in a week.',
        author: { id: 'u5', name: 'Eve', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Eve' },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        parentId: '3',
        reactions: makeEmojiReactions({ haha: { count: 1, isActive: false } }),
      },
    ],
  },
];

const PRESET_OPTIONS: { value: Preset; label: string }[] = [
  { value: 'styled', label: 'Styled' },
  { value: 'shadcn', label: 'Shadcn' },
  { value: 'default', label: 'Vanilla' },
];

export function CommentSectionShowcase() {
  const [preset, setPreset] = useState<Preset>('styled');

  const tree = useCommentTree({
    initialComments: sampleComments,
    currentUser,
    mutuallyExclusiveReactions: true,
  });

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-1 p-1 rounded-lg border border-border bg-muted/30 mb-4"
        role="tablist"
        aria-label="Comment preset"
      >
        {PRESET_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={preset === value}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              preset === value
                ? 'bg-background text-foreground shadow-sm border border-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setPreset(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {preset === 'default' && (
        <CommentSection
          tree={tree}
          currentUser={currentUser}
          theme={themeAwareDemoTheme}
          showReactions
          showMoreOptions
          availableReactions={emojiReactions}
          inputPlaceholder="Add a comment..."
        />
      )}

      {preset === 'shadcn' && (
        <ShadcnCommentSection
          tree={tree}
          currentUser={currentUser}
          theme={themeAwareDemoTheme}
          showReactions
          showMoreOptions
          availableReactions={emojiReactions}
          inputPlaceholder="Add a comment..."
        />
      )}

      {preset === 'styled' && (
        <StyledCommentSection
          tree={tree}
          currentUser={currentUser}
          theme={themeAwareDemoTheme}
          showReactions
          showMoreOptions
          availableReactions={emojiReactions}
          inputPlaceholder="Add a comment..."
          showSortBar={false}
        />
      )}
    </div>
  );
}
