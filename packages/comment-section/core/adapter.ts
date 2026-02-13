/**
 * Adapter interface for the comment data layer
 * @module @headless-comments/react/core/adapter
 */

import type { Comment } from './types';
import type { SortOrder } from './sorting';

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
    sortOrder?: SortOrder;
}

/**
 * Paginated response from the adapter.
 * Returned by getComments when pagination info is available.
 */
export interface PaginatedCommentsResponse<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The fetched comments */
    comments: Comment<T>[];
    /** Cursor for fetching the next page (undefined if no more pages) */
    nextCursor?: string;
    /** Whether more pages are available */
    hasMore: boolean;
    /** Total count of comments (if the backend provides it) */
    totalCount?: number;
}

/**
 * Adapter interface for plugging in different data sources
 * (REST API, GraphQL, local state, Supabase, etc.)
 *
 * Generic parameter `T` matches the `Comment<T>` metadata shape.
 *
 * For read-only use (e.g. display-only comment sections), implement only
 * `getComments`. Mutations (add/edit/delete/reaction) will update local state
 * only when the corresponding method is omitted.
 */
export interface CommentAdapter<T extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * Fetch comments from the data source.
     * Can return a plain array or a PaginatedCommentsResponse for pagination support.
     */
    getComments?(options?: FetchCommentsOptions): Promise<Comment<T>[] | PaginatedCommentsResponse<T>>;
    /** Create a new comment or reply. Omit for read-only adapters. */
    createComment?(content: string, parentId?: string): Promise<Comment<T>>;
    /** Update an existing comment. Omit for read-only adapters. */
    updateComment?(id: string, content: string): Promise<Comment<T>>;
    /** Delete a comment. Omit for read-only adapters. */
    deleteComment?(id: string): Promise<void>;
    /** Toggle a reaction on a comment. Omit for read-only adapters. */
    toggleReaction?(commentId: string, reactionId: string): Promise<void>;
    /** Subscribe to external changes (realtime, SSE, websockets, etc.) */
    subscribe?(listener: (comments: Comment<T>[]) => void): () => void;
    /** Clean up resources (connections, subscriptions) */
    dispose?(): void;
}
