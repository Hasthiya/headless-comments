# @hasthiya_/headless-comments-react

A highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates. The API is **sync** (no Promises required for callbacks) and **headless-first**: the default `CommentSection` uses minimal unstyled UI; supply your own UI via render props or build a styled layer with the headless API. **Zero dependencies** (only React as peer).

![npm version](https://img.shields.io/npm/v/@hasthiya_/headless-comments-react)
![License](https://img.shields.io/npm/l/@hasthiya_/headless-comments-react)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start — Styled Preset](#quick-start--styled-preset-recommended)
- [Quick Start — Headless](#quick-start--headless-bring-your-own-ui)
- [Choosing an approach](#choosing-an-approach)
- [Data flow and loading](#data-flow-and-loading)
- [Props](#props)
- [Entry points](#entry-points)
- [Styled preset: CSS variables](#styled-preset-css-variables)
- [StyledCommentSection props](#styledcommentsection-props)
- [Shadcn / Tailwind](#shadcn--tailwind-copy-paste-approach)
- [Customization](#customization)
- [Hooks](#hooks)
- [TypeScript Types](#typescript-types)
- [Examples](#examples)
- [Troubleshooting / FAQ](#troubleshooting--faq)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)

## Features

- **Optimistic Updates** – Instant UI updates before server confirmation
- **Nested Replies** – Multi-level threaded conversations
- **Reactions** – Customizable reaction system (likes, hearts, etc.)
- **Fully Themeable** – Complete control over styling
- **TypeScript** – Full type definitions included
- **Accessible** – Add ARIA and keyboard behavior in your UI; headless layer does not impose markup
- **Zero dependencies** – Only React and React-DOM as peer dependencies
- **Responsive** – Works on all screen sizes

## Installation

```bash
npm install @hasthiya_/headless-comments-react
# or
yarn add @hasthiya_/headless-comments-react
# or
pnpm add @hasthiya_/headless-comments-react
```

## Quick Start — Styled Preset (recommended)

Get a polished, fully styled comment section with **zero extra dependencies**. Just import the component + its CSS file:

```tsx
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import {
  StyledCommentSection,
  generateUniqueId,
  type Comment,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';

const currentUser: CommentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  isVerified: true,
};

function App() {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (content: string): Comment => {
    const newComment: Comment = {
      id: generateUniqueId(),
      content,
      author: currentUser,
      createdAt: new Date(),
      reactions: [{ id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false }],
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  };

  return (
    <StyledCommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
    />
  );
}
```

The styled preset includes avatars, reactions, nested replies, sort bar, loading skeletons, delete confirmation, and more — all themed via CSS variables. Override any `--cs-*` variable to customize:

```css
:root {
  --cs-primary-color: #8b5cf6;
  --cs-bg-color: #0f172a;
  --cs-text-color: #f8fafc;
  --cs-border-color: #334155;
}
```

## Quick Start — Headless (bring your own UI)

For full control, use the headless `CommentSection` (minimal unstyled UI) and supply your own components via `renderReplyForm` and `renderComment`. Or use the headless building blocks (`CommentSectionProvider`, `HeadlessCommentItem`, `HeadlessReplyForm`, hooks) to build a fully custom interface.

```tsx
import { CommentSection } from '@hasthiya_/headless-comments-react';

<CommentSection
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={handleSubmit}
/>
```

Callbacks are **synchronous**: update your state and return the new comment. The library clears the form and closes the reply UI after calling your handler.

## Choosing an approach

- **Zero config, no Tailwind?** Use the **Styled preset**: import `@hasthiya_/headless-comments-react/presets/styled/styles.css` and `<StyledCommentSection />`. Theme via CSS variables (`--cs-*`).
- **Using Tailwind / shadcn/ui?** Copy the **Shadcn-style** comment UI from `apps/showcase/src/components/comment-ui/` into your project and use `<ShadcnCommentSection />`.
- **Full control / custom design?** Use the **headless** `CommentSection` with `renderReplyForm` and `renderComment`, or build with `CommentSectionProvider`, `HeadlessCommentItem`, `HeadlessReplyForm`, and hooks.

## Data flow and loading

- **Sync callbacks**: All data callbacks (`onSubmitComment`, `onReply`, `onEdit`, `onDelete`, `onReaction`) are synchronous. You update your own state (or trigger an API call in a fire-and-forget way); the library then clears the form and closes the reply UI.
- **User-controlled loading**: For async work (e.g. calling an API), set `isSubmittingComment` or `isSubmittingReply` to `true` before the request and back to `false` when done. The preset uses these to disable the submit button and show "Submitting…". Example: `<StyledCommentSection isSubmittingComment={isSubmitting} onSubmitComment={handleSubmit} ... />` with `const [isSubmitting, setIsSubmitting] = useState(false);` and toggling it in your handler.

## Props

### CommentSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `comments` | `Comment[]` | Required | Array of comments to display |
| `currentUser` | `CommentUser \| null` | - | Current logged-in user |
| `onSubmitComment` | `(content: string) => Comment` | - | Sync callback for new comments |
| `onReply` | `(commentId: string, content: string) => Comment` | - | Sync callback for replies |
| `onEdit` | `(commentId: string, content: string) => Comment` | - | Sync callback for editing |
| `onReaction` | `(commentId: string, reactionId: string) => void` | - | Sync callback for reactions |
| `onDelete` | `(commentId: string) => void` | - | Sync callback for deletion |
| `isSubmittingComment` | `boolean` | - | User-controlled: new comment form is submitting (disables submit / shows loading) |
| `isSubmittingReply` | `boolean` | - | User-controlled: reply form is submitting |
| `renderReplyForm` | `(props: RenderReplyFormProps) => ReactNode` | - | Custom render for the comment/reply form (you supply full UI) |
| `onLoadMore` | `() => Comment[] \| void` | - | Sync callback for loading more comments (pagination) |
| `enableOptimisticUpdates` | `boolean` | `true` | Enable instant UI updates |
| `maxDepth` | `number` | `3` | Maximum reply nesting depth |
| `theme` | `CommentTheme` | - | Custom theme configuration |
| `readOnly` | `boolean` | `false` | Disable all interactions |
| `sortOrder` | `'newest' \| 'oldest' \| 'popular'` | `'newest'` | Comment sort order |

## Entry points

| Import path | What you get |
|---|---|
| `@hasthiya_/headless-comments-react` | Everything: `StyledCommentSection`, `CommentSection` (default headless), headless components, hooks, types, core utilities |
| `@hasthiya_/headless-comments-react/presets/styled` | `StyledCommentSection` + styled sub-components only |
| `@hasthiya_/headless-comments-react/presets/styled/styles.css` | CSS file for the styled preset |
| `@hasthiya_/headless-comments-react/presets/default` | `CommentSection` (minimal unstyled) only |
| `@hasthiya_/headless-comments-react/headless` | Provider, `HeadlessCommentItem`, `HeadlessReplyForm`, hooks |
| `@hasthiya_/headless-comments-react/core` | Types, tree, sorting, utilities (framework-agnostic) |

## Styled preset: CSS variables

Override these CSS custom properties (e.g. in `:root` or a wrapper) to theme the Styled preset:

| Variable | Default | Description |
|----------|---------|-------------|
| `--cs-primary-color` | `#f97316` | Primary accent (buttons, links, focus) |
| `--cs-secondary-color` | `#6b7280` | Muted/secondary elements (e.g. avatar fallback) |
| `--cs-bg-color` | `#ffffff` | Background |
| `--cs-hover-bg-color` | `#f9fafb` | Hover background |
| `--cs-text-color` | `#1f2937` | Main text |
| `--cs-secondary-text-color` | `#6b7280` | Secondary text (timestamps, labels) |
| `--cs-border-color` | `#e5e7eb` | Borders |
| `--cs-border-radius` | `8px` | Border radius for inputs, buttons, cards |
| `--cs-font-family` | system stack | Font family |
| `--cs-font-size` | `14px` | Base font size |
| `--cs-avatar-size` | `36px` | Avatar width/height |
| `--cs-comment-spacing` | `16px` | Vertical spacing between comments |
| `--cs-animation-duration` | `200ms` | Transition duration |
| `--cs-destructive-color` | `#dc2626` | Delete/danger actions |
| `--cs-success-color` | `#16a34a` | Success state |

For dark mode, add the class `cs-root--dark` to an ancestor of the comment section, or set `data-cs-theme="dark"` on the wrapper (see [Troubleshooting / FAQ](#troubleshooting--faq)).

## StyledCommentSection props

`StyledCommentSection` accepts all [CommentSection Props](#commentsection-props) plus these optional display props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSortBar` | `boolean` | `true` | Show sort bar (newest / oldest / top) |
| `showReactions` | `boolean` | `true` | Show reaction buttons on comments |
| `showMoreOptions` | `boolean` | `true` | Show more-options menu (reply, edit, delete, share, report) |
| `showVerifiedBadge` | `boolean` | `true` | Show verified badge next to author name |
| `maxCommentLines` | `number` | - | Max lines before truncating comment body (undefined = no truncation) |
| `inputPlaceholder` | `string` | - | Placeholder for the new-comment textarea |
| `maxCharLimit` | `number` | - | Max characters in comment/reply input |
| `showCharCount` | `boolean` | `false` | Show character count when `maxCharLimit` is set |
| `autoFocus` | `boolean` | `false` | Auto-focus the new-comment textarea on mount |
| `maxDepth` | `number` | `3` | Maximum reply nesting depth |

## Shadcn / Tailwind (copy-paste approach)

If you use **Tailwind CSS** and **shadcn/ui**, this repository includes a complete Shadcn-style comment section that you can copy into your project. The implementation lives under `apps/showcase/src/components/comment-ui/`.

### Steps

1. **Install peer dependencies** (if not already installed):

   ```bash
   pnpm add @hasthiya_/headless-comments-react lucide-react
   ```

2. **Add required shadcn/ui components** (if not already added):

   ```bash
   npx shadcn@latest add avatar button textarea skeleton dropdown-menu alert-dialog
   ```

3. **Copy the comment-ui folder** into your project:

   ```bash
   cp -r apps/showcase/src/components/comment-ui/ src/components/comment-ui/
   ```

4. **Update import aliases** — the copied files use `@/components/ui/*` and `@/lib/utils` for shadcn. Adjust these if your project uses different aliases.

5. **Use it**:

   ```tsx
   import { ShadcnCommentSection } from '@/components/comment-ui';

   <ShadcnCommentSection
     comments={comments}
     currentUser={currentUser}
     onSubmitComment={handleSubmit}
   />
   ```

### Files included

| File | Component |
|------|----------|
| `ShadcnCommentSection.tsx` | Main wrapper (provider + list) |
| `ShadcnCommentItem.tsx` | Individual comment with replies |
| `ShadcnActionBar.tsx` | Reactions, reply, edit/delete, report |
| `ShadcnReplyForm.tsx` | Comment/reply form |
| `ShadcnReactionButton.tsx` | Reaction pill button |
| `ShadcnAvatar.tsx` | User avatar with fallback |
| `ShadcnCommentSkeleton.tsx` | Loading skeleton |
| `index.ts` | Barrel exports |

## Customization

### Theme

```tsx
const theme = {
  primaryColor: '#f97316',
  secondaryColor: '#6b7280',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
};

<CommentSection theme={theme} {...otherProps} />
```

### Custom form (renderReplyForm)

Supply your own form UI with the `RenderReplyFormProps` type. You receive `onSubmit`, `onCancel`, `placeholder`, `disabled`, `isSubmitting`, and optional `parentComment` (when replying).

```tsx
import type { RenderReplyFormProps } from '@hasthiya_/headless-comments-react';

<CommentSection
  renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
    <div>
      <textarea
        placeholder={placeholder}
        disabled={disabled}
        ref={/* wire to your state */}
      />
      <button
        onClick={() => onSubmit(content)}
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )}
  {...otherProps}
/>
```

### Custom Reactions

```tsx
const reactions = [
  { id: 'like', label: 'Like', emoji: '👍', activeColor: '#f97316' },
  { id: 'love', label: 'Love', emoji: '❤️', activeColor: '#ef4444' },
  { id: 'laugh', label: 'Laugh', emoji: '😂', activeColor: '#fbbf24' },
  { id: 'wow', label: 'Wow', emoji: '😮', activeColor: '#3b82f6' },
];

<CommentSection availableReactions={reactions} {...otherProps} />
```

### Custom Render Functions

```tsx
<CommentSection
  renderContent={(comment) => (
    <Markdown>{comment.content}</Markdown>
  )}
  renderAvatar={(user) => (
    <CustomAvatar user={user} />
  )}
  renderTimestamp={(date) => (
    <TimeAgo date={date} />
  )}
/>
```

### Custom Text Translations

```tsx
const texts = {
  reply: 'Responder',
  edit: 'Editar',
  delete: 'Eliminar',
  cancel: 'Cancelar',
  submit: 'Publicar',
  noComments: 'Sé el primero en comentar!',
  // ... see CommentTexts type
};

<CommentSection texts={texts} {...otherProps} />
```

## Hooks

The package exports several useful hooks:

```tsx
import {
  useCommentSection,
  useOptimisticUpdates,
  useReplyForm,
  useEditMode,
  useReactions,
} from '@hasthiya_/headless-comments-react';
```

Context from `useCommentSection` includes `isSubmittingComment` and `isSubmittingReply` for use in custom forms.

### useOptimisticUpdates

```tsx
const {
  data,        // Current optimistic data
  isPending,   // Is an operation in progress?
  add,         // Add item optimistically
  update,      // Update item optimistically
  remove,      // Remove item optimistically
  rollback,    // Revert to previous state
  confirm,     // Confirm the optimistic update
} = useOptimisticUpdates(initialData);
```

## TypeScript Types

All types are exported, including `RenderReplyFormProps` (onSubmit, onCancel, placeholder, disabled, isSubmitting, parentComment):

```tsx
import type {
  Comment,
  CommentUser,
  Reaction,
  ReactionConfig,
  CommentTheme,
  CommentTexts,
  CommentSectionProps,
  CommentItemProps,
  RenderReplyFormProps,
} from '@hasthiya_/headless-comments-react';
```

## Troubleshooting / FAQ

- **CSS not applying for Styled preset?** Ensure you import the stylesheet: `import '@hasthiya_/headless-comments-react/presets/styled/styles.css';` (in your root layout or the page that renders `StyledCommentSection`).
- **Comments not updating after submit?** Callbacks are sync: your handler must update your state (e.g. `setComments`) and **return** the new comment. The library then clears the form and closes the reply UI.
- **Next.js App Router?** Import the Styled preset CSS in your root layout (`app/layout.tsx`) or in the page/layout that uses the component so it’s included in the bundle.
- **Dark mode (Styled preset)?** Add the class `cs-root--dark` to a parent of the comment section, or set `data-cs-theme="dark"` on the wrapper. The stylesheet also respects the `.dark` class on an ancestor (e.g. from next-themes with `attribute="class"`), so the Styled preset can follow your app’s theme automatically.

## Reply form (top-level vs reply-to-comment)

- **Top-level new comment**: Use `HeadlessReplyForm` with `onSubmit={submitComment}` from `useCommentSection()`, or pass `renderReplyForm` to a preset. The context provides `submitComment` for the main form.
- **Reply to a comment**: Each comment can show an inline reply form. With headless, use `HeadlessCommentItem` and render a `HeadlessReplyForm` inside the item’s children; pass `onSubmit={(content) => replyToComment(comment.id, content)}` using `replyToComment` from context. The showcase's Shadcn-style UI does this.

## Accessibility

- **Reference implementation (showcase)**: The Shadcn-style UI in the repo includes ARIA labels, `aria-pressed` on reactions, `role="dialog"` for the delete confirmation, and semantic structure. Copy or adapt it for production.
- **Headless / default minimal UI**: The library does not add ARIA or keyboard behavior to your custom markup. When building your own UI with `HeadlessCommentItem`, `HeadlessReplyForm`, or `renderComment` / `renderReplyForm`, you are responsible for: focus management (e.g. focus trap in modals, focus return after submit), keyboard navigation, and semantics (labels, roles, live regions as needed).

## Adapter

`createCallbackAdapter` (from core) accepts **sync** callbacks and wraps them in `Promise.resolve` so the adapter interface (Promise-based) still works when integrating with async data layers. Use it in your own code; the provider uses sync callbacks only.

## Examples

### With API integration (sync handler + optional loading)

Use a sync handler that updates state. If you also call an API, control loading with `isSubmittingComment` / `isSubmittingReply`:

```tsx
function CommentSectionWithAPI() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments().then((data) => {
      setComments(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = (content: string): Comment => {
    const newComment = {
      id: generateUniqueId(),
      content,
      author: currentUser,
      createdAt: new Date(),
      reactions: [{ id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false }],
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    // Optional: fire-and-forget API
    fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return newComment;
  };

  // Or with loading state: set isSubmitting true before fetch, false after
  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      isLoading={isLoading}
      isSubmittingComment={isSubmitting}
    />
  );
}
```

### With infinite scroll

`onLoadMore` is sync. Update your own state with the fetched comments (e.g. append to `comments`); the component re-renders with the new list.

```tsx
function CommentSectionWithInfiniteScroll() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    fetchMoreComments().then((newComments) => {
      setComments((prev) => [...prev, ...newComments]);
      setHasMore(newComments.length > 0);
    });
  };

  return (
    <CommentSection
      comments={comments}
      hasMore={hasMore}
      onLoadMore={loadMore}
      {...props}
    />
  );
}
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT © [Your Name]
