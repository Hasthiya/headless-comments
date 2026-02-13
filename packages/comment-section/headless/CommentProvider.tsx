'use client';

/**
 * CommentSection Provider — optional wrapper that distributes state via context.
 * Can either create its own useCommentTree internally or accept an externally-managed tree.
 * @module @headless-comments/react/CommentProvider
 */

import React, { createContext, useMemo } from 'react';
import type {
    Comment,
    CommentUser,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
} from '../core/types';
import type { CommentAdapter } from '../core/adapter';
import type { SortOrder } from '../core/sorting';
import type { CommentSectionContextValue } from './types';
import {
    mergeTexts,
    mergeTheme,
    mergeReactions,
    generateUniqueId,
    defaultReactions,
    defaultReactionsWithoutDislike,
} from '../core/utils';
import { useCommentTree } from './useCommentTree';
import type { UseCommentTreeReturn } from './useCommentTree';
import { useSortedComments } from './useSortedComments';

/**
 * Context for Headless Comments.
 * Uses the broadest generic default so it works with any Comment<T>.
 */
export const CommentSectionContext = createContext<CommentSectionContextValue | null>(null);

/**
 * Props for CommentSectionProvider.
 *
 * Two usage modes:
 * 1. Pass `tree` — Provider distributes an externally-managed useCommentTree via context
 * 2. Pass `initialComments` + options — Provider creates useCommentTree internally
 */
export interface CommentSectionProviderProps<T extends Record<string, unknown> = Record<string, unknown>> {
    children: React.ReactNode;

    // ─── Mode 1: External tree ──────────────────────────────────────────
    /** Pass a pre-configured useCommentTree instance */
    tree?: UseCommentTreeReturn<T>;

    // ─── Mode 2: Internal tree (Provider creates it) ────────────────────
    /** Initial comments (flat or nested) */
    initialComments?: Comment<T>[];
    /** Current user */
    currentUser?: CommentUser | null;
    /** Adapter for persistence */
    adapter?: CommentAdapter<T>;

    // ─── Shared config ──────────────────────────────────────────────────
    availableReactions?: ReactionConfig[];
    texts?: CommentTexts;
    theme?: CommentTheme;
    locale?: string;
    maxDepth?: number;
    readOnly?: boolean;
    generateId?: () => string;
    sortOrder?: SortOrder;
    sortOrderKey?: string;
    onReport?: (commentId: string, reason: string) => void;
    /** Include dislike reaction in defaults */
    includeDislike?: boolean;
}

/**
 * Provides comment section context to children.
 * Works as a thin wrapper around useCommentTree + useSortedComments.
 *
 * When an external `tree` prop is provided, the internal tree is created with
 * empty config (no adapter, no initial comments) to avoid wasted side effects.
 */
export function CommentSectionProvider<T extends Record<string, unknown> = Record<string, unknown>>({
    children,
    tree: externalTree,
    initialComments = [],
    currentUser,
    adapter,
    availableReactions: availableReactionsProp,
    texts,
    theme,
    locale = 'en',
    maxDepth = 3,
    readOnly = false,
    generateId: genId = generateUniqueId,
    sortOrder: sortOrderProp = 'newest',
    sortOrderKey,
    onReport,
    includeDislike = false,
}: CommentSectionProviderProps<T>): React.ReactElement {
    // When external tree is provided, create internal tree with no-op config
    // to avoid wasted adapter fetches and side effects.
    const internalTree = useCommentTree<T>(
        externalTree
            ? {} // No-op: no adapter, no initial comments
            : {
                  initialComments,
                  currentUser: currentUser ?? undefined,
                  generateId: genId,
                  adapter,
              }
    );

    const tree = externalTree ?? internalTree;

    // Sorted comments
    const { sortedComments, sortOrder, setSortOrder } = useSortedComments(
        tree.comments,
        sortOrderProp,
        sortOrderKey ? { persistKey: sortOrderKey } : undefined
    );

    const availableReactions = availableReactionsProp ??
        (includeDislike ? defaultReactions : defaultReactionsWithoutDislike);

    // tree is already memoized from useCommentTree, so destructure stable values
    const value: CommentSectionContextValue<T> = useMemo(
        () => ({
            currentUser,
            availableReactions: mergeReactions(availableReactions),
            texts: mergeTexts(texts),
            theme: mergeTheme(theme),
            locale,
            maxDepth,
            readOnly,
            generateId: genId,
            comments: sortedComments,
            error: tree.error,
            submitComment: tree.addComment,
            replyToComment: tree.addReply,
            toggleReaction: tree.toggleReaction,
            editComment: tree.editComment,
            deleteComment: tree.deleteComment,
            reportComment: onReport,
            setComments: tree.setComments,
            findComment: tree.findComment,
            totalCount: tree.totalCount,
            isLoading: tree.isLoading,
            sortOrder,
            setSortOrder,
        }),
        [
            currentUser,
            availableReactions,
            texts,
            theme,
            locale,
            maxDepth,
            readOnly,
            genId,
            sortedComments,
            tree.error,
            tree.addComment,
            tree.addReply,
            tree.toggleReaction,
            tree.editComment,
            tree.deleteComment,
            tree.setComments,
            tree.findComment,
            tree.totalCount,
            tree.isLoading,
            onReport,
            sortOrder,
            setSortOrder,
        ]
    );

    return (
        <CommentSectionContext.Provider value={value as CommentSectionContextValue}>
            {children}
        </CommentSectionContext.Provider>
    );
}
