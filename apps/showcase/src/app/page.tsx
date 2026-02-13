'use client';

import Link from 'next/link';
import { CommentSectionShowcase } from '@/components/CommentSectionShowcase';
import { HeroCommentPreview } from '@/components/HeroCommentPreview';
import { Button } from '@/components/ui/button';

/* ─── Preset cards ───────────────────────────────────────────────────── */
const PRESETS = [
  {
    name: 'Headless',
    desc: 'Unstyled primitives with render props, hooks & full control. Build your own UI from scratch.',
    code: `import { CommentSection } from '@comment-section/react';

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
    code: `import { CommentSection } from '@comment-section/react';

<CommentSection
  comments={comments}
  currentUser={user}
  onSubmitComment={handleSubmit}
/>`,
  },
  {
    name: 'ShadCN',
    desc: 'Tailwind + Radix styled preset. Plug into your existing shadcn/ui design system instantly.',
    code: `import { ShadcnCommentSection } from '@comment-section/react';

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
    code: 'npm install @comment-section/react',
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
/>`,
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
        className="container mx-auto max-w-3xl px-6 pt-24 pb-24 sm:pt-32 sm:pb-32 text-center"
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
          A drop-in, headless-first React comment section. Nested replies, reactions, optimistic updates, full TypeScript — zero backend required.
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

        {/* Hero comment preview — compact, 1–2 comments */}
        <div className="anim-fade-up anim-fade-up-d3 mb-8">
          <HeroCommentPreview />
        </div>

        {/* Install snippet — 8pt padding */}
        <div className="anim-fade-up anim-fade-up-d4">
          <code className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-3 rounded-full text-sm font-mono border border-border select-all">
            <span className="text-foreground/40">$</span> npm install @comment-section/react
          </code>
        </div>
      </section>

      {/* ══════════════════════  QUICK HIGHLIGHTS  ═══════════════════ */}
      <section
        className="container mx-auto max-w-3xl px-6 py-8 sm:py-12"
        aria-label="Quick highlights"
      >
        <p className="text-center text-sm text-muted-foreground">
          Headless · Reactions · TypeScript · Accessible
        </p>
      </section>

      {/* ══════════════════════  LIVE DEMO  ═════════════════════════════ */}
      <section
        id="demo"
        className="container mx-auto max-w-3xl px-6 py-16 sm:py-24 scroll-mt-8"
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

      {/* ══════════════════════  PRESETS  ════════════════════════════════ */}
      <section
        className="container mx-auto max-w-5xl px-6 py-16 sm:py-24 border-t border-border"
        aria-labelledby="presets-heading"
      >
        <div className="text-center mb-12">
          <h2 id="presets-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Three ways to use it
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Start with full control, grab the unstyled default, or plug into your ShadCN design system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRESETS.map((preset) => (
            <div
              key={preset.name}
              className="rounded-xl border border-border bg-card overflow-hidden transition-colors duration-300 ease-heartbeat hover:border-foreground/20"
            >
              <div className="p-6 border-b border-border">
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{preset.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{preset.desc}</p>
              </div>
              <pre className="p-4 text-xs font-mono leading-relaxed text-muted-foreground overflow-x-auto bg-muted/50">
                <code>{preset.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════  HOW IT WORKS  ══════════════════════════ */}
      <section
        className="container mx-auto max-w-4xl px-6 py-16 sm:py-24 border-t border-border"
        aria-labelledby="steps-heading"
      >
        <div className="text-center mb-12">
          <h2 id="steps-heading" className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Up and running in minutes
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Three steps. That&apos;s it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="relative">
              <span className="font-display text-5xl font-black text-border leading-none mb-4 block">
                {step.num}
              </span>
              <h3 className="font-display font-bold text-lg text-foreground mb-4">{step.title}</h3>
              <pre className="rounded-lg border border-border bg-muted/50 p-4 text-xs font-mono leading-relaxed text-muted-foreground overflow-x-auto">
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════  TECH STACK  ════════════════════════════ */}
      <section className="container mx-auto max-w-3xl px-6 py-12 border-t border-border">
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
      <section className="container mx-auto max-w-2xl px-6 py-24 sm:py-32 text-center">
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
          <span className="text-foreground/40">$</span> npm install @comment-section/react
        </code>
      </section>

    </main>
  );
}
