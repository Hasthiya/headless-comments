# @comment-section/react

A highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates. The API is **sync** (no Promises required for callbacks) and **headless-first**: the default `CommentSection` uses minimal unstyled UI; supply your own UI via render props or build a styled layer with the headless API. **Zero dependencies** (only React as peer).

![npm version](https://img.shields.io/npm/v/@comment-section/react)
![License](https://img.shields.io/npm/l/@comment-section/react)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)

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
npm install @comment-section/react
# or
yarn add @comment-section/react
# or
pnpm add @comment-section/react
```

## Quick Start

Callbacks are **synchronous**: update your state and return the new comment. The library clears the form and closes the reply UI after calling your handler.

```tsx
import {
  CommentSection,
  generateUniqueId,
  type Comment,
  type CommentUser,
} from '@comment-section/react';

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
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
    />
  );
}
```

The default `CommentSection` is headless with minimal unstyled UI (plain textarea and buttons). Use `renderReplyForm` and `renderComment` to supply your own UI, or use the headless building blocks (`CommentSectionProvider`, `HeadlessCommentItem`, `HeadlessReplyForm`, hooks) to build a fully custom interface. A **Shadcn-style reference implementation** is available in this repo's showcase app (`apps/showcase/src/components/comment-ui`); you can copy or adapt it for a styled Tailwind/shadcn-friendly UI.

## Data flow and loading

- **Sync callbacks**: All data callbacks (`onSubmitComment`, `onReply`, `onEdit`, `onDelete`, `onReaction`) are synchronous. You update your own state (or trigger an API call in a fire-and-forget way); the library then clears the form and closes the reply UI.
- **User-controlled loading**: For async work (e.g. calling an API), set `isSubmittingComment` or `isSubmittingReply` to `true` before the request and back to `false` when done. The preset uses these to disable the submit button and show "Submitting…".

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

- **Main entry** (`@comment-section/react`): Default `CommentSection` (minimal unstyled), headless components, hooks, types, and core utilities.
- **Subpaths**: `@comment-section/react/headless` (provider, HeadlessCommentItem, HeadlessReplyForm, hooks); `@comment-section/react/core` (types, tree, sorting, utils); `@comment-section/react/presets/default` (minimal CommentSection only).
- **Default export** (`CommentSection`): Headless with **minimal unstyled UI**. Use `renderReplyForm` and `renderComment` for your own UI.
- **Headless**: `CommentSectionProvider`, `HeadlessCommentItem`, `HeadlessReplyForm`, and hooks for a fully custom UI.

## Reference implementation (Shadcn-style UI)

This repository includes a **showcase app** that implements a Shadcn-style comment section using the headless API and Tailwind. The implementation lives under `apps/showcase/src/components/comment-ui`. You can copy that folder into your project or adapt it to get a styled, Tailwind/shadcn-friendly UI without the package shipping any styling dependencies.

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
import type { RenderReplyFormProps } from '@comment-section/react';

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
} from '@comment-section/react';
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
} from '@comment-section/react';
```

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
