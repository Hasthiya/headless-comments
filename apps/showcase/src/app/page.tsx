import { CommentSectionShowcase } from '@/components/CommentSectionShowcase';

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Comment Section</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Showcase for <code>@comment-section/react</code>
      </p>
      <CommentSectionShowcase />
    </main>
  );
}
