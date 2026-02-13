# @comment-section/react

A highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates. The API is **sync** (no Promises required for callbacks) and **headless-first**: the default `CommentSection` uses minimal unstyled UI; use `ShadcnCommentSection` for a styled preset or supply your own UI via render props.

![npm version](https://img.shields.io/npm/v/@comment-section/react)
![License](https://img.shields.io/npm/l/@comment-section/react)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)

## Features

- **Optimistic Updates** – Instant UI updates before server confirmation
- **Nested Replies** – Multi-level threaded conversations
- **Reactions** – Customizable reaction system (likes, hearts, etc.)
- **Fully Themeable** – Complete control over styling
- **TypeScript** – Full type definitions included
- **Accessible** – ARIA labels and keyboard navigation
- **Zero Dependencies** – Only React as peer dependency
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

The default `CommentSection` is headless with minimal unstyled UI (plain textarea and buttons). For a ready-made styled UI, use **ShadcnCommentSection** instead:

```tsx
import { ShadcnCommentSection, type Comment, type CommentUser } from '@comment-section/react';

<ShadcnCommentSection
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={handleSubmit}
  onReply={handleReply}
  onReaction={handleReaction}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

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

## Presets and default export

- **Default export** (`CommentSection`): Headless with **minimal unstyled UI** (basic textarea, buttons, simple comment rows). Use it with `renderReplyForm` and `renderComment` to supply your own UI, or as a starting point.
- **Shadcn preset**: Import `ShadcnCommentSection` (and `ShadcnCommentItem`, `ShadcnReplyForm`, etc.) for a styled, Tailwind/shadcn-friendly UI. Named exports only.
- **Headless building blocks**: `CommentSectionProvider`, `HeadlessReplyForm`, `HeadlessCommentItem`, and hooks for building a fully custom UI.

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

## Adapter

`createCallbackAdapter` accepts **sync** callbacks and wraps them in `Promise.resolve` so the adapter interface (Promise-based) still works when integrating with async data layers.

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
    <ShadcnCommentSection
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
