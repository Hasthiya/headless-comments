'use client';

import React from 'react';

/**
 * Minimal unstyled skeleton for comment loading state.
 * Use when tree.isLoading && comments.length === 0. Style via your own CSS
 * (e.g. target .headless-comment-skeleton, or pass className).
 *
 * @example
 * if (tree.isLoading && tree.comments.length === 0) {
 *   return <CommentSkeleton count={3} />;
 * }
 */
export interface CommentSkeletonProps {
    /** Number of skeleton placeholders to show (default 3) */
    count?: number;
    /** Optional class name for the container */
    className?: string;
}

export function CommentSkeleton({ count = 3, className }: CommentSkeletonProps): React.ReactElement {
    return (
        <div className={className} role="status" aria-label="Loading comments">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="headless-comment-skeleton" data-skeleton-item>
                    <div className="headless-comment-skeleton__avatar" data-skeleton-avatar />
                    <div className="headless-comment-skeleton__body">
                        <div className="headless-comment-skeleton__line" data-skeleton-line />
                        <div className="headless-comment-skeleton__line headless-comment-skeleton__line--medium" data-skeleton-line />
                        <div className="headless-comment-skeleton__line headless-comment-skeleton__line--short" data-skeleton-line />
                    </div>
                </div>
            ))}
        </div>
    );
}
