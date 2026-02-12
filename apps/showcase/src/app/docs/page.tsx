import Link from 'next/link';
import { DocSection, CodeBlock } from '@/components/docs';

export default function DocsPage() {
  return (
    <div className="container max-w-3xl py-10 px-4 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        @comment-section/react Documentation
      </h1>
      <p className="text-muted-foreground mb-10">
        Full API and usage reference for the comment section package.
      </p>

      <DocSection id="overview" title="Overview">
        <p className="mb-4">
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            @comment-section/react
          </code>{' '}
          is a highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates.
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li><strong>Optimistic updates</strong> – Instant UI updates before server confirmation</li>
          <li><strong>Nested replies</strong> – Multi-level threaded conversations</li>
          <li><strong>Reactions</strong> – Customizable reaction system (likes, hearts, etc.)</li>
          <li><strong>Fully themeable</strong> – Complete control over styling via theme and render props</li>
          <li><strong>TypeScript</strong> – Full type definitions included</li>
          <li><strong>Accessible</strong> – ARIA labels and keyboard navigation</li>
          <li><strong>Zero dependencies</strong> – Only React as peer dependency</li>
          <li><strong>Responsive</strong> – Works on all screen sizes</li>
        </ul>
      </DocSection>

      <DocSection id="installation" title="Installation">
        <p className="mb-4">Install with your package manager:</p>
        <CodeBlock
          code={`npm install @comment-section/react
# or
yarn add @comment-section/react
# or
pnpm add @comment-section/react`}
          lang="bash"
        />
      </DocSection>

      <DocSection id="quick-start" title="Quick Start">
        <p className="mb-4">Minimal example with comments, current user, and submit handler:</p>
        <CodeBlock
          code={`import { CommentSection, type Comment, type CommentUser } from '@comment-section/react';

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
    // Send to your API and return the new comment
    const res = await fetch('/api/comments', { method: 'POST', body: JSON.stringify({ content }) });
    return res.json();
  };

  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      enableOptimisticUpdates
    />
  );
}`}
        />
      </DocSection>

      <DocSection id="api-reference" title="API Reference">
        <p className="mb-4">
          The package exports styled presets (default and shadcn), headless components and hooks, core utilities, and types. The sections below summarize components, props, hooks, types, and core helpers.
        </p>
      </DocSection>

      <DocSection id="api-components" title="Components">
        <p className="mb-2 font-medium">Default preset (re-exports Shadcn)</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>CommentSection</code> – Main container</li>
          <li><code>CommentItem</code> – Single comment row</li>
          <li><code>ActionBar</code> – Reply, edit, delete, reactions</li>
          <li><code>ReplyForm</code> – Reply / edit input</li>
          <li><code>ReactionButton</code> – One reaction control</li>
          <li><code>Avatar</code> – User avatar</li>
        </ul>
        <p className="mb-2 font-medium">Shadcn preset</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>ShadcnCommentSection</code>, <code>ShadcnCommentItem</code>, <code>ShadcnActionBar</code>, <code>ShadcnReplyForm</code>, <code>ShadcnReactionButton</code>, <code>ShadcnAvatar</code></li>
        </ul>
        <p className="mb-2 font-medium">Headless (build your own UI)</p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><code>CommentSectionProvider</code> – Context provider</li>
          <li><code>HeadlessCommentItem</code> – Unstyled comment with render props</li>
          <li><code>HeadlessReplyForm</code> – Unstyled reply form with render props</li>
        </ul>
      </DocSection>

      <DocSection id="api-props" title="Props">
        <p className="mb-2"><strong>CommentSectionProps</strong> (main component)</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>comments</code> – Comment[] (required)</li>
          <li><code>currentUser</code> – CommentUser | null</li>
          <li><code>onSubmitComment</code> – (content: string) =&gt; Promise&lt;Comment&gt; | Comment</li>
          <li><code>onReply</code>, <code>onReaction</code>, <code>onEdit</code>, <code>onDelete</code> – callbacks</li>
          <li><code>maxDepth</code> – number (default 3)</li>
          <li><code>theme</code> – CommentTheme</li>
          <li><code>readOnly</code>, <code>showReactions</code>, <code>showMoreOptions</code></li>
          <li><code>sortOrder</code> – &apos;asc&apos; | &apos;desc&apos; | &apos;oldest&apos; | &apos;newest&apos; | &apos;popular&apos;</li>
          <li><code>inputPlaceholder</code>, <code>texts</code>, <code>availableReactions</code></li>
          <li><code>renderContent</code>, <code>renderAvatar</code>, <code>renderTimestamp</code>, <code>renderEmpty</code>, etc.</li>
        </ul>
        <p className="mb-2"><strong>CommentItemProps</strong>, <strong>ReplyFormProps</strong>, <strong>ReactionButtonProps</strong>, <strong>AvatarProps</strong>, <strong>ActionBarProps</strong> – see TypeScript types exported from the package.</p>
      </DocSection>

      <DocSection id="api-hooks" title="Hooks">
        <p className="mb-2 font-medium">Comment section hooks</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>useCommentSection</code> – Access context (comments, submit, reply, etc.)</li>
          <li><code>useOptimisticUpdates</code> – Optimistic state: data, add, update, remove, rollback, confirm</li>
          <li><code>useReplyForm</code> – Reply form state and handlers</li>
          <li><code>useEditMode</code> – Edit mode state and handlers</li>
          <li><code>useReactions</code> – Reaction state and toggle</li>
        </ul>
        <p className="mb-2 font-medium">Utility hooks (headless)</p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><code>useAutoResize</code>, <code>useCharacterCount</code>, <code>useClickOutside</code>, <code>useKeyboardShortcut</code>, <code>useLocalStorage</code>, <code>useDebouncedValue</code>, <code>useInfiniteScroll</code>, <code>useFocus</code>, <code>useAnimationState</code></li>
        </ul>
        <CodeBlock
          code={`import {
  useCommentSection,
  useOptimisticUpdates,
  useReplyForm,
  useEditMode,
  useReactions,
  useInfiniteScroll,
} from '@comment-section/react';`}
        />
      </DocSection>

      <DocSection id="api-types" title="Types">
        <p className="mb-4">Exported types for TypeScript:</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>Comment</code> – id, content, author, createdAt, updatedAt, parentId, replies, reactions, isEdited, isPending, hasError, etc.</li>
          <li><code>CommentUser</code> – id, name, avatarUrl, isVerified, metadata</li>
          <li><code>Reaction</code> – id, label, emoji, count, isActive</li>
          <li><code>ReactionConfig</code> – id, label, emoji, activeColor?, inactiveColor?</li>
          <li><code>CommentTheme</code> – primaryColor, backgroundColor, textColor, borderRadius, etc.</li>
          <li><code>CommentTexts</code> – reply, edit, delete, cancel, submit, noComments, etc.</li>
          <li><code>OptimisticState&lt;T&gt;</code> – data, isPending, add, update, remove, rollback, confirm</li>
          <li><code>CommentAdapter</code>, <code>CommentSectionContextValue</code>, <code>CommentSectionProps</code>, <code>CommentItemProps</code>, and related prop types</li>
        </ul>
        <CodeBlock
          code={`import type {
  Comment,
  CommentUser,
  Reaction,
  ReactionConfig,
  CommentTheme,
  CommentTexts,
  CommentSectionProps,
  CommentItemProps,
} from '@comment-section/react';`}
        />
      </DocSection>

      <DocSection id="api-core" title="Core Utilities">
        <p className="mb-2">Non-React helpers (tree, sorting, adapter, utils):</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>sortComments</code> – Sort comment array</li>
          <li><code>flattenComments</code>, <code>buildCommentTree</code>, <code>countReplies</code>, <code>findCommentById</code></li>
          <li><code>createCallbackAdapter</code> – Build CommentAdapter from callbacks</li>
          <li><code>defaultTexts</code>, <code>defaultTheme</code>, <code>defaultReactions</code></li>
          <li><code>generateUniqueId</code>, <code>formatRelativeTime</code>, <code>formatDate</code></li>
          <li><code>mergeTexts</code>, <code>mergeTheme</code>, <code>mergeReactions</code>, <code>themeToCSSVariables</code></li>
          <li><code>truncateText</code>, <code>escapeHtml</code>, <code>parseMentions</code>, <code>debounce</code>, <code>throttle</code>, <code>getDefaultAvatar</code>, <code>copyToClipboard</code>, <code>isBrowser</code></li>
        </ul>
      </DocSection>

      <DocSection id="presets" title="Presets">
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Default preset</strong> – Exports <code>CommentSection</code>, <code>CommentItem</code>, etc.; implemented as re-exports of the Shadcn preset for a single styled implementation.</li>
          <li><strong>Shadcn preset</strong> – <code>ShadcnCommentSection</code>, <code>ShadcnCommentItem</code>, <code>ShadcnActionBar</code>, <code>ShadcnReplyForm</code>, <code>ShadcnReactionButton</code>, <code>ShadcnAvatar</code>. Styled with Tailwind/shadcn-friendly classes.</li>
          <li><strong>Headless</strong> – Use <code>CommentSectionProvider</code>, <code>HeadlessCommentItem</code>, <code>HeadlessReplyForm</code>, and hooks to build a fully custom UI.</li>
        </ul>
      </DocSection>

      <DocSection id="customization" title="Customization">
        <p className="mb-2 font-medium">Theme (CommentTheme)</p>
        <CodeBlock
          code={`const theme = {
  primaryColor: '#f97316',
  secondaryColor: '#6b7280',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
};
<CommentSection theme={theme} {...props} />`}
        />
        <p className="mb-2 mt-4 font-medium">Custom reactions (availableReactions)</p>
        <CodeBlock
          code={`const reactions = [
  { id: 'like', label: 'Like', emoji: '👍', activeColor: '#f97316' },
  { id: 'love', label: 'Love', emoji: '❤️', activeColor: '#ef4444' },
];
<CommentSection availableReactions={reactions} {...props} />`}
        />
        <p className="mb-2 mt-4 font-medium">Render props</p>
        <CodeBlock
          code={`<CommentSection
  renderContent={(comment) => <Markdown>{comment.content}</Markdown>}
  renderAvatar={(user) => <CustomAvatar user={user} />}
  renderTimestamp={(date) => <TimeAgo date={date} />}
  {...props}
/>`}
        />
        <p className="mb-2 mt-4 font-medium">Texts (CommentTexts)</p>
        <CodeBlock
          code={`const texts = {
  reply: 'Reply',
  edit: 'Edit',
  delete: 'Delete',
  noComments: 'No comments yet.',
  // ... see CommentTexts type
};
<CommentSection texts={texts} {...props} />`}
        />
        <p className="mt-4">You can also set <code>sortOrder</code>, <code>maxDepth</code>, and use <code>defaultTheme</code> / <code>mergeTheme</code> from the package.</p>
      </DocSection>

      <DocSection id="examples" title="Examples">
        <p className="mb-2 font-medium">With API integration</p>
        <CodeBlock
          code={`const [comments, setComments] = useState<Comment[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  fetchComments().then((data) => {
    setComments(data);
    setIsLoading(false);
  });
}, []);

const handleSubmit = async (content: string) => {
  const res = await fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return res.json();
};

<CommentSection
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={handleSubmit}
  isLoading={isLoading}
/>`}
        />
        <p className="mb-2 mt-4 font-medium">Load more / pagination</p>
        <CodeBlock
          code={`<CommentSection
  comments={comments}
  hasMore={hasMore}
  onLoadMore={loadMore}
  {...props}
/>`}
        />
      </DocSection>

      <DocSection id="live-demo" title="Live Demo">
        <p className="mb-4">
          A full interactive demo with comments, replies, reactions, edit, and delete is available on the homepage. Try it with the button below.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          Open live demo
        </Link>
      </DocSection>
    </div>
  );
}
