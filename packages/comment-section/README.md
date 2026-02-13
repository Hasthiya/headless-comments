# @hasthiya_/headless-comments-react

A headless-first React comment engine: standalone hooks, composable per-comment primitives, pluggable adapters, and optional styled presets. TypeScript-native with generic `Comment<T>` support. **Zero dependencies** (only React 18+ as peer).

![npm version](https://img.shields.io/npm/v/@hasthiya_/headless-comments-react)
![License](https://img.shields.io/npm/l/@hasthiya_/headless-comments-react)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [useCommentTree](#usecommenttree)
- [Mutually Exclusive Reactions](#mutually-exclusive-reactions)
- [Composable Hooks](#composable-hooks)
- [Adapters](#adapters)
- [Core Utilities](#core-utilities)
- [Styling](#styling)
- [Component API](#component-api)
- [Entry Points](#entry-points)
- [TypeScript Types](#typescript-types)
- [Accessibility](#accessibility)
- [Troubleshooting / FAQ](#troubleshooting--faq)
- [Browser Support](#browser-support)

## Features

- **Standalone State Management** — `useCommentTree` hook manages all comment state without a Provider
- **Mutually Exclusive Reactions** — Optional one-reaction-per-comment mode for Facebook/Reddit-style UIs
- **Optimistic Updates** — Instant UI updates with automatic rollback on adapter failure
- **Nested Replies** — Multi-level threaded conversations
- **Pluggable Adapters** — REST, in-memory, Supabase, or custom adapters for persistence
- **Composable Hooks** — Granular `useEditComment`, `useReplyTo`, `useCommentReaction` hooks
- **Generic `Comment<T>`** — Extend with custom metadata via TypeScript generics
- **Pure Core Utilities** — Framework-agnostic tree manipulation, sorting, filtering
- **Fully Themeable** — CSS variables, theme prop, render props, or bring your own UI
- **TypeScript-Native** — Full type definitions with generics throughout
- **Zero Dependencies** — Only React and React-DOM as peer dependencies

## Installation

```bash
npm install @hasthiya_/headless-comments-react
# or
yarn add @hasthiya_/headless-comments-react
# or
pnpm add @hasthiya_/headless-comments-react
```

## Quick Start

### Styled Preset (recommended)

Get a polished comment section with zero extra dependencies:

```tsx
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import {
  StyledCommentSection,
  useCommentTree,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';

const currentUser: CommentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  isVerified: true,
};

function App() {
  const tree = useCommentTree({
    initialComments: [],
    currentUser,
  });

  return (
    <StyledCommentSection
      tree={tree}
      currentUser={currentUser}
      showReactions
    />
  );
}
```

### Headless (bring your own UI)

Use the unstyled `CommentSection` with render props:

```tsx
import { CommentSection, useCommentTree } from '@hasthiya_/headless-comments-react';

function App() {
  const tree = useCommentTree({ initialComments: [], currentUser });

  return (
    <CommentSection
      tree={tree}
      currentUser={currentUser}
      showReactions
      renderReplyForm={({ onSubmit, placeholder }) => (
        <MyCustomForm onSubmit={onSubmit} placeholder={placeholder} />
      )}
    />
  );
}
```

### With a REST Adapter

Connect to your API with automatic persistence and optimistic updates:

```tsx
import {
  StyledCommentSection,
  useCommentTree,
  createRestAdapter,
} from '@hasthiya_/headless-comments-react';
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';

const adapter = createRestAdapter({
  baseUrl: '/api/comments',
  headers: { Authorization: `Bearer ${token}` },
});

function App() {
  const tree = useCommentTree({
    currentUser,
    adapter, // Comments loaded from API, mutations persisted automatically
  });

  return (
    <StyledCommentSection tree={tree} currentUser={currentUser} showReactions />
  );
}
```

## Architecture

The library is organized into three independent layers:

| Layer | Import | Description |
|-------|--------|-------------|
| **Core** | `@hasthiya_/headless-comments-react/core` | Pure functions for tree manipulation, sorting, filtering, and the adapter interface. Zero React dependency. |
| **Headless** | `@hasthiya_/headless-comments-react/headless` | React hooks and unstyled components. `useCommentTree`, composable hooks, `CommentSectionProvider`. |
| **Presets** | `@hasthiya_/headless-comments-react/presets/styled` | Ready-to-use styled components. CSS variables, no Tailwind. |

Each layer can be used independently or combined.

### Headless: complete custom comment component

End-to-end example: a minimal custom comment thread using only headless hooks (no preset). Uses `useCommentTree` for state and `HeadlessCommentItem` + `useComment` for each comment (list, reply form, edit/delete/reaction).

```tsx
import {
  useCommentTree,
  CommentSectionProvider,
  HeadlessCommentItem,
  HeadlessReplyForm,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';

const currentUser: CommentUser = {
  id: 'me',
  name: 'Me',
  avatarUrl: 'https://example.com/me.jpg',
};

function CustomCommentThread() {
  const tree = useCommentTree({ initialComments: [], currentUser });

  return (
    <CommentSectionProvider tree={tree} currentUser={currentUser}>
      <HeadlessReplyForm onSubmit={(content) => tree.addComment(content)}>
        {({ content, setContent, onSubmit }) => (
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add a comment…" />
            <button type="submit">Post</button>
          </form>
        )}
      </HeadlessReplyForm>

      {tree.comments.map((comment) => (
        <HeadlessCommentItem key={comment.id} comment={comment}>
          {({ comment: c, isAuthor, edit, reply, reaction, deleteComment, toggleReplies, showReplies }) => (
            <div style={{ marginLeft: 16 }}>
              <p>{c.content}</p>
              <span>{c.author.name}</span>
              {isAuthor && (
                <>
                  <button type="button" onClick={() => edit.startEditing()}>Edit</button>
                  {edit.isEditing ? (
                    <>
                      <input value={edit.editContent} onChange={(e) => edit.setEditContent(e.target.value)} />
                      <button type="button" onClick={edit.submitEdit}>Save</button>
                      <button type="button" onClick={edit.cancelEdit}>Cancel</button>
                    </>
                  ) : null}
                  <button type="button" onClick={() => deleteComment()}>Delete</button>
                </>
              )}
              <button type="button" onClick={() => reply.openReply()}>Reply</button>
              {reply.isReplying && (
                <form onSubmit={(e) => { e.preventDefault(); reply.submitReply(); }}>
                  <textarea value={reply.replyContent} onChange={(e) => reply.setReplyContent(e.target.value)} />
                  <button type="submit">Reply</button>
                  <button type="button" onClick={reply.cancelReply}>Cancel</button>
                </form>
              )}
              {c.reactions?.map((r) => (
                <button key={r.id} type="button" onClick={() => reaction.toggle(r.id)}>
                  {r.emoji ?? r.id} {r.count}
                </button>
              ))}
              {c.replies?.length ? (
                <button type="button" onClick={toggleReplies}>{showReplies ? 'Hide' : 'Show'} replies</button>
              ) : null}
              {showReplies && c.replies?.length
                ? c.replies.map((replyComment) => (
                    <HeadlessCommentItem key={replyComment.id} comment={replyComment}>
                      {({ comment: rc, isAuthor: ra, edit: re, reply: rp, reaction: rxn, deleteComment: del }) => (
                        <div style={{ marginLeft: 16 }}>
                          <p>{rc.content}</p>
                          <span>{rc.author.name}</span>
                          {ra && <button type="button" onClick={() => re.startEditing()}>Edit</button>}
                          {ra && <button type="button" onClick={del}>Delete</button>}
                        </div>
                      )}
                    </HeadlessCommentItem>
                  ))
                : null}
            </div>
          )}
        </HeadlessCommentItem>
      ))}
    </CommentSectionProvider>
  );
}
```

## useCommentTree

The flagship hook. Manages all comment state internally: add, reply, edit, delete, and reactions with correct count toggling. Works standalone (no Provider required) and supports adapters for persistence.

```tsx
import { useCommentTree } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({
  initialComments: existingComments,
  currentUser,
});

tree.comments;                         // Current nested comment array
tree.addComment('Hello!');             // Add a root comment
tree.addReply(parentId, 'Great!');     // Reply to a comment
tree.editComment(id, 'Updated text'); // Edit a comment
tree.deleteComment(id);                // Delete a comment and its replies
tree.toggleReaction(id, 'like');       // Toggle a reaction (count auto-updates)
tree.totalCount;                       // Total comments including nested replies
tree.findComment(id);                  // Find a comment by ID
tree.isLoading;                        // True while loading from adapter
tree.error;                            // Error object or null
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `initialComments` | `Comment[]` | Initial comments (flat or nested, auto-detected) |
| `currentUser` | `CommentUser` | Current user for authoring new comments |
| `adapter` | `CommentAdapter<T>` | Adapter for async persistence (REST, Supabase, etc.) |
| `generateId` | `() => string` | Custom ID generator (default: `generateUniqueId`) |
| `defaultReactions` | `ReactionConfig[]` | Default reactions for new comments |
| `onError` | `(error: Error) => void` | Called when an adapter operation fails (after rollback) |
| `mutuallyExclusiveReactions` | `boolean` | When true, only one reaction can be active per comment |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `comments` | `Comment<T>[]` | Current nested comment tree |
| `addComment` | `(content) => Comment<T>` | Add a root-level comment (returns immediately) |
| `addReply` | `(parentId, content) => Comment<T>` | Add a reply to a comment |
| `editComment` | `(id, content) => Promise<void>` | Edit a comment (optimistic + adapter) |
| `deleteComment` | `(id) => Promise<void>` | Delete a comment and its subtree |
| `toggleReaction` | `(commentId, reactionId) => Promise<void>` | Toggle a reaction (uses exclusive toggle when `mutuallyExclusiveReactions` is true) |
| `setComments` | `(comments) => void` | Replace the entire tree |
| `findComment` | `(id) => Comment<T> \| undefined` | Find a comment by ID |
| `totalCount` | `number` | Total comments (including nested replies) |
| `isLoading` | `boolean` | True while loading from adapter |
| `error` | `Error \| null` | Current error (null if none) |

### Loading and error handling

When using an adapter, `tree.isLoading` is `true` while the initial `getComments()` runs. Show a skeleton when there are no comments yet:

```tsx
import { useCommentTree, CommentSkeleton, CommentSectionErrorBoundary } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({ currentUser, adapter });

return (
  <CommentSectionErrorBoundary fallback={(err, reset) => (
    <div><p>Error: {err.message}</p><button type="button" onClick={reset}>Try again</button></div>
  )}>
    {tree.isLoading && tree.comments.length === 0 && <CommentSkeleton count={3} />}
    {!tree.isLoading && tree.comments.length === 0 && <p>No comments yet.</p>}
    {tree.comments.length > 0 && <YourCommentList tree={tree} />}
  </CommentSectionErrorBoundary>
);
```

`CommentSkeleton` is unstyled (use your own CSS; it uses classes like `headless-comment-skeleton`). `CommentSectionErrorBoundary` catches errors in the comment subtree and renders your `fallback` or a default "Try again" UI.

## Mutually Exclusive Reactions

Enable `mutuallyExclusiveReactions` to restrict each comment to one active reaction per user. This is ideal for:

- **Facebook-style**: One emoji reaction per comment (Like, Love, Laugh, Wow, Angry)
- **Reddit-style**: Upvote or downvote, but not both simultaneously

```tsx
const tree = useCommentTree({
  initialComments,
  currentUser,
  mutuallyExclusiveReactions: true,
});

// Clicking 👍 when ❤️ is active:
//   ❤️ count goes down, 👍 count goes up
// Clicking 👍 when 👍 is already active:
//   👍 count goes down (deactivated)
```

### Custom 5-Emoji Reaction Set

```tsx
import { type ReactionConfig } from '@hasthiya_/headless-comments-react';

const emojiReactions: ReactionConfig[] = [
  { id: 'like', label: 'Like', emoji: '👍' },
  { id: 'heart', label: 'Love', emoji: '❤️' },
  { id: 'haha', label: 'Laugh', emoji: '😂' },
  { id: 'wow', label: 'Wow', emoji: '😮' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
];

<StyledCommentSection
  tree={tree}
  currentUser={currentUser}
  availableReactions={emojiReactions}
  showReactions
/>
```

### Core Function

The exclusive toggle is also available as a pure function for manual use:

```tsx
import { exclusiveToggleReactionInTree } from '@hasthiya_/headless-comments-react';

// Deactivates any currently active reaction before activating the new one
const updated = exclusiveToggleReactionInTree(tree, commentId, 'like');
```

## Composable Hooks

Granular, per-comment hooks for edit, reply, and reaction logic. Each hook is context-optional: it reads from `CommentSectionProvider` if available, or you can pass explicit callbacks for standalone use.

### useEditComment

```tsx
import { useEditComment } from '@hasthiya_/headless-comments-react';

const {
  isEditing, editContent, setEditContent,
  startEditing, submitEdit, cancelEdit, isSubmitting,
} = useEditComment(commentId, {
  onEdit: async (id, content) => { /* optional custom handler */ },
});
```

### useReplyTo

```tsx
import { useReplyTo } from '@hasthiya_/headless-comments-react';

const {
  isReplying, replyContent, setReplyContent,
  openReply, submitReply, cancelReply, isSubmitting,
} = useReplyTo(commentId);
```

### useCommentReaction

```tsx
import { useCommentReaction } from '@hasthiya_/headless-comments-react';

const { toggle, isPending, reactions } = useCommentReaction(commentId);
```

### useComment

All-in-one hook composing `useEditComment`, `useReplyTo`, and `useCommentReaction`. When used via `useComment`, `edit.startEditing()` can be called with **no arguments** — it pre-fills with the comment's current content.

**Options** (all optional; when omitted, falls back to `CommentSectionProvider` context):

| Option | Signature | Description |
|--------|-----------|-------------|
| `onEdit` | `(commentId: string, content: string) => void \| Promise<void>` | Called when the comment is edited |
| `onReply` | `(commentId: string, content: string) => void \| Promise<void>` | Called when a reply is submitted |
| `onReaction` | `(commentId: string, reactionId: string) => void \| Promise<void>` | Called when a reaction is toggled |
| `onDelete` | `(commentId: string) => void` | Called when the comment is deleted |
| `currentUser` | `CommentUser` | Current user (for `isAuthor`). Falls back to Provider. |

```tsx
import { useComment, type CommentUser } from '@hasthiya_/headless-comments-react';

const {
  isAuthor, edit, reply, reaction,
  showReplies, toggleReplies, deleteComment,
} = useComment(comment, {
  onEdit: async (id, content) => { /* persist edit */ },
  onReply: async (parentId, content) => { /* add reply */ },
  onReaction: (id, reactionId) => { /* toggle reaction */ },
  onDelete: (id) => { /* remove comment */ },
  currentUser: me,
});

// Enter edit mode with current content (no arg needed)
edit.startEditing();
```

**Delete and confirmation:** `useComment` returns `deleteComment` and `isPendingDelete`. When the delete handler (e.g. from `useCommentTree`) returns a Promise, `isPendingDelete` is `true` until the promise settles — use it to show a loading state on the delete button. To add a confirmation step, wrap `deleteComment` in your own handler that shows a modal or `confirm()`, then calls `deleteComment()`:

```tsx
const { deleteComment, isPendingDelete } = useComment(comment);

const handleDeleteClick = () => {
  if (window.confirm('Delete this comment?')) deleteComment();
};

<button onClick={handleDeleteClick} disabled={isPendingDelete}>
  {isPendingDelete ? 'Deleting…' : 'Delete'}
</button>
```

### useSortedComments

```tsx
import { useSortedComments } from '@hasthiya_/headless-comments-react';

const { sortedComments, sortOrder, setSortOrder } = useSortedComments(
  comments,
  'newest',
  { persistKey: 'my-app-sort-order' } // optional: saves to localStorage
);
```

## Adapters

Adapters connect `useCommentTree` to data sources. The adapter interface is simple: implement `getComments`, `createComment`, `updateComment`, `deleteComment`, and `toggleReaction`.

### createInMemoryAdapter

In-memory adapter with simulated async delay. Great for prototyping and tests.

```tsx
import { createInMemoryAdapter } from '@hasthiya_/headless-comments-react';

const adapter = createInMemoryAdapter({
  initialComments: seedComments,
  latency: 200, // simulated network delay in ms
});

const tree = useCommentTree({ currentUser, adapter });
```

### createRestAdapter

REST adapter that maps CRUD operations to HTTP endpoints.

```tsx
import { createRestAdapter } from '@hasthiya_/headless-comments-react';

const adapter = createRestAdapter({
  baseUrl: '/api/comments',
  headers: { Authorization: `Bearer ${token}` },
});

// API endpoints expected:
// GET    /api/comments           — fetch all comments
// POST   /api/comments           — create comment { content, parentId? }
// PATCH  /api/comments/:id       — update comment { content }
// DELETE /api/comments/:id       — delete comment
// POST   /api/comments/:id/react — toggle reaction { reactionId }
```

### Custom Adapter

Implement the `CommentAdapter<T>` interface for any backend. For read-only use (e.g. display-only comments), implement only `getComments`:

```tsx
import type { CommentAdapter } from '@hasthiya_/headless-comments-react';

// Read-only adapter (e.g. display-only section)
const readOnlyAdapter: CommentAdapter = {
  async getComments() { /* return Comment[] or { comments, total, hasMore } */ },
};

// Full CRUD adapter
const myAdapter: CommentAdapter = {
  async getComments() { /* ... */ },
  async createComment(content, parentId?) { /* return Comment with server ID */ },
  async updateComment(id, content) { /* return updated Comment */ },
  async deleteComment(id) { /* void */ },
  async toggleReaction(commentId, reactionId) { /* void */ },
  subscribe(listener) { /* return unsubscribe function */ },
  dispose() { /* cleanup */ },
};
```

### CommentAdapter Interface

Only implement the methods you need. **Read-only adapters** (e.g. display-only sections) need only `getComments`; mutations will update local state only when the corresponding method is omitted.

| Method | Signature | Required |
|--------|-----------|----------|
| `getComments` | `(options?) => Promise<Comment[] \| PaginatedResponse>` | Optional |
| `createComment` | `(content, parentId?) => Promise<Comment>` | Optional |
| `updateComment` | `(id, content) => Promise<Comment>` | Optional |
| `deleteComment` | `(id) => Promise<void>` | Optional |
| `toggleReaction` | `(commentId, reactionId) => Promise<void>` | Optional |
| `subscribe` | `(listener) => () => void` | Optional |
| `dispose` | `() => void` | Optional |

## Core Utilities

Pure, framework-agnostic functions. Import from the package root or `@hasthiya_/headless-comments-react/core`.

### Tree Mutation Functions

All tree functions are immutable — they return a new array, never mutate the original.

```tsx
import {
  addToTree,
  removeFromTree,
  updateInTree,
  toggleReactionInTree,
  exclusiveToggleReactionInTree,
  findCommentById,
  flattenComments,
  buildCommentTree,
  countReplies,
} from '@hasthiya_/headless-comments-react';

// Add a comment to the tree
const updated = addToTree(tree, newComment, parentId, 'append'); // or 'prepend'

// Remove a comment (and its subtree)
const afterDelete = removeFromTree(tree, commentId);

// Update a comment's fields
const afterEdit = updateInTree(tree, commentId, { content: 'new content', isEdited: true });

// Toggle a reaction (auto increments/decrements count)
const afterReaction = toggleReactionInTree(tree, commentId, 'like');

// Toggle with mutual exclusivity (one active at a time)
const exclusive = exclusiveToggleReactionInTree(tree, commentId, 'like');

// Find, flatten, build, count
const comment = findCommentById(tree, 'comment-123');
const flat = flattenComments(tree);
const nested = buildCommentTree(flatComments);
const count = countReplies(comment);
```

### Sorting and Filtering

```tsx
import { sortComments, filterComments, searchComments } from '@hasthiya_/headless-comments-react';

const sorted = sortComments(comments, 'newest');
const popular = sortComments(comments, 'popular'); // or 'top' (same behavior)
const deepSorted = sortComments(comments, 'newest', { recursive: true });
const filtered = filterComments(comments, (c) => !c.isDeleted);
const results = searchComments(comments, 'react hooks');
```

### All Core Exports

| Function | Description |
|----------|-------------|
| `addToTree` | Add comment to tree (root or nested) |
| `removeFromTree` | Remove comment and its subtree |
| `updateInTree` | Update comment fields via shallow merge |
| `toggleReactionInTree` | Toggle reaction with count update |
| `exclusiveToggleReactionInTree` | Toggle reaction with mutual exclusivity |
| `findCommentById` | Find comment recursively |
| `flattenComments` | Flatten nested tree to array |
| `buildCommentTree` | Build nested tree from flat list |
| `countReplies` | Count replies recursively |
| `sortComments` | Sort by newest, oldest, popular (or top) |
| `filterComments` | Filter with predicate |
| `searchComments` | Search by content |
| `generateUniqueId` | Unique ID generator |
| `formatRelativeTime` | e.g. "2 hours ago" |

## Styling

Four ways to style the comment section:

### 1. Styled Preset (CSS variables)

Import the stylesheet and override `--cs-*` variables:

```tsx
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { StyledCommentSection, useCommentTree } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({ initialComments, currentUser });
<StyledCommentSection tree={tree} currentUser={currentUser} />
```

```css
:root {
  --cs-primary-color: #8b5cf6;
  --cs-bg-color: #0f172a;
  --cs-text-color: #f8fafc;
  --cs-border-color: #334155;
}
```

### CSS Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `--cs-primary-color` | `#f97316` | Primary accent (buttons, links, focus) |
| `--cs-secondary-color` | `#6b7280` | Secondary elements |
| `--cs-bg-color` | `#ffffff` | Background |
| `--cs-hover-bg-color` | `#f9fafb` | Hover background |
| `--cs-text-color` | `#1f2937` | Main text |
| `--cs-secondary-text-color` | `#6b7280` | Secondary text |
| `--cs-border-color` | `#e5e7eb` | Borders |
| `--cs-border-radius` | `8px` | Border radius |
| `--cs-font-size` | `14px` | Base font size |
| `--cs-avatar-size` | `36px` | Avatar dimensions |
| `--cs-destructive-color` | `#dc2626` | Delete/danger actions |
| `--cs-success-color` | `#16a34a` | Success state |

### 2. Theme Prop

```tsx
const theme = {
  primaryColor: '#f97316',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
};

<StyledCommentSection tree={tree} currentUser={currentUser} theme={theme} />
```

### 3. Render Props (full control)

```tsx
<CommentSection
  tree={tree}
  currentUser={currentUser}
  renderReplyForm={({ onSubmit, placeholder }) => <MyForm onSubmit={onSubmit} placeholder={placeholder} />}
  renderComment={(comment, props) => <MyCommentCard comment={comment} {...props} />}
  renderAvatar={(user) => <img src={user.avatarUrl} alt={user.name} />}
/>
```

### 4. Tailwind / Shadcn (copy-paste)

Copy the `apps/showcase/src/components/comment-ui` folder into your app:

```tsx
import { ShadcnCommentSection } from '@/components/comment-ui';
import { useCommentTree } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({ initialComments, currentUser });
<ShadcnCommentSection tree={tree} currentUser={currentUser} showReactions />
```

## Component API

### CommentSectionProps (key props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **`tree`** | `UseCommentTreeReturn` | — | Pre-configured tree from `useCommentTree` (recommended) |
| `comments` | `Comment[]` | — | Array of comments (alternative to tree) |
| `currentUser` | `CommentUser \| null` | — | Logged-in user |
| `showReactions` | `boolean` | — | Show reaction buttons |
| `showMoreOptions` | `boolean` | — | Show more menu |
| `availableReactions` | `ReactionConfig[]` | — | Custom reaction types |
| `theme` | `CommentTheme` | — | Colors, radius, font size |
| `texts` | `CommentTexts` | — | Labels and placeholders |
| `maxDepth` | `number` | 3 | Max reply nesting depth |
| `sortOrder` | `string` | newest | Sort order |
| `readOnly` | `boolean` | false | Disable all interactions |
| `inputPlaceholder` | `string` | — | Placeholder for input |
| `renderReplyForm` | `(props) => ReactNode` | — | Custom form UI |
| `renderComment` | `(comment, props) => ReactNode` | — | Custom comment row |
| `renderAvatar` | `(user) => ReactNode` | — | Custom avatar |

### StyledCommentSection (additional props)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSortBar` | `boolean` | true | Show sort bar |
| `showVerifiedBadge` | `boolean` | true | Show verified badge |
| `maxCommentLines` | `number` | — | Max lines before truncating |
| `maxCharLimit` | `number` | — | Max characters per comment |
| `showCharCount` | `boolean` | false | Show character count |
| `autoFocus` | `boolean` | false | Auto-focus input on mount |

## Entry Points

| Import path | What you get |
|---|---|
| `@hasthiya_/headless-comments-react` | Everything: presets, hooks, types, core utilities |
| `@hasthiya_/headless-comments-react/presets/styled` | `StyledCommentSection` + styled sub-components |
| `@hasthiya_/headless-comments-react/presets/styled/styles.css` | CSS file for the styled preset |
| `@hasthiya_/headless-comments-react/presets/default` | `CommentSection` (minimal unstyled) |
| `@hasthiya_/headless-comments-react/headless` | Provider, headless components, hooks |
| `@hasthiya_/headless-comments-react/core` | Types, tree, sorting, utilities (framework-agnostic) |

## TypeScript Types

All types support the generic `Comment<T>` pattern for custom metadata:

```tsx
import type {
  Comment,
  CommentUser,
  Reaction,
  ReactionConfig,
  CommentTheme,
  CommentTexts,
  CommentAdapter,
  CommentSectionProps,
  CommentItemProps,
  RenderReplyFormProps,
  UseCommentTreeOptions,
  UseCommentTreeReturn,
} from '@hasthiya_/headless-comments-react';

// Generic Comment with custom metadata
type MyComment = Comment<{ score: number; flair: string }>;

const tree = useCommentTree<{ score: number; flair: string }>({
  initialComments: myComments,
  currentUser,
});
// tree.comments is MyComment[]
```

### Core Types

| Type | Key fields | Description |
|------|-----------|-------------|
| `Comment<T>` | id, content, author, createdAt, updatedAt, parentId, replies, reactions, isEdited | Comment node. `T` extends `Record<string, unknown>` for custom metadata. |
| `CommentUser` | id, name, avatarUrl?, isVerified?, role? | User (author) |
| `Reaction` | id, label, emoji, count, isActive | Reaction instance on a comment |
| `ReactionConfig` | id, label, emoji, activeColor?, inactiveColor? | Reaction type configuration |
| `CommentAdapter<T>` | getComments, createComment, updateComment, deleteComment, toggleReaction, subscribe?, dispose? | Adapter interface for data persistence |
| `CommentTheme` | primaryColor, backgroundColor, textColor, borderColor, borderRadius, fontSize | Theme configuration |
| `CommentTexts` | reply, edit, delete, cancel, submit, noComments, loading | Labels and placeholders |
| `SortOrder` | 'newest' \| 'oldest' \| 'popular' \| 'top' | Sort order (popular and top are equivalent) |

## Accessibility

- **Styled preset**: Includes ARIA labels, semantic HTML, keyboard focus states.
- **Shadcn reference implementation**: Full ARIA labels, `aria-pressed` on reactions, `role="dialog"` for delete confirmation, and semantic structure.
- **Headless / custom UI**: The library does not impose markup on your custom UI. When building with `HeadlessCommentItem`, `HeadlessReplyForm`, or render props, you are responsible for focus management, keyboard navigation, and semantics.

## Troubleshooting / FAQ

- **CSS not applying for Styled preset?** Ensure you import the stylesheet: `import '@hasthiya_/headless-comments-react/presets/styled/styles.css';`
- **Next.js App Router?** Import the CSS in your root layout (`app/layout.tsx`) or in the page that uses the component.
- **Dark mode (Styled preset)?** Add the class `cs-root--dark` to a parent, or set `data-cs-theme="dark"` on the wrapper. Also respects the `.dark` class (e.g. from `next-themes`).
- **Reactions not mutually exclusive?** Set `mutuallyExclusiveReactions: true` on `useCommentTree` options.

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT
