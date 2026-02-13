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
          Headless-first React comment section: sync API, TypeScript, nested replies and reactions. Use the Styled preset for drop-in UI or bring your own with render props and hooks.
        </p>
      </div>

      <DocSection id="installation" title="Installation">
        <p>Install the package with your package manager. Only React and React-DOM are required as peer dependencies.</p>
        <CodeBlock
          code={`npm install @hasthiya_/headless-comments-react
# or
yarn add @hasthiya_/headless-comments-react
# or
pnpm add @hasthiya_/headless-comments-react`}
          lang="bash"
        />
      </DocSection>

      <DocSection id="basic-example" title="Basic Example">
        <p>Get a comment section running in two ways: use the Styled preset (import CSS and render <code>StyledCommentSection</code>) or go headless with <code>CommentSection</code> and your own form/comment UI. All callbacks are synchronous: update your state and return the new comment; the library then clears the form.</p>
        <CodeTabs
          tabs={[
            {
              label: 'Styled preset',
              code: `import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
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
}`,
            },
            {
              label: 'Headless',
              code: `import { CommentSection, generateUniqueId, type Comment, type CommentUser } from '@hasthiya_/headless-comments-react';

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
          ]}
        />
        <p>A full live demo with Default, Shadcn, and Styled presets is on the <Link href="/" className="text-primary underline hover:no-underline">homepage</Link>.</p>
      </DocSection>

      <DocSection id="styling" title="Styling: all styling methods">
        <p>Four ways to style the comment section: Styled preset CSS variables, the theme prop, render props for full control, or the Tailwind/Shadcn copy-paste implementation. Each approach has a description and code example below.</p>

        <div className="space-y-10">
          <div>
            <p className="font-medium mb-1">Styled preset (CSS variables)</p>
            <p className="text-muted-foreground text-sm mb-2">Import the preset stylesheet and override <code>--cs-*</code> variables (e.g. <code>--cs-primary-color</code>, <code>--cs-bg-color</code>). See the <Link href="/docs/styled-components" className="text-primary underline hover:no-underline">Styled Components</Link> page for the full list.</p>
            <CodeBlock
              code={`import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { StyledCommentSection } from '@hasthiya_/headless-comments-react';

<StyledCommentSection comments={comments} currentUser={currentUser} onSubmitComment={onSubmit} />`}
              lang="tsx"
            />
            <p className="text-muted-foreground text-sm mt-2 mb-2">Override variables in your CSS (e.g. <code>:root</code> or a wrapper):</p>
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
            <p className="font-medium mb-1">Theme prop (CommentTheme)</p>
            <p className="text-muted-foreground text-sm mb-2">Pass a <code>theme</code> object to any preset for colors, radius, font size, etc. Works with Styled and headless.</p>
            <CodeBlock
              code={`const theme = {
  primaryColor: '#f97316',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderColor: '#e5e7eb',
  borderRadius: '12px',
  fontSize: '14px',
};

<CommentSection theme={theme} comments={comments} currentUser={currentUser} onSubmitComment={onSubmit} />`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Render props</p>
            <p className="text-muted-foreground text-sm mb-2">Use <code>renderReplyForm</code>, <code>renderComment</code>, <code>renderContent</code>, <code>renderAvatar</code>, <code>renderTimestamp</code> to supply your own UI. Full control with headless.</p>
            <CodeBlock
              code={`<CommentSection
  renderReplyForm={({ onSubmit, placeholder }) => <MyForm onSubmit={onSubmit} placeholder={placeholder} />}
  renderComment={({ comment, children }) => <MyCommentCard comment={comment}>{children}</MyCommentCard>}
  renderAvatar={({ user }) => <MyAvatar src={user.avatarUrl} name={user.name} />}
  renderTimestamp={({ date }) => <span>{formatRelativeTime(date)}</span>}
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={onSubmit}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Tailwind / Shadcn copy-paste</p>
            <p className="text-muted-foreground text-sm mb-2">This repo includes a Shadcn-style implementation under <code>apps/showcase/src/components/comment-ui</code>. Copy that folder into your app and use <code>ShadcnCommentSection</code>.</p>
            <CodeBlock
              code={`// Copy apps/showcase/src/components/comment-ui into your app, then:

import { ShadcnCommentSection } from '@/components/comment-ui';

<ShadcnCommentSection
  comments={comments}
  currentUser={currentUser}
  onSubmitComment={onSubmit}
/>`}
              lang="tsx"
            />
          </div>
        </div>
      </DocSection>

      <DocSection id="examples" title="Examples">
        <p>Customize each part of the UI via render props or component props. Below are descriptions and code examples for each area.</p>

        <div className="space-y-10">
          <div>
            <p className="font-medium mb-1">Form</p>
            <p className="text-muted-foreground text-sm mb-2"><code>renderReplyForm</code> receives <code>onSubmit</code>, <code>placeholder</code>, <code>disabled</code>, <code>isSubmitting</code>. Build your own textarea and submit button.</p>
            <CodeBlock
              code={`<CommentSection
  renderReplyForm={({ onSubmit, placeholder, disabled, isSubmitting }) => (
    <div className="flex gap-2">
      <textarea placeholder={placeholder} disabled={disabled} />
      <button type="button" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Post'}
      </button>
    </div>
  )}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Avatar</p>
            <p className="text-muted-foreground text-sm mb-2"><code>renderAvatar</code> receives <code>CommentUser</code>; return your avatar component (image, initials, or icon).</p>
            <CodeBlock
              code={`<CommentSection
  renderAvatar={({ user }) => (
    <img
      src={user.avatarUrl ?? undefined}
      alt={user.name}
      className="w-9 h-9 rounded-full object-cover bg-muted"
    />
  )}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Reactions</p>
            <p className="text-muted-foreground text-sm mb-2"><code>availableReactions</code> configures which reactions appear; <code>renderReactions</code> replaces the whole reaction UI with your own.</p>
            <CodeBlock
              code={`// Configure which reactions appear
<CommentSection
  availableReactions={[
    { id: 'like', label: 'Like', emoji: '👍' },
    { id: 'love', label: 'Love', emoji: '❤️' },
  ]}
  {...props}
/>

// Or replace the entire reaction UI
<CommentSection
  renderReactions={({ comment, onReaction }) => (
    <YourReactionBar comment={comment} onReaction={onReaction} />
  )}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Timestamp</p>
            <p className="text-muted-foreground text-sm mb-2"><code>renderTimestamp</code> receives a <code>Date</code>; use <code>formatRelativeTime</code> from the package or your own formatter.</p>
            <CodeBlock
              code={`import { formatRelativeTime } from '@hasthiya_/headless-comments-react';

<CommentSection
  renderTimestamp={({ date }) => (
    <time dateTime={date.toISOString()}>
      {formatRelativeTime(date, { locale: 'en' })}
    </time>
  )}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Empty state</p>
            <p className="text-muted-foreground text-sm mb-2"><code>renderEmpty</code> renders when there are no comments.</p>
            <CodeBlock
              code={`<CommentSection
  renderEmpty={() => (
    <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
  )}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Loading</p>
            <p className="text-muted-foreground text-sm mb-2">Set <code>isSubmittingComment</code> / <code>isSubmittingReply</code> to show loading in the form; use <code>renderLoading</code> for initial data load.</p>
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
  renderLoading={() => <div>Loading comments…</div>}
  isLoading={loading}
  {...props}
/>`}
              lang="tsx"
            />
          </div>

          <div>
            <p className="font-medium mb-1">Sort</p>
            <p className="text-muted-foreground text-sm mb-2">Control order with the <code>sortOrder</code> prop: <code>&apos;newest&apos;</code> | <code>&apos;oldest&apos;</code> | <code>&apos;popular&apos;</code>.</p>
            <CodeBlock
              code={`<CommentSection
  sortOrder="newest"
  comments={comments}
  {...props}
/>`}
              lang="tsx"
            />
          </div>
        </div>

        <p className="font-medium mt-10 mb-2">API + loading (full example)</p>
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
        <p className="font-medium mt-6">Load more (pagination)</p>
        <CodeBlock
          code={`const loadMore = () => {
  fetchMoreComments().then((newComments) => {
    setComments((prev) => [...prev, ...newComments]);
  });
};

<CommentSection
  comments={comments}
  hasMore={hasMore}
  onLoadMore={loadMore}
  {...props}
/>`}
        />
      </DocSection>

      <DocSection id="components" title="Components">
        <p>What the package exports: presets (Styled and default headless) and building blocks (Provider, HeadlessCommentItem, HeadlessReplyForm) for custom UIs.</p>
        <p className="font-medium mt-4">From the package</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>StyledCommentSection</code> — Styled preset: CSS-only, no Tailwind. Import the stylesheet and theme via <code>--cs-*</code> variables.</li>
          <li><code>CommentSection</code> — Headless default: minimal unstyled UI. Use <code>renderReplyForm</code> and <code>renderComment</code> for your own UI.</li>
          <li><code>CommentSectionProvider</code> — Context provider. Required when using headless building blocks.</li>
          <li><code>HeadlessCommentItem</code> — Unstyled comment with render props (content, author, onReply, etc.).</li>
          <li><code>HeadlessReplyForm</code> — Unstyled reply form with render props (onSubmit, placeholder, disabled, isSubmitting).</li>
        </ul>
        <p className="mt-6">In this showcase (copy into your app if you use Tailwind/shadcn):</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>ShadcnCommentSection</code>, <code>ShadcnCommentItem</code>, <code>ShadcnActionBar</code>, <code>ShadcnReplyForm</code>, <code>ShadcnReactionButton</code>, <code>ShadcnAvatar</code> — in <code>apps/showcase/src/components/comment-ui</code>.</li>
        </ul>
      </DocSection>

      <DocSection id="component-api" title="Component API">
        <p>Reference for all props, hooks, types, and core utilities. All types are exported from <code>@hasthiya_/headless-comments-react</code>.</p>

        <p className="font-medium mt-8 mb-2">CommentSectionProps</p>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">comments</td><td className="py-2 pr-4 text-muted-foreground">Comment[]</td><td className="py-2 pr-4">—</td><td className="py-2">Array of comments to display (required)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currentUser</td><td className="py-2 pr-4 text-muted-foreground">CommentUser | null</td><td className="py-2 pr-4">—</td><td className="py-2">Logged-in user; when null, new comment form can be hidden</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onSubmitComment</td><td className="py-2 pr-4 text-muted-foreground">(content: string) =&gt; Comment</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: create new comment; update state and return the new comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReply</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; Comment</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: add reply; return the new reply comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEdit</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; Comment</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: update comment; return the updated comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReaction</td><td className="py-2 pr-4 text-muted-foreground">(commentId, reactionId) =&gt; void</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: toggle reaction on a comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onDelete</td><td className="py-2 pr-4 text-muted-foreground">(commentId) =&gt; void</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: remove comment (and its replies)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReport</td><td className="py-2 pr-4 text-muted-foreground">(commentId, reason) =&gt; void</td><td className="py-2 pr-4">—</td><td className="py-2">Optional: report a comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onLoadMore</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; Comment[] | void</td><td className="py-2 pr-4">—</td><td className="py-2">Sync: load more comments (pagination); return new comments or void</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">hasMore</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Whether more comments are available for load more</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">isLoading</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Initial load in progress (e.g. fetch comments)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">isSubmittingComment</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">User-controlled: new comment form submitting (disables submit, shows loading)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">isSubmittingReply</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">User-controlled: reply form submitting</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderReplyForm</td><td className="py-2 pr-4 text-muted-foreground">(props: RenderReplyFormProps) =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom new comment / reply form UI</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderComment</td><td className="py-2 pr-4 text-muted-foreground">(comment, props) =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom comment row UI</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderContent</td><td className="py-2 pr-4 text-muted-foreground">(comment) =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom comment body (e.g. Markdown)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderAvatar</td><td className="py-2 pr-4 text-muted-foreground">(user) =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom avatar</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderTimestamp</td><td className="py-2 pr-4 text-muted-foreground">(date) =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom timestamp</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderEmpty</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom empty state</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderLoading</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; ReactNode</td><td className="py-2 pr-4">—</td><td className="py-2">Custom loading state</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxDepth</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2 pr-4">3</td><td className="py-2">Max reply nesting depth</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">sortOrder</td><td className="py-2 pr-4 text-muted-foreground">&apos;newest&apos; | &apos;oldest&apos; | &apos;popular&apos; | &apos;asc&apos; | &apos;desc&apos;</td><td className="py-2 pr-4">newest</td><td className="py-2">Sort order for the comment list</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">readOnly</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Disable all interactions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showReactions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Show reaction buttons on comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showMoreOptions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Show more menu (reply, edit, delete, share, report)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">theme</td><td className="py-2 pr-4 text-muted-foreground">CommentTheme</td><td className="py-2 pr-4">—</td><td className="py-2">Colors, radius, font size, etc.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">texts</td><td className="py-2 pr-4 text-muted-foreground">CommentTexts</td><td className="py-2 pr-4">—</td><td className="py-2">Labels and placeholders (reply, edit, delete, noComments, etc.)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">availableReactions</td><td className="py-2 pr-4 text-muted-foreground">ReactionConfig[]</td><td className="py-2 pr-4">—</td><td className="py-2">Reaction types (id, label, emoji, activeColor)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">inputPlaceholder</td><td className="py-2 pr-4 text-muted-foreground">string</td><td className="py-2 pr-4">—</td><td className="py-2">Placeholder for new comment input</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxCharLimit</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2 pr-4">—</td><td className="py-2">Max characters in comment/reply input</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showCharCount</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Show character count when maxCharLimit is set</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">autoFocus</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Auto-focus new comment input on mount</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">includeDislike</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">false</td><td className="py-2">Include dislike in default reactions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">enableOptimisticUpdates</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Apply updates immediately before server confirmation</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">generateId</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; string</td><td className="py-2 pr-4">—</td><td className="py-2">Custom unique ID generator (default: generateUniqueId)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">className</td><td className="py-2 pr-4 text-muted-foreground">string</td><td className="py-2 pr-4">—</td><td className="py-2">Container class name</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">style</td><td className="py-2 pr-4 text-muted-foreground">CSSProperties</td><td className="py-2 pr-4">—</td><td className="py-2">Container inline styles</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">locale</td><td className="py-2 pr-4 text-muted-foreground">string</td><td className="py-2 pr-4">en</td><td className="py-2">Locale for date formatting</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">StyledCommentSection (additional props)</p>
        <p className="text-muted-foreground text-sm mb-2">Extends CommentSectionProps. Styled preset–specific display options.</p>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">showReactions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Show reaction buttons</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showMoreOptions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Show more menu</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showVerifiedBadge</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">true</td><td className="py-2">Show verified badge next to author</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxCommentLines</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2 pr-4">—</td><td className="py-2">Max lines before truncating comment body</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">RenderReplyFormProps</p>
        <p className="text-muted-foreground text-sm mb-2">Props passed to your custom form when using <code>renderReplyForm</code>.</p>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">onSubmit</td><td className="py-2 pr-4 text-muted-foreground">(content: string) =&gt; void</td><td className="py-2 pr-4">—</td><td className="py-2">Call with trimmed content to submit (sync)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onCancel</td><td className="py-2 pr-4 text-muted-foreground">() =&gt; void</td><td className="py-2 pr-4">—</td><td className="py-2">Call to cancel (e.g. when replying)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">placeholder</td><td className="py-2 pr-4 text-muted-foreground">string</td><td className="py-2 pr-4">—</td><td className="py-2">Placeholder for the textarea</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">disabled</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">Disable the form</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">isSubmitting</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2 pr-4">—</td><td className="py-2">True when isSubmittingComment or isSubmittingReply is set</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">parentComment</td><td className="py-2 pr-4 text-muted-foreground">Comment</td><td className="py-2 pr-4">—</td><td className="py-2">Set when replying to a comment</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">CommentItemProps (key props)</p>
        <p className="text-muted-foreground text-sm mb-2">Used when rendering a single comment (e.g. with HeadlessCommentItem or renderComment).</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Prop</th>
                <th className="text-left py-2 pr-4 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">comment</td><td className="py-2 pr-4 text-muted-foreground">Comment</td><td className="py-2">The comment data</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">currentUser</td><td className="py-2 pr-4 text-muted-foreground">CommentUser | null</td><td className="py-2">Logged-in user</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReply</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; void</td><td className="py-2">Reply handler (sync)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onReaction</td><td className="py-2 pr-4 text-muted-foreground">(commentId, reactionId) =&gt; void</td><td className="py-2">Reaction toggle</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onEdit</td><td className="py-2 pr-4 text-muted-foreground">(commentId, content) =&gt; void</td><td className="py-2">Edit handler (sync)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">onDelete</td><td className="py-2 pr-4 text-muted-foreground">(commentId) =&gt; void</td><td className="py-2">Delete handler</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">maxDepth</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2">Max reply depth</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">depth</td><td className="py-2 pr-4 text-muted-foreground">number</td><td className="py-2">Current nesting depth</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderContent</td><td className="py-2 pr-4 text-muted-foreground">(comment) =&gt; ReactNode</td><td className="py-2">Custom comment body</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderAvatar</td><td className="py-2 pr-4 text-muted-foreground">(user) =&gt; ReactNode</td><td className="py-2">Custom avatar</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">renderTimestamp</td><td className="py-2 pr-4 text-muted-foreground">(date) =&gt; ReactNode</td><td className="py-2">Custom timestamp</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showReactions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2">Show reactions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">showMoreOptions</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2">Show more menu</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">readOnly</td><td className="py-2 pr-4 text-muted-foreground">boolean</td><td className="py-2">Disable interactions</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">Hooks</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Hook</th>
                <th className="text-left py-2 pr-4 font-medium">Returns / purpose</th>
                <th className="text-left py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">useCommentSection</td><td className="py-2 pr-4">CommentSectionContextValue</td><td className="py-2">comments, submitComment, replyToComment, toggleReaction, editComment, deleteComment, isSubmittingComment, isSubmittingReply, texts, sortOrder, setSortOrder, loadMore, etc.</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useOptimisticUpdates</td><td className="py-2 pr-4">OptimisticState&lt;T&gt;</td><td className="py-2">data, isPending, add, update, remove, rollback, confirm</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useReplyForm</td><td className="py-2 pr-4">Reply form state</td><td className="py-2">State and handlers for reply form</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useEditMode</td><td className="py-2 pr-4">Edit state</td><td className="py-2">State and handlers for edit mode</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useReactions</td><td className="py-2 pr-4">Reaction state</td><td className="py-2">Reaction toggle state</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useAutoResize</td><td className="py-2 pr-4">ref + auto-resize</td><td className="py-2">Textarea auto-grow</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useCharacterCount</td><td className="py-2 pr-4">count, isOverLimit, remaining</td><td className="py-2">Character count for max limit</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useClickOutside</td><td className="py-2 pr-4">ref + callback</td><td className="py-2">Close on outside click</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useInfiniteScroll</td><td className="py-2 pr-4">ref + load more</td><td className="py-2">Trigger load more on scroll</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">useFocus</td><td className="py-2 pr-4">ref + focus</td><td className="py-2">Focus management</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">Types (exported)</p>
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
              <tr><td className="py-2 pr-4 font-mono text-xs">Comment</td><td className="py-2 pr-4">id, content, author, createdAt, updatedAt, parentId, replies, reactions, isEdited, isPending, hasError</td><td className="py-2">Single comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentUser</td><td className="py-2 pr-4">id, name, avatarUrl?, isVerified?, role?, metadata?</td><td className="py-2">User (author)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">Reaction</td><td className="py-2 pr-4">id, label, emoji, count, isActive?</td><td className="py-2">Reaction on a comment</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">ReactionConfig</td><td className="py-2 pr-4">id, label, emoji, activeColor?, inactiveColor?</td><td className="py-2">Reaction type config</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentTheme</td><td className="py-2 pr-4">primaryColor, backgroundColor, textColor, borderColor, borderRadius, fontSize, etc.</td><td className="py-2">Theme for styling</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">CommentTexts</td><td className="py-2 pr-4">reply, edit, delete, cancel, submit, noComments, loadMore, loading, deleteConfirm, sortNewest, etc.</td><td className="py-2">Labels and placeholders</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">OptimisticState&lt;T&gt;</td><td className="py-2 pr-4">data, isPending, add, update, remove, rollback, confirm</td><td className="py-2">Optimistic update state</td></tr>
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-8 mb-2">Core utilities (framework-agnostic)</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Function</th>
                <th className="text-left py-2 pr-4 font-medium">Signature / purpose</th>
                <th className="text-left py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">sortComments</td><td className="py-2 pr-4">(comments, order) =&gt; Comment[]</td><td className="py-2">Sort by newest, oldest, or popular</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">flattenComments</td><td className="py-2 pr-4">(comments) =&gt; Comment[]</td><td className="py-2">Flatten tree to array</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">buildCommentTree</td><td className="py-2 pr-4">(comments) =&gt; Comment[]</td><td className="py-2">Build tree from flat list with parentId</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">countReplies</td><td className="py-2 pr-4">(comment) =&gt; number</td><td className="py-2">Count total replies recursively</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">findCommentById</td><td className="py-2 pr-4">(comments, id) =&gt; Comment | null</td><td className="py-2">Find comment in tree</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">createCallbackAdapter</td><td className="py-2 pr-4">(callbacks) =&gt; CommentAdapter</td><td className="py-2">Wrap sync callbacks for Promise-based API</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">generateUniqueId</td><td className="py-2 pr-4">() =&gt; string</td><td className="py-2">Unique ID for new comments</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">formatRelativeTime</td><td className="py-2 pr-4">(date, locale?) =&gt; string</td><td className="py-2">e.g. &quot;2 hours ago&quot;</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">formatDate</td><td className="py-2 pr-4">(date, locale?) =&gt; string</td><td className="py-2">Formatted date string</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">defaultTexts</td><td className="py-2 pr-4">CommentTexts</td><td className="py-2">Default labels</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">defaultTheme</td><td className="py-2 pr-4">CommentTheme</td><td className="py-2">Default theme</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">mergeTexts</td><td className="py-2 pr-4">(base, overrides) =&gt; CommentTexts</td><td className="py-2">Merge text overrides</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">mergeTheme</td><td className="py-2 pr-4">(theme?) =&gt; CommentTheme</td><td className="py-2">Merge theme with defaults</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">themeToCSSVariables</td><td className="py-2 pr-4">(theme) =&gt; Record&lt;string, string&gt;</td><td className="py-2">Convert theme to CSS custom properties</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">truncateText</td><td className="py-2 pr-4">(text, maxLength) =&gt; string</td><td className="py-2">Truncate with ellipsis</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">copyToClipboard</td><td className="py-2 pr-4">(text) =&gt; Promise&lt;boolean&gt;</td><td className="py-2">Copy text to clipboard</td></tr>
            </tbody>
          </table>
        </div>
      </DocSection>

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
    </div>
  );
}

