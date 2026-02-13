'use client';

import React from 'react';
import type { ReactionButtonProps } from '@comment-section/react';
import { useCommentSection } from '@comment-section/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ShadcnReactionButton: React.FC<ReactionButtonProps> = ({
  reaction,
  isActive = false,
  onClick,
  showCount = true,
  className = '',
  theme: _customTheme,
  disabled = false,
  size = 'md',
}) => {
  useCommentSection();

  const buttonSize = size === 'lg' ? 'default' : 'sm';

  return (
    <Button
      type="button"
      variant="ghost"
      size={buttonSize}
      className={cn(
        'rounded-full gap-1.5 h-auto py-1.5',
        size === 'sm' && 'min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-7 px-2 text-xs',
        size === 'md' && 'min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-7 px-2.5 text-xs',
        size === 'lg' && 'min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 h-8 px-3 text-sm',
        isActive
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        className
      )}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={`${reaction.label}${showCount ? ` (${reaction.count})` : ''}`}
    >
      <span className="leading-none" style={{ fontSize: '1.1em' }}>
        {reaction.emoji}
      </span>
      {showCount && reaction.count > 0 && (
        <span
          className={cn(
            'font-medium tabular-nums',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {reaction.count}
        </span>
      )}
    </Button>
  );
};

ShadcnReactionButton.displayName = 'ShadcnReactionButton';
