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

/**
 * Context for the Comment Section
 */
export const CommentSectionContext = createContext<CommentSectionContextValue | null>(null);

/**
 * Provider props
 */
export interface CommentSectionProviderProps {
    children: React.ReactNode;
    currentUser?: CommentUser | null;
    availableReactions?: ReactionConfig[];
    texts?: CommentTexts;
    theme?: CommentTheme;
    locale?: string;
    enableOptimisticUpdates?: boolean;
    maxDepth?: number;
    readOnly?: boolean;
    generateId?: () => string;
    /** New adapter-based data layer (optional — falls back to callback props) */
    adapter?: CommentAdapter;
    /** Legacy callback props (still supported for backwards compatibility) */
    onReply?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onReaction?: (commentId: string, reactionId: string) => Promise<void> | void;
    onEdit?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onDelete?: (commentId: string) => Promise<void> | void;
}

/**
 * Provider component for the Comment Section context
 */
export const CommentSectionProvider: React.FC<CommentSectionProviderProps> = ({
    children,
    currentUser,
    availableReactions = defaultReactions,
    texts,
    theme,
    locale = 'en',
    enableOptimisticUpdates = true,
    maxDepth = 3,
    readOnly = false,
    generateId = generateUniqueId,
    adapter,
    onReply,
    onReaction,
    onEdit,
    onDelete,
}) => {
    // If an adapter is provided, use its methods; otherwise fall back to callback props
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
        onReply: resolvedOnReply,
        onReaction: resolvedOnReaction,
        onEdit: resolvedOnEdit,
        onDelete: resolvedOnDelete,
    };

    return (
        <CommentSectionContext.Provider value={value}>
            {children}
        </CommentSectionContext.Provider>
    );
};
