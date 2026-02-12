import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Comment Section – Showcase',
  description: 'Showcase for @comment-section/react',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
