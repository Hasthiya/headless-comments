'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export interface ShadcnCommentSkeletonProps {
  count?: number;
  className?: string;
}

export const ShadcnCommentSkeleton: React.FC<ShadcnCommentSkeletonProps> = ({
  count = 3,
  className = '',
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full max-w-[80%]" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ShadcnCommentSkeleton.displayName = 'ShadcnCommentSkeleton';
