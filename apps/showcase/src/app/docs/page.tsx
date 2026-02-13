import Link from 'next/link';
import { DocSection, CodeBlock, CodeTabs } from '@/components/docs';
import { HeadlessDemo } from '@/components/HeadlessDemo';
import { CommentSectionShowcase } from '@/components/CommentSectionShowcase';

export default function DocsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 lg:px-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          @comment-section/react
        </h1>
        <p className="text-muted-foreground">
          Full API and usage reference for the comment section package.
        </p>
      </div>

      {/* ── Overview ─────────────────────────────────────────────────── */}
      <DocSection id="overview" title="Overview">
        <p className="mb-4">
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            @comment-section/react
          </code>{' '}
          is a highly customizable, TypeScript-ready React comment section component with reply support, reactions, and optimistic updates. The library uses a <strong>sync API</strong> for all data callbacks (no Promises required) and supports <strong>user-controlled loading</strong> via <code>isSubmittingComment</code> and <code>isSubmittingReply</code>. It is <strong>headless-first</strong>: the default <code>CommentSection</code> has minimal unstyled UI; use <code>renderReplyForm</code> and <code>renderComment</code> to supply your own UI. This showcase app implements a Shadcn-style comment section as a reference (see <code>src/components/comment-ui</code>); the package itself has zero dependencies and does not ship styled presets.
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

      {/* ── Installation ─────────────────────────────────────────────── */}
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

      {/* ── Quick Start ──────────────────────────────────────────────── */}
      <DocSection id="quick-start" title="Quick Start">
        <p className="mb-4">Use a sync handler: update your state and return the new comment. Use <code>CommentSection</code> (headless) or build your own styled UI with the headless API. This showcase uses a local Shadcn-style component from <code>@/components/comment-ui</code>.</p>
        <CodeTabs
          tabs={[
            {
              label: 'Shadcn-style (showcase)',
              code: `import { generateUniqueId, type Comment, type CommentUser } from '@comment-section/react';
import { ShadcnCommentSection } from '@/components/comment-ui'; // or your own UI

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
    <ShadcnCommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      showReactions
    />
  );
}`,
            },
            {
              label: 'Headless',
              code: `import { CommentSection, generateUniqueId, type Comment, type CommentUser } from '@comment-section/react';

function App() {
  const [comments, setComments] = useState<Comment[]>([]);

  const handleSubmit = (content: string): Comment => {
    const newComment = { id: generateUniqueId(), content, author: currentUser, createdAt: new Date(), reactions: [], replies: [] };
    setComments((prev) => [newComment, ...prev]);
    return newComment;
  };

  return (
    <CommentSection
      comments={comments}
      currentUser={currentUser}
      onSubmitComment={handleSubmit}
      renderReplyForm={({ onSubmit, placeholder }) => (
        <MyCustomForm onSubmit={onSubmit} placeholder={placeholder} />
      )}
    />
  );
}`,
            },
            {
              label: 'Headless Hooks',
              code: `import { CommentSectionProvider, useCommentSection, HeadlessCommentItem } from '@comment-section/react';

function CustomComments() {
  const { comments, addComment } = useCommentSection();
  return (
    <div>
      {comments.map(c => (
        <HeadlessCommentItem key={c.id} comment={c}>
          {({ content, author, onReply }) => (
            <div>
              <strong>{author.name}</strong>
              <p>{content}</p>
              <button onClick={onReply}>Reply</button>
            </div>
          )}
        </HeadlessCommentItem>
      ))}
    </div>
  );
}`,
            },
          ]}
        />
      </DocSection>

      {/* ═══════════════════  INTERACTIVE DEMOS  ═══════════════════════ */}
      <DocSection id="demo-headless" title="Demo: Headless Preset">
        <p className="mb-4">
          The default <code>CommentSection</code> renders a minimal, unstyled UI. Perfect for building fully custom interfaces with your own components and styles.
        </p>
        <HeadlessDemo />
      </DocSection>

      <DocSection id="demo-shadcn" title="Demo: ShadCN Preset">
        <p className="mb-4">
          The <code>ShadcnCommentSection</code> preset gives you a polished Tailwind + Radix styled experience out of the box.
        </p>
        <CommentSectionShowcase />
      </DocSection>

      {/* ── API Reference ────────────────────────────────────────────── */}
      <DocSection id="api-reference" title="API Reference">
        <p className="mb-4">
          The package provides a headless default (<code>CommentSection</code> with minimal UI) and headless building blocks (Provider, HeadlessCommentItem, HeadlessReplyForm, hooks). This showcase app implements a Shadcn-style UI in <code>src/components/comment-ui</code> as a reference. The sections below summarize components, props, hooks, types, and core helpers.
        </p>
      </DocSection>

      <DocSection id="api-components" title="Components">
        <p className="mb-2 font-medium">From the package</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>CommentSection</code> – Headless default with <strong>minimal unstyled</strong> UI (plain form + comment rows). Use <code>renderReplyForm</code> and <code>renderComment</code> to supply your own UI.</li>
        </ul>
        <p className="mb-2 font-medium">Shadcn-style UI (showcase only)</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>ShadcnCommentSection</code>, <code>ShadcnCommentItem</code>, <code>ShadcnActionBar</code>, <code>ShadcnReplyForm</code>, <code>ShadcnReactionButton</code>, <code>ShadcnAvatar</code> – implemented in this repo under <code>apps/showcase/src/components/comment-ui</code>. Copy or adapt that folder to use a styled Tailwind/shadcn-friendly UI in your app.</li>
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
          <li><strong>Callbacks (all sync):</strong> <code>onSubmitComment</code> – (content: string) =&gt; Comment; <code>onReply</code> – (commentId, content) =&gt; Comment; <code>onEdit</code> – (commentId, content) =&gt; Comment; <code>onReaction</code> – (commentId, reactionId) =&gt; void; <code>onDelete</code> – (commentId) =&gt; void</li>
          <li><code>isSubmittingComment</code>, <code>isSubmittingReply</code> – boolean (user-controlled loading)</li>
          <li><code>renderReplyForm</code> – (props: RenderReplyFormProps) =&gt; ReactNode</li>
          <li><code>onLoadMore</code> – () =&gt; Comment[] | void (sync)</li>
          <li><code>maxDepth</code> – number (default 3)</li>
          <li><code>theme</code> – CommentTheme</li>
          <li><code>readOnly</code>, <code>showReactions</code>, <code>showMoreOptions</code></li>
          <li><code>sortOrder</code> – &apos;asc&apos; | &apos;desc&apos; | &apos;oldest&apos; | &apos;newest&apos; | &apos;popular&apos;</li>
          <li><code>inputPlaceholder</code>, <code>texts</code>, <code>availableReactions</code></li>
          <li><code>renderContent</code>, <code>renderAvatar</code>, <code>renderTimestamp</code>, <code>renderEmpty</code>, <code>renderComment</code>, etc.</li>
        </ul>
        <p className="mb-2"><strong>CommentItemProps</strong>, <strong>ReplyFormProps</strong>, <strong>RenderReplyFormProps</strong> (onSubmit, onCancel, placeholder, disabled, isSubmitting, parentComment), <strong>ReactionButtonProps</strong>, <strong>AvatarProps</strong>, <strong>ActionBarProps</strong> – see TypeScript types exported from the package.</p>
      </DocSection>

      <DocSection id="api-hooks" title="Hooks">
        <p className="mb-2 font-medium">Comment section hooks</p>
        <ul className="list-disc pl-6 mb-4 space-y-1 text-sm">
          <li><code>useCommentSection</code> – Access context (comments, submit, reply, etc.). Context also exposes <code>isSubmittingComment</code> and <code>isSubmittingReply</code> for use in custom forms.</li>
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
          <li><code>RenderReplyFormProps</code> – onSubmit, onCancel, placeholder, disabled, isSubmitting, parentComment</li>
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
  RenderReplyFormProps,
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
          <li><strong>Default preset</strong> – <code>CommentSection</code> is the <strong>headless default</strong> with minimal unstyled UI. Use it with <code>renderReplyForm</code> and <code>renderComment</code> for your own UI.</li>
          <li><strong>Shadcn-style reference</strong> – This showcase app implements a Shadcn-style comment section in <code>src/components/comment-ui</code> using the headless API. Copy or adapt that implementation for a styled Tailwind/shadcn-friendly UI in your project.</li>
          <li><strong>Headless</strong> – Use <code>CommentSectionProvider</code>, <code>HeadlessCommentItem</code>, <code>HeadlessReplyForm</code>, and hooks to build a fully custom UI.</li>
        </ul>
      </DocSection>

      <DocSection id="customization" title="Customization">
        <p className="mb-2 font-medium">Custom form (renderReplyForm)</p>
        <p className="mb-2 text-sm text-muted-foreground">Pass a function that receives <code>{'{ onSubmit, placeholder, disabled, isSubmitting }'}</code> (and optionally <code>onCancel</code>, <code>parentComment</code>) and renders your own form.</p>
        <CodeBlock
          code={`<CommentSection
  renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
    <div>
      <textarea placeholder={placeholder} disabled={disabled} />
      <button onClick={() => onSubmit(content)} disabled={disabled || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )}
  {...props}
/>`}
        />
        <p className="mb-2 mt-4 font-medium">Loading state</p>
        <p className="mb-2 text-sm text-muted-foreground">Set <code>isSubmittingComment</code> (or <code>isSubmittingReply</code>) to <code>true</code> before an async API call and back to <code>false</code> when done; the preset disables the submit button and shows &quot;Submitting…&quot;.</p>
        <CodeBlock
          code={`const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = (content: string): Comment => {
  const newComment = createComment(content);
  setComments((prev) => [newComment, ...prev]);
  setIsSubmitting(true);
  fetch('/api/comments', { method: 'POST', body: JSON.stringify({ content }) })
    .finally(() => setIsSubmitting(false));
  return newComment;
};

<CommentSection
  onSubmitComment={handleSubmit}
  isSubmittingComment={isSubmitting}
  {...props}
/>`}
        />
        <p className="mb-2 mt-4 font-medium">Theme (CommentTheme)</p>
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
        <p className="mb-2 text-sm text-muted-foreground">Use a sync handler that updates state and returns the new comment. Optionally set <code>isSubmittingComment</code> / <code>isSubmittingReply</code> and pass them to the component for loading UI.</p>
        <CodeTabs
          tabs={[
            {
              label: 'ShadCN + API',
              code: `const [comments, setComments] = useState<Comment[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);

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
  setIsSubmitting(true);
  fetch('/api/comments', { method: 'POST', body: JSON.stringify({ content }) })
    .finally(() => setIsSubmitting(false));
  return newComment;
};

<ShadcnCommentSection
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={handleSubmit}
  isSubmittingComment={isSubmitting}
/>`,
            },
            {
              label: 'Load More',
              code: `const loadMore = () => {
  fetchMoreComments().then((newComments) => {
    setComments((prev) => [...prev, ...newComments]);
  });
};

<CommentSection
  comments={comments}
  hasMore={hasMore}
  onLoadMore={loadMore}
  {...props}
/>`,
            },
          ]}
        />
      </DocSection>

      <DocSection id="live-demo" title="Live Demo">
        <p className="mb-4">
          A full interactive demo with comments, replies, reactions, edit, and delete is available on the homepage.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Open live demo
        </Link>
      </DocSection>
    </div>
  );
}
