'use client';

/**
 * CommentSection Provider — owns context and provides it to children
 * @module @headless-comments/react/CommentProvider
 */

import React, { createContext, useCallback } from 'react';
import type {
    Comment,
    CommentUser,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
} from '../core/types';
import type { CommentSectionContextValue } from './types';
import {
    mergeTexts,
    mergeTheme,
    mergeReactions,
    generateUniqueId,
    defaultReactions,
    defaultReactionsWithoutDislike,
} from '../core/utils';
import { useCommentState } from './useCommentState';
import { useLocalStorage } from './hooks';

const SORT_ORDERS = ['asc', 'desc', 'oldest', 'newest', 'popular'] as const;
type SortOrder = (typeof SORT_ORDERS)[number];

function isSortOrder(value: unknown): value is SortOrder {
    return typeof value === 'string' && SORT_ORDERS.includes(value as SortOrder);
}

/**
 * Context for Headless Comments
 */
export const CommentSectionContext = createContext<CommentSectionContextValue | null>(null);

/**
 * Props for CommentSectionProvider. Supply comments and sync callbacks; for async backends, call your API inside the callbacks and update your state.
 */
export interface CommentSectionProviderProps {
    children: React.ReactNode;
    comments: Comment[];
    currentUser?: CommentUser | null;
    availableReactions?: ReactionConfig[];
    texts?: CommentTexts;
    theme?: CommentTheme;
    locale?: string;
    enableOptimisticUpdates?: boolean;
    maxDepth?: number;
    readOnly?: boolean;
    generateId?: () => string;
    sortOrder?: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
    /** localStorage key for persisting sort preference; when set, sort order is saved */
    sortOrderKey?: string;
    /** Called when user changes sort order */
    onSortOrderChange?: (order: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular') => void;
    /** Callback props (sync). For async backends, call your API inside the callback and update your state. */
    onSubmitComment?: (content: string) => Comment;
    onReply?: (commentId: string, content: string) => Comment;
    onReaction?: (commentId: string, reactionId: string) => void;
    onEdit?: (commentId: string, content: string) => Comment;
    onDelete?: (commentId: string) => void;
    onReport?: (commentId: string, reason: string) => void;
    /** Include dislike reaction in defaults (guideline: avoid unless required) */
    includeDislike?: boolean;
    // Pagination
    onLoadMore?: () => Comment[] | void;
    hasMore?: boolean;
    isLoading?: boolean;
    isSubmittingComment?: boolean;
    isSubmittingReply?: boolean;
}

/**
 * Provides comment section context (comments, handlers, theme, texts) to children. Required for HeadlessCommentItem, HeadlessReplyForm, and useCommentSection.
 */
export const CommentSectionProvider: React.FC<CommentSectionProviderProps> = ({
    children,
    comments,
    currentUser,
    availableReactions: availableReactionsProp,
    texts,
    theme,
    locale = 'en',
    enableOptimisticUpdates = true,
    maxDepth = 3,
    readOnly = false,
    generateId = generateUniqueId,
    sortOrder: sortOrderProp = 'newest',
    sortOrderKey,
    onSortOrderChange,
    onSubmitComment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    onReport,
    includeDislike = false,
    onLoadMore,
    hasMore,
    isLoading,
    isSubmittingComment = false,
    isSubmittingReply = false,
}) => {
    const availableReactions = availableReactionsProp ?? (includeDislike ? defaultReactions : defaultReactionsWithoutDislike);

    const [storedSortOrder, setStoredSortOrder] = useLocalStorage<SortOrder>(
        sortOrderKey ? sortOrderKey : 'comment-section-sort',
        sortOrderProp,
        (v) => (isSortOrder(v) ? v : sortOrderProp)
    );
    const effectiveSortOrder = sortOrderKey ? storedSortOrder : sortOrderProp;

    const setSortOrder = useCallback(
        (order: SortOrder) => {
            if (sortOrderKey) {
                setStoredSortOrder(order);
            }
            onSortOrderChange?.(order);
        },
        [sortOrderKey, setStoredSortOrder, onSortOrderChange]
    );

    // Use the logic hook to manage state
    const {
        sortedComments,
        error,
        setError,
        submitComment,
        replyToComment,
        toggleReaction,
        editComment,
        deleteComment,
        isLoadingMore,
        loadMore,
    } = useCommentState({
        comments,
        currentUser,
        enableOptimisticUpdates,
        sortOrder: effectiveSortOrder,
        generateId,
        onSubmitComment,
        onReply,
        onReaction,
        onEdit,
        onDelete,
        onLoadMore,
        hasMore,
        isLoading,
        isSubmittingComment,
        isSubmittingReply,
    });

    const value: CommentSectionContextValue = {
        currentUser,
        availableReactions: mergeReactions(availableReactions),
        texts: mergeTexts(texts),
        theme: mergeTheme(theme),
        locale,
        enableOptimisticUpdates,
        maxDepth,
        readOnly,
        generateId,
        comments: sortedComments,
        error,
        setError,
        submitComment,
        replyToComment,
        toggleReaction,
        editComment,
        deleteComment,
        reportComment: onReport,
        onLoadMore,
        hasMore: !!hasMore,
        isLoading: !!isLoading,
        isLoadingMore,
        loadMore,
        isSubmittingComment,
        isSubmittingReply,
        sortOrder: effectiveSortOrder,
        setSortOrder,
    };

    return (
        <CommentSectionContext.Provider value={value}>
            {children}
        </CommentSectionContext.Provider>
    );
};
