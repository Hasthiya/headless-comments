/**
 * Adapter interface for the comment data layer
 * @module @comment-section/core/adapter
 */

import type { Comment } from './types';

/**
 * Options for fetching comments
 */
export interface FetchCommentsOptions {
    /** Parent comment ID for fetching replies */
    parentId?: string;
    /** Cursor for pagination */
    cursor?: string;
    /** Number of comments to fetch */
    limit?: number;
    /** Sort order */
    sortOrder?: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
}

/**
 * Adapter interface for plugging in different data sources
 * (REST API, GraphQL, local state, etc.)
 */
export interface CommentAdapter {
    /** Fetch comments from the data source */
    getComments?(options?: FetchCommentsOptions): Promise<Comment[]>;
    /** Create a new comment or reply */
    createComment(content: string, parentId?: string): Promise<Comment>;
    /** Update an existing comment */
    updateComment(id: string, content: string): Promise<Comment>;
    /** Delete a comment */
    deleteComment(id: string): Promise<void>;
    /** Toggle a reaction on a comment */
    toggleReaction(commentId: string, reactionId: string): Promise<void>;
}

/**
 * Callback-style props that match the existing CommentSection API
 */
export interface CallbackAdapterConfig {
    onSubmitComment?: (content: string) => Promise<Comment> | Comment;
    onReply?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onEdit?: (commentId: string, content: string) => Promise<Comment> | Comment;
    onDelete?: (commentId: string) => Promise<void> | void;
    onReaction?: (commentId: string, reactionId: string) => Promise<void> | void;
}

/**
 * Creates a CommentAdapter from the legacy callback-style props.
 * This bridges the old API to the new adapter interface for backwards compatibility.
 */
export function createCallbackAdapter(config: CallbackAdapterConfig): CommentAdapter {
    return {
        async createComment(content: string, parentId?: string): Promise<Comment> {
            if (parentId && config.onReply) {
                const result = await config.onReply(parentId, content);
                return result;
            }
            if (config.onSubmitComment) {
                const result = await config.onSubmitComment(content);
                return result;
            }
            throw new Error('No createComment or onSubmitComment handler provided');
        },

        async updateComment(id: string, content: string): Promise<Comment> {
            if (config.onEdit) {
                const result = await config.onEdit(id, content);
                return result;
            }
            throw new Error('No updateComment or onEdit handler provided');
        },

        async deleteComment(id: string): Promise<void> {
            if (config.onDelete) {
                await config.onDelete(id);
                return;
            }
            throw new Error('No deleteComment or onDelete handler provided');
        },

        async toggleReaction(commentId: string, reactionId: string): Promise<void> {
            if (config.onReaction) {
                await config.onReaction(commentId, reactionId);
                return;
            }
            throw new Error('No toggleReaction or onReaction handler provided');
        },
    };
}
