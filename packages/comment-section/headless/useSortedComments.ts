'use client';

/**
 * Standalone hook for sorting comments with managed sort state.
 * Works without Provider — composes with useCommentTree or any Comment[].
 * @module @headless-comments/react/headless/useSortedComments
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Comment } from '../core/types';
import type { SortOrder } from '../core/sorting';
import { sortComments } from '../core/sorting';

export interface UseSortedCommentsOptions {
    /** localStorage key for persisting sort preference */
    persistKey?: string;
}

export interface UseSortedCommentsReturn<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Sorted comments */
    sortedComments: Comment<T>[];
    /** Current sort order */
    sortOrder: SortOrder;
    /** Change sort order */
    setSortOrder: (order: SortOrder) => void;
}

/**
 * Read a value from localStorage (SSR-safe).
 */
function readFromStorage<V>(key: string, fallback: V): V {
    if (typeof window === 'undefined') return fallback;
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as V) : fallback;
    } catch {
        return fallback;
    }
}

/**
 * Write a value to localStorage (SSR-safe, fire-and-forget).
 */
function writeToStorage<V>(key: string, value: V): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage quota errors
    }
}

/**
 * Standalone hook for sorted comments. Works without Provider.
 * Manages sort order state internally with optional localStorage persistence.
 *
 * @param comments - The comments to sort
 * @param initialOrder - Initial sort order (default: 'newest')
 * @param options - Optional config (e.g. persistKey for localStorage)
 */
export function useSortedComments<T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[],
    initialOrder: SortOrder = 'newest',
    options: UseSortedCommentsOptions = {}
): UseSortedCommentsReturn<T> {
    const { persistKey } = options;

    // Single state source — initialized from localStorage when persistKey is set
    const [sortOrder, setSortOrderInternal] = useState<SortOrder>(() => {
        if (persistKey) {
            return readFromStorage<SortOrder>(persistKey, initialOrder);
        }
        return initialOrder;
    });

    // Persist to localStorage when the order changes (only if persistKey is provided)
    useEffect(() => {
        if (persistKey) {
            writeToStorage(persistKey, sortOrder);
        }
    }, [persistKey, sortOrder]);

    const setSortOrder = useCallback(
        (order: SortOrder) => {
            setSortOrderInternal(order);
        },
        []
    );

    const sortedComments = useMemo(
        () => sortComments(comments, sortOrder),
        [comments, sortOrder]
    );

    return {
        sortedComments,
        sortOrder,
        setSortOrder,
    };
}
