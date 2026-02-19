'use client';

import { useState } from 'react';
import {
  useCommentTree,
  type Comment,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/docs/CodeBlock';

// Import all 15 UI styles
import DiscordStyle from '@/components/temp-ui-comps/DiscordStyle';
import FacebookStyle from '@/components/temp-ui-comps/FacebookStyle';
import GitHubStyle from '@/components/temp-ui-comps/GitHubStyle';
import HackerNewsStyle from '@/components/temp-ui-comps/HackerNewsStyle';
import InstagramStyle from '@/components/temp-ui-comps/InstagramStyle';
import LinkedInStyle from '@/components/temp-ui-comps/LinkedInStyle';
import MediumStyle from '@/components/temp-ui-comps/MediumStyle';
import RedditStyle from '@/components/temp-ui-comps/RedditStyle';
import SlackStyle from '@/components/temp-ui-comps/SlackStyle';
import StackOverflowStyle from '@/components/temp-ui-comps/StackOverflowStyle';
import TelegramStyle from '@/components/temp-ui-comps/TelegramStyle';
import TikTokStyle from '@/components/temp-ui-comps/TikTokStyle';
import TwitterStyle from '@/components/temp-ui-comps/TwitterStyle';
import WhatsAppStyle from '@/components/temp-ui-comps/WhatsAppStyle';
import YouTubeStyle from '@/components/temp-ui-comps/YouTubeStyle';

// Import source codes
import {
  DiscordStyle_CODE,
  FacebookStyle_CODE,
  GitHubStyle_CODE,
  HackerNewsStyle_CODE,
  InstagramStyle_CODE,
  LinkedInStyle_CODE,
  MediumStyle_CODE,
  RedditStyle_CODE,
  SlackStyle_CODE,
  StackOverflowStyle_CODE,
  TelegramStyle_CODE,
  TikTokStyle_CODE,
  TwitterStyle_CODE,
  WhatsAppStyle_CODE,
  YouTubeStyle_CODE,
} from './codes';

const currentUser: CommentUser = {
  id: 'current',
  name: 'You',
  isVerified: true,
  avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=You',
};

const TAB_IDS = [
  'reddit', 'instagram', 'facebook', 'slack',
  'discord', 'github', 'hackernews', 'linkedin',
  'medium', 'stackoverflow', 'telegram', 'tiktok',
  'twitter', 'whatsapp', 'youtube'
] as const;

type TabId = typeof TAB_IDS[number];

const TABS: { id: TabId; label: string; Component: any; Code: string }[] = [
  { id: 'discord', label: 'Discord', Component: DiscordStyle, Code: DiscordStyle_CODE },
  { id: 'facebook', label: 'Facebook', Component: FacebookStyle, Code: FacebookStyle_CODE },
  { id: 'github', label: 'GitHub', Component: GitHubStyle, Code: GitHubStyle_CODE },
  { id: 'hackernews', label: 'Hacker News', Component: HackerNewsStyle, Code: HackerNewsStyle_CODE },
  { id: 'instagram', label: 'Instagram', Component: InstagramStyle, Code: InstagramStyle_CODE },
  { id: 'linkedin', label: 'LinkedIn', Component: LinkedInStyle, Code: LinkedInStyle_CODE },
  { id: 'medium', label: 'Medium', Component: MediumStyle, Code: MediumStyle_CODE },
  { id: 'reddit', label: 'Reddit', Component: RedditStyle, Code: RedditStyle_CODE },
  { id: 'slack', label: 'Slack', Component: SlackStyle, Code: SlackStyle_CODE },
  { id: 'stackoverflow', label: 'Stack Overflow', Component: StackOverflowStyle, Code: StackOverflowStyle_CODE },
  { id: 'telegram', label: 'Telegram', Component: TelegramStyle, Code: TelegramStyle_CODE },
  { id: 'tiktok', label: 'TikTok', Component: TikTokStyle, Code: TikTokStyle_CODE },
  { id: 'twitter', label: 'Twitter', Component: TwitterStyle, Code: TwitterStyle_CODE },
  { id: 'whatsapp', label: 'WhatsApp', Component: WhatsAppStyle, Code: WhatsAppStyle_CODE },
  { id: 'youtube', label: 'YouTube', Component: YouTubeStyle, Code: YouTubeStyle_CODE },
];

/** All 7 reaction types used across all component styles */
const ALL_REACTIONS = [
  { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
  { id: 'dislike', label: 'Dislike', emoji: '👎', count: 0, isActive: false },
  { id: 'love', label: 'Love', emoji: '❤️', count: 0, isActive: false },
  { id: 'haha', label: 'Haha', emoji: '😂', count: 0, isActive: false },
  { id: 'wow', label: 'Wow', emoji: '😮', count: 0, isActive: false },
  { id: 'sad', label: 'Sad', emoji: '😢', count: 0, isActive: false },
  { id: 'angry', label: 'Angry', emoji: '😡', count: 0, isActive: false },
] as const;

const makeReactions = (overrides: Record<string, number> = {}) =>
  ALL_REACTIONS.map(r => ({ ...r, count: overrides[r.id] ?? r.count }));

/** Default reaction config for newly created comments */
const REACTION_CONFIG = ALL_REACTIONS.map(({ id, label, emoji }) => ({
  id, label, emoji, activeColor: '#f97316',
}));

/** Sample comments shared across tabs */
const initialComments: Comment[] = [
  {
    id: '1',
    content: 'This is a great example of the comment section component! It really shows how flexible the headless logic is.',
    author: { id: 'u1', name: 'Alice', isVerified: true, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Alice' },
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    reactions: makeReactions({ like: 5, love: 2, haha: 1 }),
    replies: [
      {
        id: '1-1',
        content: 'I agree, the API is very intuitive.',
        author: { id: 'u2', name: 'Bob', avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Bob' },
        createdAt: new Date(Date.now() - 1000 * 60 * 15),
        parentId: '1',
        reactions: makeReactions({ like: 2 }),
      },
    ],
  },
  {
    id: '2',
    content: 'Can I use my own validation library with this?',
    author: { id: 'u3', name: 'Charlie', isVerified: false, avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlie' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: makeReactions(),
  },
];

export default function BringYourOwnUIPage() {
  const [activeTab, setActiveTab] = useState<TabId>('reddit');

  const tree = useCommentTree({
    initialComments,
    currentUser,
    mutuallyExclusiveReactions: true,
    defaultReactions: REACTION_CONFIG,
  });

  const ActiveTab = TABS.find((t) => t.id === activeTab) || TABS[0];
  const Component = ActiveTab.Component;

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3 text-center">
          Bring Your Own UI
        </h1>
        <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto text-lg">
          One headless engine, limitless possibilities. All these examples use the exact same logic hooks,
          rendering completely different UIs from popular platforms.
        </p>

        <div className="flex flex-col gap-6">
          {/* Scrollable Tabs */}
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap gap-2 sm:justify-center custom-scrollbar">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border',
                  activeTab === id
                    ? 'bg-foreground text-background border-foreground shadow-md'
                    : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-transparent hover:border-border'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Preview Column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Preview</h3>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  Live Demo
                </div>
              </div>
              <div
                className={cn(
                  "border rounded-xl p-6 transition-all min-h-[500px] shadow-sm",
                  // Dark background container for dark-themed UIs
                  ["discord", "tiktok", "twitter", "youtube", "whatsapp", "telegram", "slack", "stackoverflow", "github", "linkedin", "facebook", "reddit"].includes(activeTab)
                    ? "bg-[#09090b]"
                    : "bg-white"
                )}
              >
                <Component key={activeTab} tree={tree} currentUser={currentUser} />
              </div>
            </div>

            {/* Code Column */}
            <div className="flex flex-col gap-4 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Source Code</h3>
                <span className="text-xs text-muted-foreground">
                  {ActiveTab.label}Style.tsx
                </span>
              </div>
              <div className="border rounded-xl overflow-hidden bg-muted/30 shadow-sm">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                  <CodeBlock key={activeTab} code={ActiveTab.Code} lang="tsx" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
