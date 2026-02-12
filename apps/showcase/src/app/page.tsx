'use client';

import { CommentSectionShowcase } from '@/components/CommentSectionShowcase';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="container mx-auto max-w-3xl py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Comment Section</h1>
          <p className="text-muted-foreground">
            Showcase for <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">@comment-section/react</code>
          </p>
        </div>
        <Button onClick={() => alert('Shadcn UI work!')}>
          Shadcn Button
        </Button>
      </div>
      <CommentSectionShowcase />
    </main>
  );
}
