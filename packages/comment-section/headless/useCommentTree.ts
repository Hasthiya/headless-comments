'use client';

/**
 * Standalone state management hook for a comment tree.
 * No Provider required — owns its own state internally.
 * Supports optimistic updates with automatic rollback on adapter failure.
 * @module @headless-comments/react/headless/useCommentTree
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Comment, CommentUser, ReactionConfig } from '../core/types';
import type { CommentAdapter, PaginatedCommentsResponse } from '../core/adapter';
import {
    addToTree,
    removeFromTree,
    updateInTree,
    toggleReactionInTree,
    exclusiveToggleReactionInTree,
    buildCommentTree,
    findCommentById,
    flattenComments,
} from '../core/tree';
import { generateUniqueId, defaultReactions } from '../core/utils';

/**
 * Options for the useCommentTree hook
 */
export interface UseCommentTreeOptions<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Initial comments (flat or nested — auto-detected) */
    initialComments?: Comment<T>[];
    /** Current user for authoring new comments */
    currentUser?: CommentUser;
    /** Custom ID generator (default: generateUniqueId) */
    generateId?: () => string;
    /** Default reactions for new comments */
    defaultReactions?: ReactionConfig[];
    /** Adapter for async persistence. Without it, state is local only. */
    adapter?: CommentAdapter<T>;
    /** Callback invoked when an adapter operation fails (after rollback). */
    onError?: (error: Error) => void;
    /** When true, only one reaction can be active per comment at a time (mutual exclusivity). */
    mutuallyExclusiveReactions?: boolean;
}

/**
 * Return type for the useCommentTree hook
 */
export interface UseCommentTreeReturn<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The current comment tree (nested) */
    comments: Comment<T>[];
    /** Add a root-level comment */
    addComment: (content: string) => Comment<T>;
    /** Add a reply to an existing comment */
    addReply: (parentId: string, content: string) => Comment<T>;
    /** Edit a comment's content. Returns a Promise that resolves when the adapter operation completes. */
    editComment: (commentId: string, content: string) => Promise<void>;
    /** Delete a comment (and its subtree). Returns a Promise that resolves when the adapter operation completes. */
    deleteComment: (commentId: string) => Promise<void>;
    /** Toggle a reaction on a comment. Returns a Promise that resolves when the adapter operation completes. */
    toggleReaction: (commentId: string, reactionId: string) => Promise<void>;
    /** Replace the entire tree */
    setComments: (comments: Comment<T>[]) => void;
    /** Find a comment by ID in the tree */
    findComment: (commentId: string) => Comment<T> | undefined;
    /** Total comment count (including nested replies) */
    totalCount: number;
    /** Whether the adapter is loading initial data */
    isLoading: boolean;
    /** Current error (null if none) */
    error: Error | null;
}

/**
 * Auto-detect whether comments are flat (have parentId but no replies) or already nested.
 * If flat, build the tree. Otherwise return as-is.
 */
function autoTree<T extends Record<string, unknown>>(comments: Comment<T>[]): Comment<T>[] {
    if (comments.length === 0) return comments;

    const hasParentIds = comments.some((c) => c.parentId);
    const hasReplies = comments.some((c) => c.replies && c.replies.length > 0);

    // Flat format: has parentIds but no nested replies → build tree
    if (hasParentIds && !hasReplies) {
        return buildCommentTree(comments);
    }

    return comments;
}

/**
 * Standalone hook for managing a comment tree.
 * Works without any Provider — owns its own state.
 * Mutations are applied optimistically and rolled back on adapter failure.
 *
 * @example
 * ```tsx
 * const tree = useCommentTree({ initialComments: data, currentUser: me });
 * tree.addComment('Hello world');
 * tree.addReply(parentId, 'Great comment!');
 * ```
 */
export function useCommentTree<T extends Record<string, unknown> = Record<string, unknown>>(
    options: UseCommentTreeOptions<T> = {}
): UseCommentTreeReturn<T> {
    const {
        initialComments = [],
        currentUser,
        generateId: genId = generateUniqueId,
        defaultReactions: defaultReactionConfig = defaultReactions,
        adapter,
        onError,
        mutuallyExclusiveReactions = false,
    } = options;

    const [tree, setTree] = useState<Comment<T>[]>(() => autoTree(initialComments));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Keep refs to avoid stale closures
    const adapterRef = useRef(adapter);
    adapterRef.current = adapter;

    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;

    // treeRef always mirrors the latest tree — used by snapshot() so we
    // don't abuse a state updater as a side-effect read mechanism.
    const treeRef = useRef(tree);
    treeRef.current = tree;

    // Snapshot ref for optimistic rollback — stores tree state before a mutation
    const snapshotRef = useRef<Comment<T>[] | null>(null);

    /** Save the current tree before an optimistic mutation (StrictMode-safe) */
    const snapshot = useCallback(() => {
        snapshotRef.current = treeRef.current;
    }, []);

    /** Roll back to the snapshot on adapter failure and report the error */
    const rollback = useCallback((err: unknown) => {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        if (snapshotRef.current !== null) {
            setTree(snapshotRef.current);
            snapshotRef.current = null;
        }
        setError(wrapped);
        onErrorRef.current?.(wrapped);
    }, []);

    /** Extract Comment[] from a getComments response (supports both plain array and paginated) */
    function extractComments(data: Comment<T>[] | PaginatedCommentsResponse<T>): Comment<T>[] {
        if (Array.isArray(data)) return data;
        return data.comments;
    }

    // Load initial data from adapter if available
    useEffect(() => {
        const currentAdapter = adapterRef.current;
        if (currentAdapter?.getComments) {
            setIsLoading(true);
            currentAdapter
                .getComments()
                .then((data) => {
                    setTree(autoTree(extractComments(data)));
                    setError(null);
                })
                .catch((err) => {
                    setError(err instanceof Error ? err : new Error(String(err)));
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Subscribe to adapter changes
    useEffect(() => {
        const currentAdapter = adapterRef.current;
        if (currentAdapter?.subscribe) {
            return currentAdapter.subscribe((data) => {
                setTree(autoTree(data));
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup adapter on unmount
    useEffect(() => {
        return () => {
            adapterRef.current?.dispose?.();
        };
    }, []);

    function makeReactions(): Comment<T>['reactions'] {
        return defaultReactionConfig.map((r) => ({
            id: r.id,
            label: r.label,
            emoji: r.emoji,
            count: 0,
            isActive: false,
        }));
    }

    const addComment = useCallback(
        (content: string): Comment<T> => {
            const comment: Comment<T> = {
                id: genId(),
                content,
                author: currentUser ?? { id: 'anonymous', name: 'Anonymous' },
                createdAt: new Date(),
                reactions: makeReactions(),
                replies: [],
            } as Comment<T>;

            const optimisticId = comment.id;
            snapshot();
            setTree((prev) => addToTree(prev, comment, null, 'prepend'));

            // Persist to adapter — on success, reconcile server-generated ID/fields
            const createPromise = adapterRef.current?.createComment?.(content);
            if (createPromise) {
                createPromise
                    .then((serverComment) => {
                        setTree((prev) => {
                            const withoutOptimistic = removeFromTree(prev, optimisticId);
                            return addToTree(withoutOptimistic, serverComment, null, 'prepend');
                        });
                    })
                    .catch(rollback);
            }

            return comment;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [genId, currentUser, defaultReactionConfig, snapshot, rollback]
    );

    const addReply = useCallback(
        (parentId: string, content: string): Comment<T> => {
            const reply: Comment<T> = {
                id: genId(),
                content,
                author: currentUser ?? { id: 'anonymous', name: 'Anonymous' },
                createdAt: new Date(),
                parentId,
                reactions: makeReactions(),
                replies: [],
            } as Comment<T>;

            const optimisticId = reply.id;
            snapshot();
            setTree((prev) => addToTree(prev, reply, parentId, 'append'));

            // Persist to adapter — on success, reconcile server-generated ID/fields
            const createPromise = adapterRef.current?.createComment?.(content, parentId);
            if (createPromise) {
                createPromise
                    .then((serverComment) => {
                        setTree((prev) => {
                            const withoutOptimistic = removeFromTree(prev, optimisticId);
                            return addToTree(withoutOptimistic, serverComment, parentId, 'append');
                        });
                    })
                    .catch(rollback);
            }

            return reply;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [genId, currentUser, defaultReactionConfig, snapshot, rollback]
    );

    const editComment = useCallback(
        (commentId: string, content: string): Promise<void> => {
            snapshot();
            setTree((prev) =>
                updateInTree(prev, commentId, {
                    content,
                    isEdited: true,
                    updatedAt: new Date(),
                } as Partial<Comment<T>>)
            );

            const adapterPromise = adapterRef.current?.updateComment?.(commentId, content);
            if (adapterPromise) {
                return adapterPromise.then(() => undefined).catch((err) => {
                    rollback(err);
                });
            }
            return Promise.resolve();
        },
        [snapshot, rollback]
    );

    const deleteComment = useCallback(
        (commentId: string): Promise<void> => {
            snapshot();
            setTree((prev) => removeFromTree(prev, commentId));

            const adapterPromise = adapterRef.current?.deleteComment?.(commentId);
            if (adapterPromise) {
                return adapterPromise.catch((err) => {
                    rollback(err);
                });
            }
            return Promise.resolve();
        },
        [snapshot, rollback]
    );

    const toggleReaction = useCallback(
        (commentId: string, reactionId: string): Promise<void> => {
            snapshot();
            const toggleFn = mutuallyExclusiveReactions
                ? exclusiveToggleReactionInTree
                : toggleReactionInTree;
            setTree((prev) => toggleFn(prev, commentId, reactionId));

            const adapterPromise = adapterRef.current?.toggleReaction?.(commentId, reactionId);
            if (adapterPromise) {
                return adapterPromise.catch((err) => {
                    rollback(err);
                });
            }
            return Promise.resolve();
        },
        [snapshot, rollback, mutuallyExclusiveReactions]
    );

    const setComments = useCallback(
        (comments: Comment<T>[]): void => {
            setTree(autoTree(comments));
        },
        []
    );

    const findComment = useCallback(
        (commentId: string): Comment<T> | undefined => {
            return findCommentById(tree, commentId);
        },
        [tree]
    );

    const totalCount = useMemo(() => flattenComments(tree).length, [tree]);

    return useMemo(
        () => ({
            comments: tree,
            addComment,
            addReply,
            editComment,
            deleteComment,
            toggleReaction,
            setComments,
            findComment,
            totalCount,
            isLoading,
            error,
        }),
        [
            tree,
            addComment,
            addReply,
            editComment,
            deleteComment,
            toggleReaction,
            setComments,
            findComment,
            totalCount,
            isLoading,
            error,
        ]
    );
}
