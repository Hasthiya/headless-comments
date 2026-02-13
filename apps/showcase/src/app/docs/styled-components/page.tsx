import Link from 'next/link';
import { DocSection, CodeBlock, StyledDemo } from '@/components/docs';

export default function StyledComponentsPage() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 lg:px-8 space-y-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Styled Components
        </h1>
        <p className="text-muted-foreground text-lg">
          The Styled preset is a polished, CSS-only comment section with zero Tailwind or Radix. Use it when you want a drop-in UI without adding Tailwind or Radix to your project. Import one stylesheet and theme via CSS variables.
        </p>
      </div>

      <DocSection id="preview" title="Styled component">
        <p className="text-muted-foreground text-sm mb-4">Live preview of <code>StyledCommentSection</code>. Add a comment, reply, react, edit, or delete to try it.</p>
        <StyledDemo />
      </DocSection>

      <DocSection id="quick-start" title="Quick start">
        <p>Import the preset CSS and render <code>StyledCommentSection</code>. All data callbacks are synchronous: update your state and return the new comment.</p>
        <CodeBlock
          code={`import '@hasthiya_/headless-comments-react/presets/styled/styles.css';
import { StyledCommentSection, generateUniqueId, type Comment, type CommentUser } from '@hasthiya_/headless-comments-react';

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
}`}
        />
      </DocSection>

      <DocSection id="css-variables" title="CSS variables">
        <p>Override these custom properties in <code>:root</code> or a wrapper element to theme the Styled preset. All variable names use the <code>--cs-*</code> prefix to avoid clashes.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Variable</th>
                <th className="text-left py-2 pr-4 font-medium">Default</th>
                <th className="text-left py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="[&_tr]:border-b [&_tr]:border-border/50">
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-primary-color</td><td className="py-2 pr-4 text-muted-foreground">#f97316</td><td className="py-2">Primary accent (buttons, links, focus)</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-secondary-color</td><td className="py-2 pr-4 text-muted-foreground">#6b7280</td><td className="py-2">Muted / avatar fallback</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-bg-color</td><td className="py-2 pr-4 text-muted-foreground">#ffffff</td><td className="py-2">Background</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-hover-bg-color</td><td className="py-2 pr-4 text-muted-foreground">#f9fafb</td><td className="py-2">Hover background</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-text-color</td><td className="py-2 pr-4 text-muted-foreground">#1f2937</td><td className="py-2">Main text</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-secondary-text-color</td><td className="py-2 pr-4 text-muted-foreground">#6b7280</td><td className="py-2">Secondary text</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-border-color</td><td className="py-2 pr-4 text-muted-foreground">#e5e7eb</td><td className="py-2">Borders</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-border-radius</td><td className="py-2 pr-4 text-muted-foreground">8px</td><td className="py-2">Border radius</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-font-family</td><td className="py-2 pr-4 text-muted-foreground">system</td><td className="py-2">Font family</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-font-size</td><td className="py-2 pr-4 text-muted-foreground">14px</td><td className="py-2">Base font size</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-avatar-size</td><td className="py-2 pr-4 text-muted-foreground">36px</td><td className="py-2">Avatar size</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-comment-spacing</td><td className="py-2 pr-4 text-muted-foreground">16px</td><td className="py-2">Vertical spacing</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-animation-duration</td><td className="py-2 pr-4 text-muted-foreground">200ms</td><td className="py-2">Transitions</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-destructive-color</td><td className="py-2 pr-4 text-muted-foreground">#dc2626</td><td className="py-2">Delete / danger</td></tr>
              <tr><td className="py-2 pr-4 font-mono text-xs">--cs-success-color</td><td className="py-2 pr-4 text-muted-foreground">#16a34a</td><td className="py-2">Success state</td></tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          code={`:root {
  --cs-primary-color: #8b5cf6;
  --cs-bg-color: #0f172a;
  --cs-text-color: #f8fafc;
  --cs-border-color: #334155;
}`}
          lang="css"
        />
      </DocSection>

      <DocSection id="dark-mode" title="Dark mode">
        <p>The same stylesheet supports light and dark. Use one of these so the preset switches correctly:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Add the class <code>cs-root--dark</code> to an ancestor of the comment section.</li>
          <li>Set <code>data-cs-theme=&quot;dark&quot;</code> on the wrapper element.</li>
          <li>If your app uses a global <code>.dark</code> class (e.g. next-themes with <code>attribute=&quot;class&quot;</code>), the Styled preset will follow it automatically.</li>
        </ul>
        <CodeBlock
          code={`<!-- Option 1: class on a wrapper -->
<div className="cs-root--dark">
  <StyledCommentSection ... />
</div>

<!-- Option 2: data attribute -->
<div data-cs-theme="dark">
  <StyledCommentSection ... />
</div>`}
          lang="html"
        />
      </DocSection>

      <DocSection id="props" title="StyledCommentSection props">
        <p><code>StyledCommentSection</code> accepts all standard CommentSection props (see the main docs Component API). In addition, these display props control the Styled preset UI:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>showSortBar</code> (default <code>true</code>) — Show sort bar (newest / oldest / top)</li>
          <li><code>showReactions</code> (default <code>true</code>) — Show reaction buttons</li>
          <li><code>showMoreOptions</code> (default <code>true</code>) — More menu (reply, edit, delete, share, report)</li>
          <li><code>showVerifiedBadge</code> (default <code>true</code>) — Verified badge next to author</li>
          <li><code>maxCommentLines</code> — Max lines before truncating comment body</li>
          <li><code>inputPlaceholder</code>, <code>maxCharLimit</code>, <code>showCharCount</code>, <code>autoFocus</code></li>
          <li><code>maxDepth</code> (default <code>3</code>) — Reply nesting depth</li>
        </ul>
      </DocSection>

      <DocSection id="demo" title="Live demo">
        <p>Try the Styled preset on the homepage: open the live demo and use the preset switcher to select &quot;Styled&quot;.</p>
        <p>
          <Link
            href="/#demo"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Open live demo
          </Link>
        </p>
        <p>
          <Link href="/docs" className="text-primary underline hover:no-underline">
            Back to docs
          </Link>
        </p>
      </DocSection>
    </div>
  );
}

