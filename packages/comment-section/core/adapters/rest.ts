/**
 * Generic REST adapter. Works with any REST API that follows standard CRUD conventions.
 * Zero external dependencies. Supports request cancellation via AbortController.
 * @module @headless-comments/react/core/adapters/rest
 */

import type { Comment } from '../types';
import type { CommentAdapter, FetchCommentsOptions } from '../adapter';

export interface RestAdapterOptions<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Base URL for the API (e.g. 'https://api.example.com') */
    baseUrl: string;
    /** Static headers or a function that returns headers (e.g. for auth tokens) */
    headers?: Record<string, string> | (() => Record<string, string>);
    /** Custom fetch function (default: globalThis.fetch) */
    fetch?: typeof globalThis.fetch;
    /** Transform raw API response into Comment<T>[]. Called on list responses. */
    transformResponse?: (data: unknown) => Comment<T>[];
    /** Transform raw API response for a single comment. Called on create/update. */
    transformComment?: (data: unknown) => Comment<T>;
    /** Custom endpoint paths (defaults shown in comments) */
    endpoints?: {
        /** GET — list comments. Default: '/comments' */
        list?: string;
        /** POST — create comment. Default: '/comments' */
        create?: string;
        /** PUT — update comment. Default: '/comments/:id' */
        update?: string;
        /** DELETE — delete comment. Default: '/comments/:id' */
        delete?: string;
        /** POST — toggle reaction. Default: '/comments/:id/reactions' */
        react?: string;
    };
}

/**
 * Creates a generic REST adapter. Works with any REST API following CRUD conventions.
 * Supports request cancellation — call `dispose()` to abort all in-flight requests.
 */
export function createRestAdapter<T extends Record<string, unknown> = Record<string, unknown>>(
    options: RestAdapterOptions<T>
): CommentAdapter<T> {
    const {
        baseUrl,
        headers: headersOpt,
        fetch: fetchFn = globalThis.fetch,
        transformResponse,
        transformComment,
        endpoints = {},
    } = options;

    const paths = {
        list: endpoints.list ?? '/comments',
        create: endpoints.create ?? '/comments',
        update: endpoints.update ?? '/comments/:id',
        delete: endpoints.delete ?? '/comments/:id',
        react: endpoints.react ?? '/comments/:id/reactions',
    };

    // Track active AbortControllers for cancellation on dispose
    const activeControllers = new Set<AbortController>();

    function resolveHeaders(): Record<string, string> {
        const base = typeof headersOpt === 'function' ? headersOpt() : (headersOpt ?? {});
        return {
            'Content-Type': 'application/json',
            ...base,
        };
    }

    function buildUrl(path: string, params?: Record<string, string>): string {
        let resolved = path;
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                resolved = resolved.replace(`:${key}`, encodeURIComponent(value));
            }
        }
        return `${baseUrl}${resolved}`;
    }

    async function request<R>(url: string, init?: RequestInit): Promise<R> {
        const controller = new AbortController();
        activeControllers.add(controller);

        try {
            const response = await fetchFn(url, {
                ...init,
                signal: controller.signal,
                headers: { ...resolveHeaders(), ...(init?.headers as Record<string, string>) },
            });
            if (!response.ok) {
                // Try to extract error body for better error messages
                let errorBody = '';
                try {
                    errorBody = await response.text();
                } catch {
                    // Ignore body read failures
                }
                throw new Error(
                    `REST adapter error: ${response.status} ${response.statusText}${errorBody ? ` — ${errorBody}` : ''}`
                );
            }
            // 204 No Content
            if (response.status === 204) return undefined as R;
            return response.json() as Promise<R>;
        } finally {
            activeControllers.delete(controller);
        }
    }

    return {
        async getComments(fetchOpts?: FetchCommentsOptions): Promise<Comment<T>[]> {
            const params = new URLSearchParams();
            if (fetchOpts?.parentId) params.set('parentId', fetchOpts.parentId);
            if (fetchOpts?.cursor) params.set('cursor', fetchOpts.cursor);
            if (fetchOpts?.limit) params.set('limit', String(fetchOpts.limit));
            if (fetchOpts?.sortOrder) params.set('sortOrder', fetchOpts.sortOrder);

            const qs = params.toString();
            const url = buildUrl(paths.list) + (qs ? `?${qs}` : '');
            const data = await request<unknown>(url, { method: 'GET' });

            return transformResponse ? transformResponse(data) : (data as Comment<T>[]);
        },

        async createComment(content: string, parentId?: string): Promise<Comment<T>> {
            const url = buildUrl(paths.create);
            const data = await request<unknown>(url, {
                method: 'POST',
                body: JSON.stringify({ content, parentId }),
            });

            return transformComment ? transformComment(data) : (data as Comment<T>);
        },

        async updateComment(id: string, content: string): Promise<Comment<T>> {
            const url = buildUrl(paths.update, { id });
            const data = await request<unknown>(url, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            });

            return transformComment ? transformComment(data) : (data as Comment<T>);
        },

        async deleteComment(id: string): Promise<void> {
            const url = buildUrl(paths.delete, { id });
            await request<void>(url, { method: 'DELETE' });
        },

        async toggleReaction(commentId: string, reactionId: string): Promise<void> {
            const url = buildUrl(paths.react, { id: commentId });
            await request<void>(url, {
                method: 'POST',
                body: JSON.stringify({ reactionId }),
            });
        },

        dispose(): void {
            // Abort all in-flight requests
            for (const controller of activeControllers) {
                controller.abort();
            }
            activeControllers.clear();
        },
    };
}
