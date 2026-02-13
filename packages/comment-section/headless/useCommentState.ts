'use client';

import { useState, useCallback, useMemo } from 'react';
import { Comment, CommentUser } from '../core/types';
import { useOptimisticUpdates } from './useOptimisticUpdates';
import { sortComments } from '../core/sorting';
import { defaultReactions, generateUniqueId } from '../core/utils';

export interface UseCommentStateProps {
    comments: Comment[];
    currentUser?: CommentUser | null;
    enableOptimisticUpdates?: boolean;
    sortOrder?: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
    generateId?: () => string;
    // Callbacks (sync)
    onSubmitComment?: (content: string) => Comment;
    onReply?: (commentId: string, content: string) => Comment;
    onReaction?: (commentId: string, reactionId: string) => void;
    onEdit?: (commentId: string, content: string) => Comment;
    onDelete?: (commentId: string) => void;
    // Pagination
    onLoadMore?: () => Comment[] | void;
    hasMore?: boolean;
    isLoading?: boolean;
    isSubmittingComment?: boolean;
    isSubmittingReply?: boolean;
}

export type CommentStateValue = {
    comments: Comment[];
    sortedComments: Comment[];
    error: Error | null;
    setError: (error: Error | null) => void;
    submitComment: (content: string) => void;
    replyToComment: (commentId: string, content: string) => void;
    toggleReaction: (commentId: string, reactionId: string) => void;
    editComment: (commentId: string, content: string) => void;
    deleteComment: (commentId: string) => void;
    onLoadMore?: () => Comment[] | void;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMore: () => void;
    isSubmittingComment: boolean;
    isSubmittingReply: boolean;
};

export const useCommentState = ({
    comments: externalComments,
    currentUser,
    enableOptimisticUpdates = true,
    sortOrder = 'newest',
    generateId = generateUniqueId,
    onSubmitComment,
    onReply,
    onReaction,
    onEdit,
    onDelete,
    onLoadMore,
    hasMore = false,
    isLoading = false,
    isSubmittingComment = false,
    isSubmittingReply = false,
}: UseCommentStateProps): CommentStateValue => {
    // Optimistic updates state
    const optimistic = useOptimisticUpdates<Comment>(externalComments);
    const [error, setError] = useState<Error | null>(null);

    // Sort comments
    const sortedComments = useMemo(() => {
        const commentsToSort = enableOptimisticUpdates ? optimistic.data : externalComments;
        return sortComments(commentsToSort, sortOrder);
    }, [enableOptimisticUpdates, optimistic.data, externalComments, sortOrder]);

    // Handle new comment submission (sync)
    const submitComment = useCallback(
        (content: string) => {
            if (!onSubmitComment) throw new Error('onSubmitComment is required');
            setError(null);

            if (enableOptimisticUpdates && currentUser) {
                const optimisticComment: Comment = {
                    id: generateId(),
                    content,
                    author: currentUser,
                    createdAt: new Date(),
                    reactions: defaultReactions.map((r) => ({
                        id: r.id,
                        label: r.label,
                        emoji: r.emoji,
                        count: 0,
                        isActive: false,
                    })),
                    isPending: true,
                    replies: [],
                };
                optimistic.add(optimisticComment);
                const result = onSubmitComment(content);
                optimistic.update(optimisticComment.id, { ...result, isPending: false });
                optimistic.confirm();
            } else {
                onSubmitComment(content);
            }
        },
        [onSubmitComment, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reply (sync)
    const replyToComment = useCallback(
        (commentId: string, content: string) => {
            if (!onReply) throw new Error('onReply is required');

            if (enableOptimisticUpdates && currentUser) {
                const optimisticReply: Comment = {
                    id: generateId(),
                    content,
                    author: currentUser,
                    createdAt: new Date(),
                    parentId: commentId,
                    reactions: defaultReactions.map((r) => ({
                        id: r.id,
                        label: r.label,
                        emoji: r.emoji,
                        count: 0,
                        isActive: false,
                    })),
                    isPending: true,
                    replies: [],
                };
                optimistic.add(optimisticReply);
                const result = onReply(commentId, content);
                optimistic.update(optimisticReply.id, { ...result, isPending: false });
                optimistic.confirm();
            } else {
                onReply(commentId, content);
            }
        },
        [onReply, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reaction (sync)
    const toggleReaction = useCallback(
        (commentId: string, reactionId: string) => {
            if (!onReaction) return;
            if (enableOptimisticUpdates) {
                const comment = optimistic.data.find((c) => c.id === commentId);
                if (comment) {
                    const updatedReactions = comment.reactions?.map((r) => {
                        if (r.id === reactionId) {
                            return {
                                ...r,
                                count: r.isActive ? r.count - 1 : r.count + 1,
                                isActive: !r.isActive,
                            };
                        }
                        return r;
                    });
                    optimistic.update(commentId, { reactions: updatedReactions });
                }
            }
            onReaction(commentId, reactionId);
            if (enableOptimisticUpdates) optimistic.confirm();
        },
        [onReaction, enableOptimisticUpdates, optimistic]
    );

    // Handle edit (sync)
    const editComment = useCallback(
        (commentId: string, content: string) => {
            if (!onEdit) throw new Error('onEdit is required');
            if (enableOptimisticUpdates) {
                optimistic.update(commentId, { content, isEdited: true, isPending: true });
            }
            const result = onEdit(commentId, content);
            if (enableOptimisticUpdates) {
                optimistic.update(commentId, { ...result, isPending: false });
                optimistic.confirm();
            }
        },
        [onEdit, enableOptimisticUpdates, optimistic]
    );

    // Handle delete (sync)
    const deleteComment = useCallback(
        (commentId: string) => {
            if (!onDelete) return;
            if (enableOptimisticUpdates) optimistic.remove(commentId);
            onDelete(commentId);
            if (enableOptimisticUpdates) optimistic.confirm();
        },
        [onDelete, enableOptimisticUpdates, optimistic]
    );

    // Handle load more
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = useCallback(() => {
        if (!onLoadMore || isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            onLoadMore();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load more comments'));
        } finally {
            setIsLoadingMore(false);
        }
    }, [onLoadMore, isLoadingMore, hasMore]);

    return {
        comments: enableOptimisticUpdates ? optimistic.data : externalComments,
        sortedComments,
        error,
        setError,
        submitComment,
        replyToComment,
        toggleReaction,
        editComment,
        deleteComment,
        onLoadMore,
        hasMore,
        isLoading,
        isLoadingMore,
        loadMore,
        isSubmittingComment,
        isSubmittingReply,
    };
};
