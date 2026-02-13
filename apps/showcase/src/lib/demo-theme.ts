import type { CommentTheme } from '@hasthiya_/headless-comments-react';

/**
 * Theme-aware theme for demos. Uses CSS variables from the design system
 * so demos respond correctly to light/dark mode.
 */
export const themeAwareDemoTheme: CommentTheme = {
  backgroundColor: 'hsl(var(--background))',
  textColor: 'hsl(var(--foreground))',
  secondaryTextColor: 'hsl(var(--muted-foreground))',
  borderColor: 'hsl(var(--border))',
  hoverBackgroundColor: 'hsl(var(--accent))',
  primaryColor: 'hsl(var(--primary))',
  secondaryColor: 'hsl(var(--muted-foreground))',
  fontFamily: 'inherit',
  fontSize: '14px',
  borderRadius: 'var(--radius)',
};

