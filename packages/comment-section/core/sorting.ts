/**
 * Sorting, filtering, and search utilities for comments
 * @module @headless-comments/react/core/sorting
 */

import type { Comment } from './types';

/**
 * Built-in sort orders.
 * - `'newest'` / `'desc'`: newest first (descending by createdAt)
 * - `'oldest'` / `'asc'`: oldest first (ascending by createdAt)
 * - `'popular'`: most net-positive reactions first (likes minus dislikes)
 */
export type SortOrder = 'newest' | 'oldest' | 'popular';

/**
 * Custom comparator for full control over sort logic
 */
export type CommentComparator<T extends Record<string, unknown> = Record<string, unknown>> = (
    a: Comment<T>,
    b: Comment<T>
) => number;

export interface SortCommentsOptions {
    /**
     * When true, recursively sort replies at every nesting level.
     * Default: false (only sorts the top-level array).
     */
    recursive?: boolean;
}

/**
 * Sort comments by a built-in SortOrder or a custom comparator function.
 *
 * @param comments - The comments to sort (not mutated)
 * @param orderOrComparator - A SortOrder string or a custom comparator
 * @param options - Additional sort options (e.g. recursive)
 * @returns A new sorted array
 */
export function sortComments<T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[],
    orderOrComparator: SortOrder | CommentComparator<T> = 'newest',
    options: SortCommentsOptions = {}
): Comment<T>[] {
    const { recursive = false } = options;

    const comparator: CommentComparator<T> =
        typeof orderOrComparator === 'function'
            ? orderOrComparator
            : getBuiltinComparator<T>(orderOrComparator);

    const sorted = [...comments].sort(comparator);

    if (recursive) {
        return sorted.map((comment) => {
            if (comment.replies?.length) {
                return {
                    ...comment,
                    replies: sortComments(comment.replies, orderOrComparator, options),
                };
            }
            return comment;
        });
    }

    return sorted;
}

/**
 * Returns a comparator function for a built-in SortOrder.
 */
function getBuiltinComparator<T extends Record<string, unknown>>(order: SortOrder): CommentComparator<T> {
    switch (order) {
        case 'oldest':
            return (a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            };
        case 'newest':
            return (a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            };
        case 'popular':
            return (a, b) => {
                const scoreA = getNetPositiveScore(a);
                const scoreB = getNetPositiveScore(b);
                return scoreB - scoreA;
            };
        default: {
            const exhaustive: never = order;
            void exhaustive;
            return () => 0;
        }
    }
}

/**
 * Calculate a net-positive score for popularity sorting.
 * Positive reactions (like, love, etc.) count as +1 each.
 * Negative reactions (dislike) count as -1 each.
 */
function getNetPositiveScore<T extends Record<string, unknown>>(comment: Comment<T>): number {
    if (!comment.reactions?.length) return 0;

    const negativeIds = new Set(['dislike', 'thumbs_down', 'thumbsdown']);

    return comment.reactions.reduce((score, r) => {
        if (negativeIds.has(r.id)) {
            return score - r.count;
        }
        return score + r.count;
    }, 0);
}

/**
 * Recursively filter a comment tree by predicate.
 * Parents are preserved when any of their children match the predicate
 * (structural preservation — the tree shape stays valid).
 *
 * @param comments - The comment tree to filter
 * @param predicate - Return true to keep the comment
 * @returns A new filtered tree
 */
export function filterComments<T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[],
    predicate: (comment: Comment<T>) => boolean
): Comment<T>[] {
    const result: Comment<T>[] = [];

    for (const comment of comments) {
        // Recursively filter children first
        const filteredReplies = comment.replies?.length
            ? filterComments(comment.replies, predicate)
            : [];

        const selfMatches = predicate(comment);
        const hasMatchingChildren = filteredReplies.length > 0;

        if (selfMatches || hasMatchingChildren) {
            result.push({
                ...comment,
                replies: filteredReplies,
            });
        }
    }

    return result;
}

/**
 * Search comments by content substring (case-insensitive).
 * Convenience wrapper around `filterComments`.
 *
 * @param comments - The comment tree to search
 * @param query - The search string
 * @returns A new filtered tree containing only matching comments (and their ancestors)
 */
export function searchComments<T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[],
    query: string
): Comment<T>[] {
    if (!query.trim()) return comments;
    const lowerQuery = query.toLowerCase();
    return filterComments(comments, (comment) =>
        comment.content.toLowerCase().includes(lowerQuery)
    );
}
