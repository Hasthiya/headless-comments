/**
 * In-memory adapter for testing, prototyping, and SSR.
 * Stores comments in a closure. All operations are instant (optionally delayed).
 * @module @headless-comments/react/core/adapters/memory
 */

import type { Comment, CommentUser } from '../types';
import type { CommentAdapter, FetchCommentsOptions } from '../adapter';
import { addToTree, removeFromTree, updateInTree, toggleReactionInTree, findCommentById } from '../tree';
import { generateUniqueId } from '../utils';

export interface InMemoryAdapterOptions<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Initial comments (flat or nested) */
    initialComments?: Comment<T>[];
    /** Current user for authoring new comments */
    currentUser?: CommentUser;
    /** Custom ID generator */
    generateId?: () => string;
    /** Simulated network delay in ms (for testing). Default: 0 */
    latency?: number;
}

export interface InMemoryAdapter<T extends Record<string, unknown> = Record<string, unknown>>
    extends CommentAdapter<T> {
    /** Direct access to the current state */
    getState(): Comment<T>[];
    /** Reset to initial state */
    reset(): void;
    /** Subscribe to state changes */
    subscribe(listener: (comments: Comment<T>[]) => void): () => void;
}

/**
 * Creates an in-memory adapter that stores comments in a closure.
 * Useful for testing, prototyping, and static/SSR scenarios.
 */
export function createInMemoryAdapter<T extends Record<string, unknown> = Record<string, unknown>>(
    options: InMemoryAdapterOptions<T> = {}
): InMemoryAdapter<T> {
    const {
        initialComments = [],
        currentUser,
        generateId: genId = generateUniqueId,
        latency = 0,
    } = options;

    let state: Comment<T>[] = [...initialComments];
    const listeners = new Set<(comments: Comment<T>[]) => void>();

    function notify() {
        for (const listener of listeners) {
            listener(state);
        }
    }

    async function delay(): Promise<void> {
        if (latency > 0) {
            await new Promise((resolve) => setTimeout(resolve, latency));
        }
    }

    return {
        async getComments(_options?: FetchCommentsOptions): Promise<Comment<T>[]> {
            await delay();
            return state;
        },

        async createComment(content: string, parentId?: string): Promise<Comment<T>> {
            await delay();
            const newComment: Comment<T> = {
                id: genId(),
                content,
                author: currentUser ?? { id: 'anonymous', name: 'Anonymous' },
                createdAt: new Date(),
                parentId,
                replies: [],
                reactions: [],
            } as Comment<T>;

            state = addToTree(state, newComment, parentId, 'append');
            notify();
            return newComment;
        },

        async updateComment(id: string, content: string): Promise<Comment<T>> {
            await delay();
            state = updateInTree(state, id, {
                content,
                isEdited: true,
                updatedAt: new Date(),
            } as Partial<Comment<T>>);
            notify();
            // Return the updated comment (find it in the tree)
            const found = findCommentById(state, id);
            if (!found) throw new Error(`Comment ${id} not found`);
            return found;
        },

        async deleteComment(id: string): Promise<void> {
            await delay();
            state = removeFromTree(state, id);
            notify();
        },

        async toggleReaction(commentId: string, reactionId: string): Promise<void> {
            await delay();
            state = toggleReactionInTree(state, commentId, reactionId);
            notify();
        },

        subscribe(listener: (comments: Comment<T>[]) => void): () => void {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },

        getState(): Comment<T>[] {
            return state;
        },

        reset(): void {
            state = [...initialComments];
            notify();
        },

        dispose(): void {
            listeners.clear();
        },
    };
}
