'use client';

/**
 * CommentSection Provider — owns context and provides it to children
 * @module @comment-section/react/CommentProvider
 */

import React, { createContext, useCallback } from 'react';
import type {
    Comment,
    CommentUser,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
} from '../core/types';
import type { CommentAdapter } from '../core/adapter';
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

/**
 * Context for the Comment Section
 */
export const CommentSectionContext = createContext<CommentSectionContextValue | null>(null);

/**
 * Provider props
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
    /** New adapter-based data layer (optional — falls back to callback props) */
    adapter?: CommentAdapter;
    /** Callback props (sync) */
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
 * Provider component for the Comment Section context
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
    adapter: _adapter,
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

    type SortOrder = 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
    const [storedSortOrder, setStoredSortOrder] = useLocalStorage<SortOrder>(
        sortOrderKey ? sortOrderKey : 'comment-section-sort',
        sortOrderProp
    );
    const effectiveSortOrder = (sortOrderKey ? storedSortOrder : sortOrderProp) as SortOrder;

    const setSortOrder = useCallback(
        (order: SortOrder) => {
            if (sortOrderKey) {
                setStoredSortOrder(order);
            }
            onSortOrderChange?.(order);
        },
        [sortOrderKey, setStoredSortOrder, onSortOrderChange]
    );

    // When adapter is provided, it returns Promises; we use sync callbacks only (adapter not used in sync API).
    const resolvedOnSubmit = onSubmitComment;
    const resolvedOnReply = onReply;
    const resolvedOnReaction = onReaction;
    const resolvedOnEdit = onEdit;
    const resolvedOnDelete = onDelete;

    // Adapter should also support pagination if we wanted to be complete, but keeping it simple for now as adapter interface wasn't fully defined for it in user prompt. 
    // Assuming onLoadMore is passed as prop if not using adapter or if adapter handles it via side channels (or we should add it to adapter later).

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
        onSubmitComment: resolvedOnSubmit,
        onReply: resolvedOnReply,
        onReaction: resolvedOnReaction,
        onEdit: resolvedOnEdit,
        onDelete: resolvedOnDelete,
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
