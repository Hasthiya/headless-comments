'use client';

/**
 * CommentSection Provider — owns context and provides it to children
 * @module @comment-section/react/CommentProvider
 */

import React, { createContext } from 'react';
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
} from '../core/utils';
import { useCommentState } from './useCommentState';

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
    /** New adapter-based data layer (optional — falls back to callback props) */
    adapter?: CommentAdapter;
    /** Legacy callback props (still supported for backwards compatibility) */
    onSubmitComment?: (content: string) => Promise<Comment> | Comment;
    onReply?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onReaction?: (commentId: string, reactionId: string) => Promise<void> | void;
    onEdit?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onDelete?: (commentId: string) => Promise<void> | void;
    // Pagination
    onLoadMore?: () => Promise<Comment[]> | Comment[];
    hasMore?: boolean;
    isLoading?: boolean;
}

/**
 * Provider component for the Comment Section context
 */
export const CommentSectionProvider: React.FC<CommentSectionProviderProps> = ({
    children,
    comments,
    currentUser,
    availableReactions = defaultReactions,
    texts,
    theme,
    locale = 'en',
    enableOptimisticUpdates = true,
    maxDepth = 3,
    readOnly = false,
    generateId = generateUniqueId,
    sortOrder = 'newest',
    adapter,
    onSubmitComment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    onLoadMore,
    hasMore,
    isLoading,
}) => {
    // If an adapter is provided, use its methods; otherwise fall back to callback props
    const resolvedOnSubmit = adapter
        ? (content: string) => adapter.createComment(content)
        : onSubmitComment;

    const resolvedOnReply = adapter
        ? (commentId: string, content: string) => adapter.createComment(content, commentId)
        : onReply;

    const resolvedOnReaction = adapter
        ? (commentId: string, reactionId: string) => adapter.toggleReaction(commentId, reactionId)
        : onReaction;

    const resolvedOnEdit = adapter
        ? (commentId: string, content: string) => adapter.updateComment(commentId, content)
        : onEdit;

    const resolvedOnDelete = adapter
        ? (commentId: string) => adapter.deleteComment(commentId)
        : onDelete;

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
        sortOrder,
        generateId,
        onSubmitComment: resolvedOnSubmit,
        onReply: resolvedOnReply,
        onReaction: resolvedOnReaction,
        onEdit: resolvedOnEdit,
        onDelete: resolvedOnDelete,
        onLoadMore,
        hasMore,
        isLoading,
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
        // State
        comments: sortedComments,
        error,
        setError,
        // Actions
        submitComment,
        replyToComment,
        toggleReaction,
        editComment,
        deleteComment,
        // Pagination
        onLoadMore,
        hasMore: !!hasMore,
        isLoading: !!isLoading,
        isLoadingMore,
        loadMore,
        // Legacy/Direct backward compat
        onReply: replyToComment,
        onReaction: toggleReaction,
        onEdit: editComment,
        onDelete: deleteComment,
    };

    return (
        <CommentSectionContext.Provider value={value}>
            {children}
        </CommentSectionContext.Provider>
    );
};
