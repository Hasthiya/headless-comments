/**
 * Tree operations for nested comment structures
 * @module @headless-comments/react/core/tree
 */

import type { Comment } from './types';

/**
 * Flatten nested comments into a single array
 */
export const flattenComments = (comments: Comment[]): Comment[] => {
    const result: Comment[] = [];

    const flatten = (commentList: Comment[]) => {
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
type CommentNode = Comment & { replies: Comment[] };

/**
 * Build a comment tree from a flat array
 */
export const buildCommentTree = (comments: Comment[]): Comment[] => {
    const commentMap = new Map<string, CommentNode>();
    const rootComments: CommentNode[] = [];

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
 * Count total replies for a comment
 */
export const countReplies = (comment: Comment): number => {
    if (!comment.replies || comment.replies.length === 0) {
        return 0;
    }
    return comment.replies.reduce((sum, reply) => sum + 1 + countReplies(reply), 0);
};

/**
 * Find a comment by ID in a nested structure
 */
export const findCommentById = (comments: Comment[], id: string): Comment | undefined => {
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
