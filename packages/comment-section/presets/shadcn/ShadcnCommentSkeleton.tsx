/**
 * Skeleton loader for comment items
 * @module @comment-section/presets/shadcn/ShadcnCommentSkeleton
 */

'use client';

import React from 'react';
import { cn } from '../../core/utils';

export interface ShadcnCommentSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton component matching comment layout (avatar + lines)
 * Avoids layout shift during loading.
 */
export const ShadcnCommentSkeleton: React.FC<ShadcnCommentSkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-4">
          {/* Skeleton avatar */}
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted animate-pulse" />
          {/* Skeleton content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            <div className="space-y-1">
              <div className="h-3 w-full rounded bg-muted animate-pulse" />
              <div className="h-3 w-full max-w-[80%] rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ShadcnCommentSkeleton.displayName = 'ShadcnCommentSkeleton';

export default ShadcnCommentSkeleton;
