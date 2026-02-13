'use client';

import Link from 'next/link';
import { CommentSectionShowcase } from '@/components/CommentSectionShowcase';
import { Button } from '@/components/ui/button';

/* ─── Preset cards ───────────────────────────────────────────────────── */
const PRESETS = [
  {
    name: 'Headless',
    desc: 'Unstyled primitives with render props, hooks & full control. Build your own UI from scratch.',
    code: `import { CommentSection } from '@headless-comments/react';

<CommentSection
  renderComment={({ comment }) => (
    <MyCustomComment comment={comment} />
  )}
  {...props}
/>`,
  },
  {
    name: 'Default',
    desc: 'Minimal, clean UI with sensible defaults. Drop in and go — works everywhere.',
    code: `import { CommentSection } from '@headless-comments/react';

<CommentSection
  comments={comments}
  currentUser={user}
  onSubmitComment={handleSubmit}
/>`,
  },
  {
    name: 'Styled',
    desc: 'CSS-only preset from the package. Zero Tailwind/Radix — import the stylesheet and theme via --cs-* variables.',
    code: `import '@headless-comments/react/presets/styled/styles.css';
import { StyledCommentSection } from '@headless-comments/react';

<StyledCommentSection
  comments={comments}
  currentUser={user}
  onSubmitComment={handleSubmit}
/>`,
  },
  {
    name: 'ShadCN',
    desc: 'Tailwind + Radix styled UI. This showcase implements it in src/components/comment-ui using the headless package.',
    code: `import { ShadcnCommentSection } from '@/components/comment-ui';

<ShadcnCommentSection
  comments={comments}
  currentUser={user}
  onSubmitComment={handleSubmit}
  showReactions
/>`,
  },
] as const;

/* ─── Steps ──────────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01',
    title: 'Install',
    code: 'npm install @headless-comments/react',
  },
  {
    num: '02',
    title: 'Configure',
    code: `const handleSubmit = (content: string): Comment => {
  const comment = createComment(content);
  setComments(prev => [comment, ...prev]);
  return comment;
};`,
  },
  {
    num: '03',
    title: 'Ship',
    code: `<ShadcnCommentSection
  comments={comments}
  currentUser={user}
  onSubmitComment={handleSubmit}
  showReactions
/>
{/* ShadcnCommentSection from @/components/comment-ui in this showcase */}`,
  },
] as const;

/* ═══════════════════════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Skip link */}
      <a
        href="#demo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Skip to live demo
      </a>

      {/* ── Ambient (Heartbeat: white/black/transparent only) ─────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="anim-glow absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-foreground/[0.03] via-transparent to-transparent blur-3xl" />
      </div>

      {/* ══════════════════════  HERO  ══════════════════════════════════ */}
      <section
        className="container mx-auto max-w-3xl px-4 sm:px-6 pt-24 pb-24 sm:pt-32 sm:pb-32 text-center"
        aria-label="Introduction"
      >
        {/* Badge — Heartbeat: muted, no decorative color */}
        <div className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground font-medium mb-8">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/40 anim-float" />
          Open-source &middot; MIT Licensed
        </div>

        <h1 className="anim-fade-up anim-fade-up-d1 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
          Comments, Built for Developers
        </h1>

        <p className="anim-fade-up anim-fade-up-d2 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
          The comment section you actually want to ship. Headless React, full TypeScript, nested replies & reactions — drop in and go, no backend required.
        </p>

        {/* CTAs — primary = CTA color, secondary = outline */}
        <div className="anim-fade-up anim-fade-up-d3 flex flex-wrap items-center justify-center gap-4 mb-8">
          <Button asChild size="lg" className="rounded-full font-semibold px-8 h-12 text-base transition-[transform,color] duration-300 ease-heartbeat">
            <Link href="/docs">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full font-semibold px-8 h-12 text-base border-foreground/20 text-foreground hover:bg-muted transition-[transform,color] duration-300 ease-heartbeat">
            <Link href="#demo">View Demo</Link>
          </Button>
        </div>

        {/* Install snippet — 8pt padding */}
        <div className="anim-fade-up anim-fade-up-d4">
          <code className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-3 rounded-full text-sm font-mono border border-border select-all">
            <span className="text-foreground/40">$</span> npm install @headless-comments/react
          </code>
        </div>
      </section>

      {/* ══════════════════════  LIVE DEMO  ═════════════════════════════ */}
      <section
        id="demo"
        className="container mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 scroll-mt-8"
        aria-labelledby="demo-heading"
      >
        <div className="text-center mb-8">
          <h2 id="demo-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Try it live
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Add comments, reply, react, edit, delete — everything runs in-memory.
          </p>
        </div>

        <CommentSectionShowcase />
      </section>

      {/* ══════════════════════  TECH STACK  ════════════════════════════ */}
      <section className="container mx-auto max-w-3xl px-4 sm:px-6 py-12 border-t border-border">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-6 font-medium">
          Built with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-muted-foreground">
          {['React 19', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'CVA'].map((t) => (
            <span key={t} className="transition-colors duration-300 ease-heartbeat hover:text-foreground">{t}</span>
          ))}
        </div>
      </section>

      {/* ══════════════════════  CTA FOOTER  ═══════════════════════════ */}
      <section className="container mx-auto max-w-2xl px-4 sm:px-6 py-24 sm:py-32 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Ready to ship?
        </h2>
        <p className="text-muted-foreground mb-8">
          Add comments to your app in under five minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Button asChild size="lg" className="rounded-full font-semibold px-8 h-12 text-base">
            <Link href="/docs">Read the docs</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full font-semibold px-8 h-12 text-base border-foreground/20 text-foreground hover:bg-muted">
            <a href="https://github.com/yourusername/comment-section" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
        </div>
        <code className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-3 rounded-full text-sm font-mono border border-border select-all">
          <span className="text-foreground/40">$</span> npm install @headless-comments/react
        </code>
      </section>

    </main>
  );
}
