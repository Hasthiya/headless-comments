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
    // Callbacks
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

export type CommentStateValue = {
    comments: Comment[];
    sortedComments: Comment[];
    error: Error | null;
    setError: (error: Error | null) => void;
    submitComment: (content: string) => Promise<Comment>;
    replyToComment: (commentId: string, content: string) => Promise<Comment>;
    toggleReaction: (commentId: string, reactionId: string) => Promise<void>;
    editComment: (commentId: string, content: string) => Promise<Comment>;
    deleteComment: (commentId: string) => Promise<void>;
    // Pagination
    onLoadMore?: () => Promise<Comment[]> | Comment[];
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMore: () => Promise<void>;
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
}: UseCommentStateProps): CommentStateValue => {
    // Optimistic updates state
    const optimistic = useOptimisticUpdates<Comment>(externalComments);
    const [error, setError] = useState<Error | null>(null);

    // Sort comments
    const sortedComments = useMemo(() => {
        const commentsToSort = enableOptimisticUpdates ? optimistic.data : externalComments;
        return sortComments(commentsToSort, sortOrder);
    }, [enableOptimisticUpdates, optimistic.data, externalComments, sortOrder]);

    // Handle new comment submission
    const submitComment = useCallback(
        async (content: string): Promise<Comment> => {
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

                try {
                    const result = await onSubmitComment(content);
                    optimistic.update(optimisticComment.id, {
                        ...result,
                        isPending: false,
                    });
                    optimistic.confirm();
                    return result;
                } catch (err) {
                    optimistic.update(optimisticComment.id, {
                        isPending: false,
                        hasError: true,
                        errorMessage: err instanceof Error ? err.message : 'Failed to submit',
                    });
                    throw err;
                }
            }
            return await Promise.resolve(onSubmitComment(content));
        },
        [onSubmitComment, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reply
    const replyToComment = useCallback(
        async (commentId: string, content: string): Promise<Comment> => {
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

                try {
                    const result = await onReply(commentId, content);
                    optimistic.update(optimisticReply.id, {
                        ...result,
                        isPending: false,
                    });
                    optimistic.confirm();
                    return result;
                } catch (err) {
                    optimistic.update(optimisticReply.id, {
                        isPending: false,
                        hasError: true,
                        errorMessage: err instanceof Error ? err.message : 'Failed to submit reply',
                    });
                    throw err;
                }
            }
            return onReply(commentId, content);
        },
        [onReply, enableOptimisticUpdates, currentUser, generateId, optimistic]
    );

    // Handle reaction
    const toggleReaction = useCallback(
        async (commentId: string, reactionId: string) => {
            if (!onReaction) return;

            // Optimistic update
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

            try {
                await onReaction(commentId, reactionId);
                if (enableOptimisticUpdates) {
                    optimistic.confirm();
                }
            } catch (err) {
                if (enableOptimisticUpdates) {
                    optimistic.rollback();
                }
                setError(err instanceof Error ? err : new Error('Failed to react'));
            }
        },
        [onReaction, enableOptimisticUpdates, optimistic]
    );

    // Handle edit
    const editComment = useCallback(
        async (commentId: string, content: string): Promise<Comment> => {
            if (!onEdit) throw new Error('onEdit is required');

            if (enableOptimisticUpdates) {
                optimistic.update(commentId, { content, isEdited: true, isPending: true });
            }

            try {
                const result = await onEdit(commentId, content);
                if (enableOptimisticUpdates) {
                    optimistic.update(commentId, { ...result, isPending: false });
                    optimistic.confirm();
                }
                return result;
            } catch (err) {
                if (enableOptimisticUpdates) {
                    optimistic.rollback();
                }
                setError(err instanceof Error ? err : new Error('Failed to edit'));
                throw err;
            }
        },
        [onEdit, enableOptimisticUpdates, optimistic]
    );

    // Handle delete
    const deleteComment = useCallback(
        async (commentId: string) => {
            if (!onDelete) return;

            if (enableOptimisticUpdates) {
                optimistic.remove(commentId);
            }

            try {
                await onDelete(commentId);
                if (enableOptimisticUpdates) {
                    optimistic.confirm();
                }
            } catch (err) {
                if (enableOptimisticUpdates) {
                    optimistic.rollback();
                }
                setError(err instanceof Error ? err : new Error('Failed to delete'));
            }
        },
        [onDelete, enableOptimisticUpdates, optimistic]
    );

    // Handle load more
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = useCallback(async () => {
        if (!onLoadMore || isLoadingMore || !hasMore) return;

        setIsLoadingMore(true);
        try {
            await onLoadMore();
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
    };
};
