/**
 * Tree operations for nested comment structures — both read and mutation.
 * All mutation functions are pure and immutable (return new arrays).
 * @module @headless-comments/react/core/tree
 */

import type { Comment } from './types';

// ─── Read Operations ────────────────────────────────────────────────────────

/**
 * Flatten nested comments into a single array
 */
export const flattenComments = <T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[]
): Comment<T>[] => {
    const result: Comment<T>[] = [];

    const flatten = (commentList: Comment<T>[]) => {
        for (const comment of commentList) {
            result.push(comment);
            if (comment.replies && comment.replies.length > 0) {
                flatten(comment.replies);
            }
        }
    };

    flatten(comments);
    return result;
};

/** Node shape used when building the tree: replies is always an array. */
type CommentNode<T extends Record<string, unknown> = Record<string, unknown>> = Comment<T> & {
    replies: Comment<T>[];
};

/**
 * Build a comment tree from a flat array
 */
export const buildCommentTree = <T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[]
): Comment<T>[] => {
    const commentMap = new Map<string, CommentNode<T>>();
    const rootComments: CommentNode<T>[] = [];

    // First pass: create map and initialize replies array
    for (const comment of comments) {
        commentMap.set(comment.id, { ...comment, replies: [] });
    }

    // Second pass: build tree (every node in map has replies set above)
    for (const comment of comments) {
        const node = commentMap.get(comment.id);
        if (!node) continue;
        if (comment.parentId) {
            const parent = commentMap.get(comment.parentId);
            if (parent) {
                parent.replies.push(node);
            } else {
                rootComments.push(node);
            }
        } else {
            rootComments.push(node);
        }
    }

    return rootComments;
};

/**
 * Count total replies for a comment (recursive)
 */
export const countReplies = <T extends Record<string, unknown> = Record<string, unknown>>(
    comment: Comment<T>
): number => {
    if (!comment.replies || comment.replies.length === 0) {
        return 0;
    }
    return comment.replies.reduce((sum, reply) => sum + 1 + countReplies(reply), 0);
};

/**
 * Find a comment by ID in a nested structure
 */
export const findCommentById = <T extends Record<string, unknown> = Record<string, unknown>>(
    comments: Comment<T>[],
    id: string
): Comment<T> | undefined => {
    for (const comment of comments) {
        if (comment.id === id) {
            return comment;
        }
        if (comment.replies) {
            const found = findCommentById(comment.replies, id);
            if (found) {
                return found;
            }
        }
    }
    return undefined;
};

// ─── Mutation Operations (pure, immutable) ──────────────────────────────────

/**
 * Internal recursive helper that returns both the new tree and whether
 * the parent was found. This prevents the old bug where every leaf branch
 * received a copy of the comment when `parentId` didn't match any node.
 */
function addToTreeInner<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    comment: Comment<T>,
    parentId: string,
    position: 'prepend' | 'append'
): { result: Comment<T>[]; found: boolean } {
    let found = false;

    const result = tree.map((node) => {
        // Already found in a previous sibling — skip further work
        if (found) return node;

        if (node.id === parentId) {
            found = true;
            const replies = node.replies ?? [];
            return {
                ...node,
                replies: position === 'prepend' ? [comment, ...replies] : [...replies, comment],
            };
        }

        if (node.replies?.length) {
            const inner = addToTreeInner(node.replies, comment, parentId, position);
            if (inner.found) {
                found = true;
                return { ...node, replies: inner.result };
            }
        }

        return node;
    });

    return { result, found };
}

/**
 * Immutably add a comment to the tree.
 * If `parentId` is given, nests under that parent. Otherwise appends/prepends to root.
 * Returns a new array. If parentId is specified but not found, falls back to root-level add.
 *
 * @param tree - The current comment tree
 * @param comment - The comment to add
 * @param parentId - Optional parent to nest under
 * @param position - Whether to 'prepend' or 'append' (default: 'append')
 */
export function addToTree<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    comment: Comment<T>,
    parentId?: string | null,
    position: 'prepend' | 'append' = 'append'
): Comment<T>[] {
    // Root-level add
    if (!parentId) {
        return position === 'prepend' ? [comment, ...tree] : [...tree, comment];
    }

    const { result, found } = addToTreeInner(tree, comment, parentId, position);

    // If parent not found, fall back to root-level add
    if (!found) {
        return position === 'prepend' ? [comment, ...tree] : [...tree, comment];
    }

    return result;
}

/**
 * Immutably remove a comment (and its entire subtree) by id.
 * Returns the original array reference if id is not found (referential equality bailout).
 *
 * @param tree - The current comment tree
 * @param commentId - The id of the comment to remove
 */
export function removeFromTree<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    commentId: string
): Comment<T>[] {
    let changed = false;

    const result = tree
        .filter((comment) => {
            if (comment.id === commentId) {
                changed = true;
                return false;
            }
            return true;
        })
        .map((comment) => {
            if (comment.replies?.length) {
                const newReplies = removeFromTree(comment.replies, commentId);
                if (newReplies !== comment.replies) {
                    changed = true;
                    return { ...comment, replies: newReplies };
                }
            }
            return comment;
        });

    return changed ? result : tree;
}

/**
 * Immutably update a comment's fields via shallow merge, found by id anywhere in the tree.
 * Returns the original array reference if id is not found (referential equality bailout).
 *
 * @param tree - The current comment tree
 * @param commentId - The id of the comment to update
 * @param updates - Partial fields to shallow-merge
 */
export function updateInTree<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    commentId: string,
    updates: Partial<Comment<T>>
): Comment<T>[] {
    let changed = false;

    const result = tree.map((comment) => {
        if (comment.id === commentId) {
            changed = true;
            return { ...comment, ...updates };
        }
        if (comment.replies?.length) {
            const newReplies = updateInTree(comment.replies, commentId, updates);
            if (newReplies !== comment.replies) {
                changed = true;
                return { ...comment, replies: newReplies };
            }
        }
        return comment;
    });

    return changed ? result : tree;
}

/**
 * Immutably toggle a reaction on a comment in the tree.
 * Increments/decrements the count and flips `isActive`.
 * Returns the original array reference if the comment or reaction is not found.
 *
 * @param tree - The current comment tree
 * @param commentId - The id of the comment
 * @param reactionId - The id of the reaction to toggle
 */
export function toggleReactionInTree<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    commentId: string,
    reactionId: string
): Comment<T>[] {
    let changed = false;

    const result = tree.map((comment) => {
        if (comment.id === commentId) {
            if (!comment.reactions) return comment;
            const updatedReactions = comment.reactions.map((r) => {
                if (r.id === reactionId) {
                    changed = true;
                    return {
                        ...r,
                        count: r.isActive ? Math.max(0, r.count - 1) : r.count + 1,
                        isActive: !r.isActive,
                    };
                }
                return r;
            });
            return changed ? { ...comment, reactions: updatedReactions } : comment;
        }
        if (comment.replies?.length) {
            const newReplies = toggleReactionInTree(comment.replies, commentId, reactionId);
            if (newReplies !== comment.replies) {
                changed = true;
                return { ...comment, replies: newReplies };
            }
        }
        return comment;
    });

    return changed ? result : tree;
}

/**
 * Immutably toggle a reaction with mutual exclusivity — only one reaction
 * can be active per comment at a time.
 *
 * - If the clicked reaction is already active: deactivate it (decrement count).
 * - If a different reaction is currently active: deactivate it first, then activate the clicked one.
 * - If no reaction is active: activate the clicked one.
 *
 * Returns the original array reference if the comment or reaction is not found.
 *
 * @param tree - The current comment tree
 * @param commentId - The id of the comment
 * @param reactionId - The id of the reaction to toggle
 */
export function exclusiveToggleReactionInTree<T extends Record<string, unknown> = Record<string, unknown>>(
    tree: Comment<T>[],
    commentId: string,
    reactionId: string
): Comment<T>[] {
    let changed = false;

    const result = tree.map((comment) => {
        if (comment.id === commentId) {
            if (!comment.reactions) return comment;

            const clickedReaction = comment.reactions.find((r) => r.id === reactionId);
            if (!clickedReaction) return comment;

            const isDeactivating = clickedReaction.isActive;

            const updatedReactions = comment.reactions.map((r) => {
                if (r.id === reactionId) {
                    changed = true;
                    return {
                        ...r,
                        count: isDeactivating ? Math.max(0, r.count - 1) : r.count + 1,
                        isActive: !isDeactivating,
                    };
                }
                // If activating a new reaction, deactivate any currently active one
                if (!isDeactivating && r.isActive) {
                    changed = true;
                    return {
                        ...r,
                        count: Math.max(0, r.count - 1),
                        isActive: false,
                    };
                }
                return r;
            });

            return changed ? { ...comment, reactions: updatedReactions } : comment;
        }
        if (comment.replies?.length) {
            const newReplies = exclusiveToggleReactionInTree(comment.replies, commentId, reactionId);
            if (newReplies !== comment.replies) {
                changed = true;
                return { ...comment, replies: newReplies };
            }
        }
        return comment;
    });

    return changed ? result : tree;
}
