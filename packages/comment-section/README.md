# @comment-section/react

A highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates.

![npm version](https://img.shields.io/npm/v/@comment-section/react)
![License](https://img.shields.io/npm/l/@comment-section/react)
![TypeScript](https://img.shields.io/badge/TypeScript-ready-blue)

## Features

- 🔄 **Optimistic Updates** - Instant UI updates before server confirmation
- 💬 **Nested Replies** - Multi-level threaded conversations
- 👍 **Reactions** - Customizable reaction system (likes, hearts, etc.)
- 🎨 **Fully Themeable** - Complete control over styling
- 📦 **TypeScript** - Full type definitions included
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🚀 **Zero Dependencies** - Only React as peer dependency
- 📱 **Responsive** - Works on all screen sizes

## Installation

```bash
npm install @comment-section/react
# or
yarn add @comment-section/react
# or
pnpm add @comment-section/react
```

## Quick Start

```tsx
import { CommentSection, Comment, CommentUser } from '@comment-section/react';

const currentUser: CommentUser = {
  id: 'user-1',
  name: 'John Doe',
  avatarUrl: 'https://example.com/avatar.jpg',
  isVerified: true,
};

const comments: Comment[] = [
  {
    id: 'comment-1',
    content: 'This is a great post!',
    author: {
      id: 'user-2',
      name: 'Jane Smith',
      avatarUrl: 'https://example.com/avatar2.jpg',
    },
    createdAt: new Date(),
    reactions: [
      { id: 'like', label: 'Like', emoji: '👍', count: 5, isActive: false },
    ],
    replies: [],
  },
];

function App() {
  const handleSubmit = async (content: string) => {
    // Send to your API
    console.log('New comment:', content);
  };

  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      enableOptimisticUpdates
    />
  );
}
```

## Props

### CommentSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `comments` | `Comment[]` | Required | Array of comments to display |
| `currentUser` | `CommentUser \| null` | - | Current logged-in user |
| `onSubmitComment` | `(content: string) => Promise<Comment>` | - | Callback for new comments |
| `onReply` | `(commentId: string, content: string) => Promise<Comment>` | - | Callback for replies |
| `onReaction` | `(commentId: string, reactionId: string) => Promise<void>` | - | Callback for reactions |
| `onEdit` | `(commentId: string, content: string) => Promise<Comment>` | - | Callback for editing |
| `onDelete` | `(commentId: string) => Promise<void>` | - | Callback for deletion |
| `enableOptimisticUpdates` | `boolean` | `true` | Enable instant UI updates |
| `maxDepth` | `number` | `3` | Maximum reply nesting depth |
| `theme` | `CommentTheme` | - | Custom theme configuration |
| `readOnly` | `boolean` | `false` | Disable all interactions |
| `sortOrder` | `'newest' \| 'oldest' \| 'popular'` | `'newest'` | Comment sort order |

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
  // ... more translations
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

All types are exported for TypeScript users:

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
} from '@comment-section/react';
```

## Examples

### With API Integration

```tsx
function CommentSectionWithAPI() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments().then((data) => {
      setComments(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (content: string) => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.json();
  };

  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      isLoading={isLoading}
    />
  );
}
```

### With Infinite Scroll

```tsx
function CommentSectionWithInfiniteScroll() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const newComments = await fetchMoreComments();
    setComments((prev) => [...prev, ...newComments]);
    setHasMore(newComments.length > 0);
  };

  return (
    <CommentSection
      comments={comments}
      hasMore={hasMore}
      onLoadMore={loadMore}
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
