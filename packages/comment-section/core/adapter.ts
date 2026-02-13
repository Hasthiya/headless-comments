/**
 * Adapter interface for the comment data layer
 * @module @headless-comments/react/core/adapter
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
 * Callback-style props (sync). createCallbackAdapter wraps these in Promise for the adapter interface.
 */
export interface CallbackAdapterConfig {
    onSubmitComment?: (content: string) => Comment;
    onReply?: (commentId: string, content: string) => Comment;
    onEdit?: (commentId: string, content: string) => Comment;
    onDelete?: (commentId: string) => void;
    onReaction?: (commentId: string, reactionId: string) => void;
}

/**
 * Creates a CommentAdapter from sync callback-style props.
 * Wraps sync callbacks in Promise so the adapter interface (Promise-based) is satisfied.
 */
export function createCallbackAdapter(config: CallbackAdapterConfig): CommentAdapter {
    return {
        async createComment(content: string, parentId?: string): Promise<Comment> {
            if (parentId && config.onReply) {
                return Promise.resolve(config.onReply(parentId, content));
            }
            if (config.onSubmitComment) {
                return Promise.resolve(config.onSubmitComment(content));
            }
            throw new Error('No createComment or onSubmitComment handler provided');
        },

        async updateComment(id: string, content: string): Promise<Comment> {
            if (config.onEdit) {
                return Promise.resolve(config.onEdit(id, content));
            }
            throw new Error('No updateComment or onEdit handler provided');
        },

        async deleteComment(id: string): Promise<void> {
            if (config.onDelete) {
                config.onDelete(id);
                return;
            }
            throw new Error('No deleteComment or onDelete handler provided');
        },

        async toggleReaction(commentId: string, reactionId: string): Promise<void> {
            if (config.onReaction) {
                config.onReaction(commentId, reactionId);
                return;
            }
            throw new Error('No toggleReaction or onReaction handler provided');
        },
    };
}
