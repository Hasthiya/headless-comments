import Link from 'next/link';
import { DocSection, CodeBlock, CodeTabs } from '@/components/docs';

export default function DocsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 lg:px-8 space-y-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          @hasthiya_/headless-comments-react
        </h1>
        <p className="text-muted-foreground text-lg">
          A headless-first React comment engine: standalone hooks, composable per-comment primitives, pluggable adapters, and optional styled presets. TypeScript-native with generic <code>{'Comment<T>'}</code> support.
        </p>
      </div>

      {/* ── Installation ─────────────────────────────────────────────────── */}
      <DocSection id="installation" title="Installation">
        <p>Install the package with your package manager. Only React 18+ and React-DOM are required as peer dependencies.</p>
        <CodeBlock
          code={`npm install @hasthiya_/headless-comments-react
# or
yarn add @hasthiya_/headless-comments-react
# or
pnpm add @hasthiya_/headless-comments-react`}
          lang="bash"
        />
      </DocSection>

      {/* ── Quick Start ──────────────────────────────────────────────────── */}
      <DocSection id="quick-start" title="Quick Start">
        <p>The fastest way to get a comment section running. Use <code>useCommentTree</code> for state management and pass the <code>tree</code> to any preset component. No manual state, no custom handlers needed.</p>
        <CodeTabs
          tabs={[
            {
              label: 'Styled preset',
              code: `import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
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
      includeDislike
    />
  );
}`,
            },
            {
              label: 'Headless (unstyled)',
              code: `import {
  CommentSection,
  useCommentTree,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';

const currentUser: CommentUser = {
  id: 'user-1',
  name: 'John Doe',
};

function App() {
  const tree = useCommentTree({
    initialComments: [],
    currentUser,
  });

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
}`,
            },
            {
              label: 'With REST adapter',
              code: `import {
  StyledCommentSection,
  useCommentTree,
  createRestAdapter,
  type CommentUser,
} from '@hasthiya_/headless-comments-react';
import '@hasthiya_/headless-comments-react/presets/styled/styles.css';

const currentUser: CommentUser = { id: 'user-1', name: 'John Doe' };

const adapter = createRestAdapter({
  baseUrl: '/api/comments',
  headers: { Authorization: 'Bearer token' },
});

function App() {
  const tree = useCommentTree({
    currentUser,
    adapter, // Comments loaded from API, mutations persisted automatically
  });

  return (
    <StyledCommentSection
      tree={tree}
      currentUser={currentUser}
      showReactions
    />
  );
}`,
            },
          ]}
        />
        <p className="mt-4">A full live demo with Default, Shadcn, and Styled presets is on the <Link href="/" className="text-primary underline hover:no-underline">homepage</Link>.</p>
      </DocSection>

      {/* ── Architecture ─────────────────────────────────────────────────── */}
      <DocSection id="architecture" title="Architecture">
        <p>The library is organized into three independent layers. Each can be used on its own or combined:</p>
        <div className="space-y-4 mt-4">
          <div className="rounded-md border border-border p-4">
            <p className="font-medium">Core (framework-agnostic)</p>
            <p className="text-sm text-muted-foreground mt-1">
              Pure functions for tree manipulation (<code>addToTree</code>, <code>removeFromTree</code>, <code>updateInTree</code>, <code>toggleReactionInTree</code>), sorting, filtering, and the adapter interface. Zero React dependency &mdash; use these in Node.js, Vue, or any runtime.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-mono">import {'{ addToTree, sortComments }'} from &apos;@hasthiya_/headless-comments-react/core&apos;</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="font-medium">Headless React Layer</p>
            <p className="text-sm text-muted-foreground mt-1">
              React hooks and unstyled components. <code>useCommentTree</code> for standalone state, composable hooks (<code>useEditComment</code>, <code>useReplyTo</code>, <code>useCommentReaction</code>) for per-comment logic, and <code>CommentSectionProvider</code> for context distribution.
            </p>
            <p className="text-xs text-muted-foreground mt-2 font-mono">import {'{ useCommentTree, useEditComment }'} from &apos;@hasthiya_/headless-comments-react/headless&apos;</p>
          </div>
          <div className="rounded-md border border-border p-4">
            <p className="font-medium">Presets (UI)</p>
            <p className="text-sm text-muted-foreground mt-1">
              Ready-to-use styled components. <code>StyledCommentSection</code> (CSS variables, no Tailwind) and <code>CommentSection</code> (minimal unstyled). Both accept a <code>tree</code> prop from <code>useCommentTree</code>.
            </p>
          </div>
        </div>
      </DocSection>

      {/* ── useCommentTree ───────────────────────────────────────────────── */}
      <DocSection id="use-comment-tree" title="useCommentTree">
        <p>The flagship hook. Manages all comment state internally: add, reply, edit, delete, and reactions with correct count toggling. Works standalone (no Provider required) and supports adapters for persistence.</p>

        <p className="font-medium mt-6 mb-2">Basic usage (local state only)</p>
        <CodeBlock
          code={`import { useCommentTree, type Comment, type CommentUser } from '@hasthiya_/headless-comments-react';

const currentUser: CommentUser = { id: 'user-1', name: 'John Doe' };

function MyComments() {
  const tree = useCommentTree({
    initialComments: existingComments,
    currentUser,
  });

  // tree.comments — the current nested comment array
  // tree.addComment('Hello!') — add a root comment
  // tree.addReply(parentId, 'Great point!') — reply to a comment
  // tree.editComment(id, 'Updated text') — edit a comment
  // tree.deleteComment(id) — delete a comment and its replies
  // tree.toggleReaction(id, 'like') — toggle a reaction (count auto-updates)
  // tree.totalCount — total comments including nested replies
  // tree.findComment(id) — find a comment by ID in the tree

  return <div>{/* render tree.comments */}</div>;
}`}
          lang="tsx"
        />

        <p className="font-medium mt-6 mb-2">With an adapter (REST API)</p>
        <CodeBlock
          code={`import {
  useCommentTree,
  createRestAdapter,
} from '@hasthiya_/headless-comments-react';

const adapter = createRestAdapter({
  baseUrl: '/api/comments',
  headers: { Authorization: \`Bearer \${token}\` },
});

function MyComments() {
  const tree = useCommentTree({
    currentUser,
    adapter,
    onError: (err) => console.error('Adapter error:', err),
  });

  // tree.isLoading — true while fetching initial comments
  // tree.error — Error object if adapter failed (null otherwise)
  // All mutations are optimistic with automatic rollback on failure
}`}
          lang="tsx"
        />

        <p className="font-medium mt-6 mb-2">Passing tree to preset components</p>
        <p className="text-sm text-muted-foreground mb-2">When you pass the <code>tree</code> prop, the component uses your external tree instead of creating its own internal one. This gives you full control over the comment state.</p>
        <CodeBlock
          code={`// The component uses your tree — no duplicate state
<StyledCommentSection
  tree={tree}
  currentUser={currentUser}
  showReactions
  includeDislike
/>

// Works with any preset
<CommentSection tree={tree} currentUser={currentUser} />
<ShadcnCommentSection tree={tree} currentUser={currentUser} />`}
          lang="tsx"
        />

        <p className="font-medium mt-6 mb-2">UseCommentTreeOptions</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Option</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">initialComments</td><td className="py-2 pr-4 text-muted-foreground">Comment[]</td><td className="py-2">Initial comments (flat or nested, auto-detected)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currentUser</td><td className="py-2 pr-4 text-muted-foreground">CommentUser</td><td className="py-2">Current user for authoring new comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">adapter</td><td className="py-2 pr-4 text-muted-foreground">{'CommentAdapter<T>'}</td><td className="py-2">Adapter for async persistence (REST, Supabase, etc.)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">generateId</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; string</td><td className="py-2">Custom ID generator (default: generateUniqueId)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">defaultReactions</td><td className="py-2 pr-4 text-muted-foreground">ReactionConfig[]</td><td className="py-2">Default reactions for new comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onError</td><td className="py-2 pr-4 text-muted-foreground">(error: Error) =&gt; void</td><td className="py-2">Called when an adapter operation fails (after rollback)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-6 mb-2">UseCommentTreeReturn</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Property</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">comments</td><td className="py-2 pr-4 text-muted-foreground">{'Comment<T>[]'}</td><td className="py-2">Current nested comment tree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">addComment</td><td className="py-2 pr-4 text-muted-foreground">(content) =&gt; {'Comment<T>'}</td><td className="py-2">Add a root-level comment (returns it immediately)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">addReply</td><td className="py-2 pr-4 text-muted-foreground">(parentId, content) =&gt; {'Comment<T>'}</td><td className="py-2">Add a reply to a comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">editComment</td><td className="py-2 pr-4 text-muted-foreground">(id, content) =&gt; {'Promise<void>'}</td><td className="py-2">Edit a comment (optimistic + adapter)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">deleteComment</td><td className="py-2 pr-4 text-muted-foreground">(id) =&gt; {'Promise<void>'}</td><td className="py-2">Delete a comment and its subtree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">toggleReaction</td><td className="py-2 pr-4 text-muted-foreground">(commentId, reactionId) =&gt; {'Promise<void>'}</td><td className="py-2">Toggle a reaction (auto increment/decrement count)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">setComments</td><td className="py-2 pr-4 text-muted-foreground">(comments) =&gt; void</td><td className="py-2">Replace the entire tree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">findComment</td><td className="py-2 pr-4 text-muted-foreground">(id) =&gt; {'Comment<T> | undefined'}</td><td className="py-2">Find a comment by ID in the tree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">totalCount</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2">Total comments (including nested replies)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">isLoading</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2">True while loading initial data from adapter</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">error</td><td className="py-2 pr-4 text-muted-foreground">Error | null</td><td className="py-2">Current error (null if none)</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* ── Composable Hooks ─────────────────────────────────────────────── */}
      <DocSection id="composable-hooks" title="Composable Hooks">
        <p>Granular, per-comment hooks for edit, reply, and reaction logic. Each hook is context-optional: it reads from <code>CommentSectionProvider</code> if available, or you can pass explicit callbacks for standalone use.</p>

        <div className="space-y-10 mt-6">
          <div>
            <p className="font-medium mb-2">useEditComment(commentId, options?)</p>
            <p className="text-sm text-muted-foreground mb-2">Manages edit state for a single comment: enter/exit edit mode, track content changes, handle submission.</p>
            <CodeBlock
              code={`import { useEditComment } from '@hasthiya_/headless-comments-react';

function EditButton({ commentId, currentContent }: { commentId: string; currentContent: string }) {
  const {
    isEditing,
    editContent,
    setEditContent,
    startEditing,
    submitEdit,
    cancelEdit,
    isSubmitting,
  } = useEditComment(commentId, {
    // Optional: provide your own handler (otherwise uses Provider context)
    onEdit: async (id, content) => {
      await fetch(\`/api/comments/\${id}\`, { method: 'PATCH', body: JSON.stringify({ content }) });
    },
  });

  if (isEditing) {
    return (
      <div>
        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        <button onClick={submitEdit} disabled={isSubmitting}>Save</button>
        <button onClick={cancelEdit}>Cancel</button>
      </div>
    );
  }

  return <button onClick={() => startEditing(currentContent)}>Edit</button>;
}`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">useReplyTo(commentId, options?)</p>
            <p className="text-sm text-muted-foreground mb-2">Manages reply form state: open/close form, track content, handle submission.</p>
            <CodeBlock
              code={`import { useReplyTo } from '@hasthiya_/headless-comments-react';

function ReplyButton({ commentId }: { commentId: string }) {
  const {
    isReplying,
    replyContent,
    setReplyContent,
    openReply,
    submitReply,
    cancelReply,
    isSubmitting,
  } = useReplyTo(commentId);

  if (isReplying) {
    return (
      <div>
        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
        <button onClick={submitReply} disabled={isSubmitting}>Reply</button>
        <button onClick={cancelReply}>Cancel</button>
      </div>
    );
  }

  return <button onClick={openReply}>Reply</button>;
}`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">useCommentReaction(commentId, options?)</p>
            <p className="text-sm text-muted-foreground mb-2">Toggle reactions with pending state tracking per reaction ID.</p>
            <CodeBlock
              code={`import { useCommentReaction } from '@hasthiya_/headless-comments-react';

function ReactionBar({ commentId }: { commentId: string }) {
  const { toggle, isPending, reactions } = useCommentReaction(commentId);

  return (
    <div className="flex gap-1">
      {reactions.map((r) => (
        <button
          key={r.id}
          onClick={() => toggle(r.id)}
          disabled={isPending(r.id)}
          className={r.isActive ? 'bg-blue-100' : ''}
        >
          {r.emoji} {r.count > 0 && r.count}
        </button>
      ))}
    </div>
  );
}`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">useComment(comment, options?)</p>
            <p className="text-sm text-muted-foreground mb-2">All-in-one hook that composes <code>useEditComment</code>, <code>useReplyTo</code>, and <code>useCommentReaction</code> for a single comment.</p>
            <CodeBlock
              code={`import { useComment } from '@hasthiya_/headless-comments-react';

function MyComment({ comment }) {
  const {
    isAuthor,
    edit,        // UseEditCommentReturn
    reply,       // UseReplyToReturn
    reaction,    // UseCommentReactionReturn
    showReplies,
    toggleReplies,
    deleteComment,
  } = useComment(comment);

  return (
    <div>
      <p>{comment.content}</p>
      {isAuthor && <button onClick={() => edit.startEditing(comment.content)}>Edit</button>}
      <button onClick={reply.openReply}>Reply</button>
      <button onClick={toggleReplies}>
        {showReplies ? 'Hide' : 'Show'} Replies
      </button>
    </div>
  );
}`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">useSortedComments(comments, initialOrder?, options?)</p>
            <p className="text-sm text-muted-foreground mb-2">Sort comments with optional localStorage persistence of the user&apos;s sort preference.</p>
            <CodeBlock
              code={`import { useSortedComments } from '@hasthiya_/headless-comments-react';

function SortableList({ comments }) {
  const { sortedComments, sortOrder, setSortOrder } = useSortedComments(
    comments,
    'newest',
    { persistKey: 'my-app-sort-order' } // optional: saves to localStorage
  );

  return (
    <div>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="popular">Popular</option>
      </select>
      {sortedComments.map((c) => <Comment key={c.id} comment={c} />)}
    </div>
  );
}`}
              lang="tsx"
            />
          </div>
        </div>
      </DocSection>

      {/* ── Adapters ─────────────────────────────────────────────────────── */}
      <DocSection id="adapters" title="Adapters">
        <p>Adapters connect <code>useCommentTree</code> to data sources. The adapter interface is simple: implement <code>getComments</code>, <code>createComment</code>, <code>updateComment</code>, <code>deleteComment</code>, and <code>toggleReaction</code>. Optional <code>subscribe</code> for realtime and <code>dispose</code> for cleanup.</p>

        <div className="space-y-10 mt-6">
          <div>
            <p className="font-medium mb-2">createInMemoryAdapter</p>
            <p className="text-sm text-muted-foreground mb-2">In-memory adapter with simulated async delay. Great for prototyping and tests.</p>
            <CodeBlock
              code={`import { useCommentTree, createInMemoryAdapter } from '@hasthiya_/headless-comments-react';

const adapter = createInMemoryAdapter({
  initialComments: seedComments,
  latency: 200, // simulated network delay in ms
});

const tree = useCommentTree({ currentUser, adapter });`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">createRestAdapter</p>
            <p className="text-sm text-muted-foreground mb-2">REST adapter that maps CRUD operations to HTTP endpoints. Supports custom headers, error handling, and request cancellation.</p>
            <CodeBlock
              code={`import { useCommentTree, createRestAdapter } from '@hasthiya_/headless-comments-react';

const adapter = createRestAdapter({
  baseUrl: '/api/comments',
  headers: {
    Authorization: \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
});

// API endpoints expected:
// GET    /api/comments           — fetch all comments
// POST   /api/comments           — create comment { content, parentId? }
// PATCH  /api/comments/:id       — update comment { content }
// DELETE /api/comments/:id       — delete comment
// POST   /api/comments/:id/react — toggle reaction { reactionId }

const tree = useCommentTree({ currentUser, adapter });`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">Custom adapter</p>
            <p className="text-sm text-muted-foreground mb-2">Implement the <code>{'CommentAdapter<T>'}</code> interface for any backend.</p>
            <CodeBlock
              code={`import type { CommentAdapter, Comment } from '@hasthiya_/headless-comments-react';

const myAdapter: CommentAdapter = {
  async getComments() {
    const res = await fetch('/api/comments');
    return res.json(); // Comment[] or { comments, total, hasMore }
  },
  async createComment(content, parentId?) {
    const res = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
    return res.json(); // Comment with server-generated ID
  },
  async updateComment(id, content) {
    const res = await fetch(\`/api/comments/\${id}\`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
    return res.json();
  },
  async deleteComment(id) {
    await fetch(\`/api/comments/\${id}\`, { method: 'DELETE' });
  },
  async toggleReaction(commentId, reactionId) {
    await fetch(\`/api/comments/\${commentId}/react\`, {
      method: 'POST',
      body: JSON.stringify({ reactionId }),
    });
  },
  // Optional: realtime updates
  subscribe(listener) {
    const ws = new WebSocket('/ws/comments');
    ws.onmessage = (e) => listener(JSON.parse(e.data));
    return () => ws.close();
  },
  dispose() {
    // cleanup connections
  },
};`}
              lang="tsx"
            />
          </div>
        </div>

        <p className="font-medium mt-6 mb-2">CommentAdapter Interface</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Method</th>
                <th className="text-left py-2 pr-4 font-medium">Signature</th>
                <th className="text-left py-2 font-medium">Required</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">getComments</td><td className="py-2 pr-4 text-muted-foreground">{'(options?) => Promise<Comment[] | PaginatedResponse>'}</td><td className="py-2">Optional</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">createComment</td><td className="py-2 pr-4 text-muted-foreground">{'(content, parentId?) => Promise<Comment>'}</td><td className="py-2">Yes</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">updateComment</td><td className="py-2 pr-4 text-muted-foreground">{'(id, content) => Promise<Comment>'}</td><td className="py-2">Yes</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">deleteComment</td><td className="py-2 pr-4 text-muted-foreground">{'(id) => Promise<void>'}</td><td className="py-2">Yes</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">toggleReaction</td><td className="py-2 pr-4 text-muted-foreground">{'(commentId, reactionId) => Promise<void>'}</td><td className="py-2">Yes</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">subscribe</td><td className="py-2 pr-4 text-muted-foreground">{'(listener) => () => void'}</td><td className="py-2">Optional</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">dispose</td><td className="py-2 pr-4 text-muted-foreground">{'() => void'}</td><td className="py-2">Optional</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* ── Core Utilities ───────────────────────────────────────────────── */}
      <DocSection id="core-utilities" title="Core Utilities">
        <p>Pure, framework-agnostic functions for tree manipulation, sorting, and filtering. Import from the package root or <code>@hasthiya_/headless-comments-react/core</code>.</p>

        <div className="space-y-10 mt-6">
          <div>
            <p className="font-medium mb-2">Tree mutation functions</p>
            <p className="text-sm text-muted-foreground mb-2">All tree functions are immutable &mdash; they return a new array, never mutate the original.</p>
            <CodeBlock
              code={`import {
  addToTree,
  removeFromTree,
  updateInTree,
  toggleReactionInTree,
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

// Toggle a reaction (auto increments/decrements count and flips isActive)
const afterReaction = toggleReactionInTree(tree, commentId, 'like');

// Find a comment by ID (recursive)
const comment = findCommentById(tree, 'comment-123');

// Flatten nested tree to a flat array
const flat = flattenComments(tree);

// Build nested tree from flat array (using parentId)
const nested = buildCommentTree(flatComments);

// Count all replies recursively
const replyCount = countReplies(comment);`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-2">Sorting and filtering</p>
            <CodeBlock
              code={`import {
  sortComments,
  filterComments,
  searchComments,
} from '@hasthiya_/headless-comments-react';

// Sort by newest, oldest, or popular
const sorted = sortComments(comments, 'newest');
const popular = sortComments(comments, 'popular'); // sorts by net positive reactions

// Sort recursively (sorts replies too)
const deepSorted = sortComments(comments, 'newest', { recursive: true });

// Filter comments
const filtered = filterComments(comments, (c) => !c.isDeleted);

// Search comments by content
const results = searchComments(comments, 'react hooks');`}
              lang="tsx"
            />
          </div>
        </div>

        <p className="font-medium mt-6 mb-2">All core exports</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Function</th>
                <th className="text-left py-2 pr-4 font-medium">Signature</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">addToTree</td><td className="py-2 pr-4 text-muted-foreground">(tree, comment, parentId, position) =&gt; Comment[]</td><td className="py-2">Add comment to tree (root or nested)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">removeFromTree</td><td className="py-2 pr-4 text-muted-foreground">(tree, commentId) =&gt; Comment[]</td><td className="py-2">Remove comment and its subtree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">updateInTree</td><td className="py-2 pr-4 text-muted-foreground">(tree, commentId, partial) =&gt; Comment[]</td><td className="py-2">Update comment fields</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">toggleReactionInTree</td><td className="py-2 pr-4 text-muted-foreground">(tree, commentId, reactionId) =&gt; Comment[]</td><td className="py-2">Toggle reaction with count update</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">findCommentById</td><td className="py-2 pr-4 text-muted-foreground">(tree, id) =&gt; Comment | undefined</td><td className="py-2">Find comment recursively</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">flattenComments</td><td className="py-2 pr-4 text-muted-foreground">(tree) =&gt; Comment[]</td><td className="py-2">Flatten to array</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">buildCommentTree</td><td className="py-2 pr-4 text-muted-foreground">(flat) =&gt; Comment[]</td><td className="py-2">Build nested tree from flat list</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">countReplies</td><td className="py-2 pr-4 text-muted-foreground">(comment) =&gt; number</td><td className="py-2">Count replies recursively</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">sortComments</td><td className="py-2 pr-4 text-muted-foreground">(comments, order, options?) =&gt; Comment[]</td><td className="py-2">Sort by newest/oldest/popular</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">filterComments</td><td className="py-2 pr-4 text-muted-foreground">(comments, predicate) =&gt; Comment[]</td><td className="py-2">Filter comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">searchComments</td><td className="py-2 pr-4 text-muted-foreground">(comments, query) =&gt; Comment[]</td><td className="py-2">Search by content</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">generateUniqueId</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; string</td><td className="py-2">Unique ID for comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">formatRelativeTime</td><td className="py-2 pr-4 text-muted-foreground">(date, locale?) =&gt; string</td><td className="py-2">e.g. &quot;2 hours ago&quot;</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* ── Styling ──────────────────────────────────────────────────────── */}
      <DocSection id="styling" title="Styling">
        <p>Four ways to style the comment section. Each approach works with both the <code>tree</code> prop pattern and the legacy props pattern.</p>

        <div className="space-y-10 mt-4">
          <div>
            <p className="font-medium mb-1">1. Styled preset (CSS variables)</p>
            <p className="text-muted-foreground text-sm mb-2">Import the preset stylesheet and override <code>--cs-*</code> variables. See the <Link href="/docs/styled-components" className="text-primary underline hover:no-underline">Styled Components</Link> page for the full list.</p>
            <CodeBlock
              code={`import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { StyledCommentSection, useCommentTree } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({ initialComments, currentUser });
<StyledCommentSection tree={tree} currentUser={currentUser} />`}
              lang="tsx"
            />
            <p className="text-muted-foreground text-sm mt-2 mb-2">Override variables in your CSS:</p>
            <CodeBlock
              code={`:root {
  --cs-primary-color: #8b5cf6;
  --cs-bg-color: #0f172a;
  --cs-text-color: #f8fafc;
  --cs-border-color: #334155;
}`}
              lang="css"
            />
          </div>

          <div>
            <p className="font-medium mb-1">2. Theme prop</p>
            <p className="text-muted-foreground text-sm mb-2">Pass a <code>theme</code> object for programmatic theming.</p>
            <CodeBlock
              code={`const theme = {
  primaryColor: '#f97316',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
};

<StyledCommentSection tree={tree} currentUser={currentUser} theme={theme} />`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">3. Render props (full control)</p>
            <p className="text-muted-foreground text-sm mb-2">Use <code>renderReplyForm</code>, <code>renderComment</code>, <code>renderAvatar</code>, <code>renderTimestamp</code> to supply your own UI.</p>
            <CodeBlock
              code={`<CommentSection
  tree={tree}
  currentUser={currentUser}
  renderReplyForm={({ onSubmit, placeholder }) => <MyForm onSubmit={onSubmit} placeholder={placeholder} />}
  renderComment={(comment, props) => <MyCommentCard comment={comment} {...props} />}
  renderAvatar={(user) => <img src={user.avatarUrl} alt={user.name} className="rounded-full" />}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">4. Tailwind / Shadcn (copy-paste)</p>
            <p className="text-muted-foreground text-sm mb-2">Copy the <code>apps/showcase/src/components/comment-ui</code> folder into your app. See the <Link href="/bring-your-own-ui" className="text-primary underline hover:no-underline">BYO UI</Link> page for examples.</p>
            <CodeBlock
              code={`import { ShadcnCommentSection } from '@/components/comment-ui';
import { useCommentTree } from '@hasthiya_/headless-comments-react';

const tree = useCommentTree({ initialComments, currentUser });
<ShadcnCommentSection tree={tree} currentUser={currentUser} showReactions />`}
              lang="tsx"
            />
          </div>
        </div>
      </DocSection>

      {/* ── Component API ────────────────────────────────────────────────── */}
      <DocSection id="component-api" title="Component API">
        <p>Reference for all component props. All types are exported from <code>@hasthiya_/headless-comments-react</code>.</p>

        <p className="font-medium mt-8 mb-2">CommentSectionProps (key props)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Prop</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 pr-4 font-medium">Default</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs font-semibold text-primary">tree</td><td className="py-2 pr-4 text-muted-foreground">UseCommentTreeReturn</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Pre-configured tree from useCommentTree (recommended)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">comments</td><td className="py-2 pr-4 text-muted-foreground">Comment[]</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Array of comments (alternative to tree prop)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currentUser</td><td className="py-2 pr-4 text-muted-foreground">CommentUser | null</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Logged-in user</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onSubmitComment</td><td className="py-2 pr-4 text-muted-foreground">(content) =&gt; Comment</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Legacy: create comment manually (not needed with tree)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReply</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; Comment</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Legacy: add reply manually</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReaction</td><td className="py-2 pr-4 text-muted-foreground">(commentId, reactionId) =&gt; void</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Legacy: toggle reaction manually</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEdit</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; void</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Legacy: edit comment manually</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onDelete</td><td className="py-2 pr-4 text-muted-foreground">(commentId) =&gt; void</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Legacy: delete comment manually</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showReactions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Show reaction buttons</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showMoreOptions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Show more menu (reply, edit, delete)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">includeDislike</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Include dislike in default reactions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">availableReactions</td><td className="py-2 pr-4 text-muted-foreground">ReactionConfig[]</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Custom reaction types</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">theme</td><td className="py-2 pr-4 text-muted-foreground">CommentTheme</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Colors, radius, font size, etc.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">texts</td><td className="py-2 pr-4 text-muted-foreground">CommentTexts</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Labels and placeholders</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxDepth</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2 pr-4">3</td><td className="py-2">Max reply nesting depth</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">sortOrder</td><td className="py-2 pr-4 text-muted-foreground">&apos;newest&apos; | &apos;oldest&apos; | &apos;popular&apos;</td><td className="py-2 pr-4">newest</td><td className="py-2">Sort order</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">readOnly</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Disable all interactions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputPlaceholder</td><td className="py-2 pr-4 text-muted-foreground">string</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Placeholder for comment input</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxCharLimit</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Max characters per comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderReplyForm</td><td className="py-2 pr-4 text-muted-foreground">(props) =&gt; ReactNode</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Custom form UI</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderComment</td><td className="py-2 pr-4 text-muted-foreground">(comment, props) =&gt; ReactNode</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Custom comment row</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderAvatar</td><td className="py-2 pr-4 text-muted-foreground">(user) =&gt; ReactNode</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Custom avatar</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderEmpty</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; ReactNode</td><td className="py-2 pr-4">&mdash;</td><td className="py-2">Custom empty state</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">StyledCommentSection (additional props)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Prop</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 pr-4 font-medium">Default</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">showSortBar</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Show sort bar (newest / oldest / top)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">Components</p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li><code>StyledCommentSection</code> &mdash; Styled preset: CSS-only, no Tailwind. Import the stylesheet.</li>
          <li><code>CommentSection</code> &mdash; Headless default: minimal unstyled UI.</li>
          <li><code>CommentSectionProvider</code> &mdash; Context provider for distributing tree state to children.</li>
          <li><code>HeadlessCommentItem</code> &mdash; Unstyled comment with render-prop children.</li>
          <li><code>HeadlessReplyForm</code> &mdash; Unstyled reply form with render-prop children.</li>
        </ul>
      </DocSection>

      {/* ── Types ────────────────────────────────────────────────────────── */}
      <DocSection id="types" title="Types">
        <p>All types support the generic <code>{'Comment<T>'}</code> pattern for custom metadata.</p>

        <CodeBlock
          code={`// Generic Comment with custom metadata
type MyComment = Comment<{ score: number; flair: string }>;

// The generic flows through all hooks and components
const tree = useCommentTree<{ score: number; flair: string }>({
  initialComments: myComments,
  currentUser,
});

// tree.comments is MyComment[]
// tree.addComment returns MyComment`}
          lang="tsx"
        />

        <p className="font-medium mt-6 mb-2">Core types</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 pr-4 font-medium">Key fields</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">{'Comment<T>'}</td><td className="py-2 pr-4">id, content, author, createdAt, updatedAt, parentId, replies, reactions, isEdited</td><td className="py-2">Single comment node. <code>T</code> extends <code>{'Record<string, unknown>'}</code> for custom metadata.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentUser</td><td className="py-2 pr-4">id, name, avatarUrl?, isVerified?, role?</td><td className="py-2">User (author)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">Reaction</td><td className="py-2 pr-4">id, label, emoji, count, isActive</td><td className="py-2">Reaction instance on a comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">ReactionConfig</td><td className="py-2 pr-4">id, label, emoji, activeColor?, inactiveColor?</td><td className="py-2">Reaction type configuration</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">{'CommentAdapter<T>'}</td><td className="py-2 pr-4">getComments, createComment, updateComment, deleteComment, toggleReaction, subscribe?, dispose?</td><td className="py-2">Adapter interface for data persistence</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentTheme</td><td className="py-2 pr-4">primaryColor, backgroundColor, textColor, borderColor, borderRadius, fontSize</td><td className="py-2">Theme configuration</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentTexts</td><td className="py-2 pr-4">reply, edit, delete, cancel, submit, noComments, loading</td><td className="py-2">Labels and placeholders</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">SortOrder</td><td className="py-2 pr-4">&apos;newest&apos; | &apos;oldest&apos; | &apos;popular&apos;</td><td className="py-2">Sort order enum</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      {/* ── Styled Example ───────────────────────────────────────────────── */}
      <DocSection id="styled-example" title="Styled Example">
        <p>The Styled preset is a polished, CSS-only comment section: one stylesheet import, no Tailwind or Radix. Theme via CSS variables and optional dark mode.</p>
        <p>
          <Link
            href="/docs/styled-components"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            See Styled Components
          </Link>
        </p>
      </DocSection>

      {/* ── BYO UI Example ───────────────────────────────────────────────── */}
      <DocSection id="bring-your-own-ui" title="Bring Your Own UI">
        <p>Use the headless hooks and components with your own design system. The BYO page demonstrates Reddit, Instagram, Facebook, and Slack-style UIs all powered by the same <code>useCommentTree</code> instance.</p>
        <p>
          <Link
            href="/bring-your-own-ui"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            See BYO UI Examples
          </Link>
        </p>
      </DocSection>
    </div>
  );
}
