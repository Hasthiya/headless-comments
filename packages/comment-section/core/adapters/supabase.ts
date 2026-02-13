/**
 * Supabase adapter for the comment system.
 * Published as a separate entry point to avoid bundling @supabase/supabase-js.
 * @module @headless-comments/react/adapters/supabase
 */

import type { Comment } from '../types';
import type { CommentAdapter, FetchCommentsOptions } from '../adapter';

/**
 * Minimal Supabase client interface — avoids importing @supabase/supabase-js at the type level.
 * Consumers pass their real SupabaseClient instance; this just describes what we use.
 */
export interface SupabaseClientLike {
    from(table: string): SupabaseQueryBuilder;
    channel?(name: string): SupabaseRealtimeChannel;
}

interface SupabaseQueryBuilder {
    select(columns?: string): SupabaseFilterBuilder;
    insert(values: Record<string, unknown> | Record<string, unknown>[]): SupabaseFilterBuilder;
    update(values: Record<string, unknown>): SupabaseFilterBuilder;
    delete(): SupabaseFilterBuilder;
}

interface SupabaseFilterBuilder {
    select(columns?: string): SupabaseFilterBuilder;
    eq(column: string, value: unknown): SupabaseFilterBuilder;
    is(column: string, value: null): SupabaseFilterBuilder;
    order(column: string, options?: { ascending?: boolean }): SupabaseFilterBuilder;
    limit(count: number): SupabaseFilterBuilder;
    single(): SupabaseFilterBuilder;
    range(from: number, to: number): SupabaseFilterBuilder;
    then<TResult>(onfulfilled?: (value: { data: unknown; error: unknown }) => TResult): Promise<TResult>;
}

interface SupabaseRealtimeChannel {
    on(event: string, filter: Record<string, string>, callback: (payload: unknown) => void): SupabaseRealtimeChannel;
    subscribe(): SupabaseRealtimeChannel;
    unsubscribe(): void;
}

export interface SupabaseAdapterOptions<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Supabase client instance */
    client: SupabaseClientLike;
    /** Table name for comments (default: 'comments') */
    tableName?: string;
    /** Table name for reactions (default: 'comment_reactions') */
    reactionsTable?: string;
    /** Column mapping for non-standard schemas */
    columns?: {
        id?: string;
        content?: string;
        authorId?: string;
        authorName?: string;
        avatarUrl?: string;
        parentId?: string;
        createdAt?: string;
        updatedAt?: string;
    };
    /** Enable realtime subscriptions */
    realtime?: boolean;
    /** Transform a raw database row into a Comment<T>. Override for custom schemas. */
    transformRow?: (row: Record<string, unknown>) => Comment<T>;
}

export interface SupabaseAdapter<T extends Record<string, unknown> = Record<string, unknown>>
    extends CommentAdapter<T> {
    /** Subscribe to realtime changes on the comments table */
    onRealtimeChange(callback: (payload: unknown) => void): () => void;
}

/**
 * Creates a Supabase adapter for comment persistence.
 * Requires `@supabase/supabase-js` as a peer dependency.
 */
export function createSupabaseAdapter<T extends Record<string, unknown> = Record<string, unknown>>(
    options: SupabaseAdapterOptions<T>
): SupabaseAdapter<T> {
    const {
        client,
        tableName = 'comments',
        reactionsTable = 'comment_reactions',
        columns = {},
        transformRow: customTransform,
    } = options;

    const col = {
        id: columns.id ?? 'id',
        content: columns.content ?? 'content',
        authorId: columns.authorId ?? 'author_id',
        authorName: columns.authorName ?? 'author_name',
        avatarUrl: columns.avatarUrl ?? 'avatar_url',
        parentId: columns.parentId ?? 'parent_id',
        createdAt: columns.createdAt ?? 'created_at',
        updatedAt: columns.updatedAt ?? 'updated_at',
    };

    function rowToComment(row: Record<string, unknown>): Comment<T> {
        if (!row || typeof row !== 'object') {
            throw new Error('Supabase adapter: received invalid row data');
        }
        if (customTransform) {
            return customTransform(row);
        }
        return {
            id: String(row[col.id] ?? ''),
            content: String(row[col.content] ?? ''),
            author: {
                id: String(row[col.authorId] ?? ''),
                name: String(row[col.authorName] ?? 'Unknown'),
                avatarUrl: row[col.avatarUrl] as string | undefined,
            },
            parentId: (row[col.parentId] as string) ?? undefined,
            createdAt: (row[col.createdAt] as string) ?? new Date().toISOString(),
            updatedAt: (row[col.updatedAt] as string) ?? undefined,
            isEdited: !!row[col.updatedAt],
            reactions: [],
            replies: [],
        } as Comment<T>;
    }

    let realtimeChannel: SupabaseRealtimeChannel | null = null;
    const realtimeListeners = new Set<(payload: unknown) => void>();

    // Store references for use in subscribe/dispose (avoids `this` binding issues)
    const adapter: SupabaseAdapter<T> = {
        async getComments(fetchOpts?: FetchCommentsOptions): Promise<Comment<T>[]> {
            let query = client.from(tableName).select('*');

            if (fetchOpts?.parentId) {
                query = query.eq(col.parentId, fetchOpts.parentId);
            }
            // No else — when parentId is not specified, fetch ALL comments (including replies).
            // useCommentTree's autoTree() will build the nested structure from the flat result.

            query = query.order(col.createdAt, {
                ascending: fetchOpts?.sortOrder === 'oldest',
            });

            if (fetchOpts?.limit) {
                query = query.limit(fetchOpts.limit);
            }

            const { data, error } = await (query as unknown as Promise<{ data: unknown; error: unknown }>);
            if (error) throw error;
            return Array.isArray(data)
                ? data.map((row) => rowToComment(row as Record<string, unknown>))
                : [];
        },

        async createComment(content: string, parentId?: string): Promise<Comment<T>> {
            const row: Record<string, unknown> = {
                [col.content]: content,
            };
            if (parentId) row[col.parentId] = parentId;

            const query = client.from(tableName).insert(row).select('*').single();
            const { data, error } = await (query as unknown as Promise<{ data: unknown; error: unknown }>);
            if (error) throw error;
            return rowToComment(data as Record<string, unknown>);
        },

        async updateComment(id: string, content: string): Promise<Comment<T>> {
            const query = client
                .from(tableName)
                .update({
                    [col.content]: content,
                    [col.updatedAt]: new Date().toISOString(),
                })
                .eq(col.id, id)
                .select('*')
                .single();

            const { data, error } = await (query as unknown as Promise<{ data: unknown; error: unknown }>);
            if (error) throw error;
            return rowToComment(data as Record<string, unknown>);
        },

        async deleteComment(id: string): Promise<void> {
            const query = client.from(tableName).delete().eq(col.id, id);
            const { error } = await (query as unknown as Promise<{ data: unknown; error: unknown }>);
            if (error) throw error;
        },

        async toggleReaction(commentId: string, reactionId: string): Promise<void> {
            // Use upsert-like approach: try to delete first; if nothing was deleted, insert.
            // This avoids the check-then-act race condition.
            const deleteQuery = client
                .from(reactionsTable)
                .delete()
                .eq('comment_id', commentId)
                .eq('reaction_id', reactionId)
                .select('*');

            const { data: deleted, error: deleteError } = await (deleteQuery as unknown as Promise<{
                data: unknown;
                error: unknown;
            }>);

            if (deleteError) throw deleteError;

            // If nothing was deleted, the reaction didn't exist — create it
            const deletedRows = Array.isArray(deleted) ? deleted : [];
            if (deletedRows.length === 0) {
                const insertQuery = client.from(reactionsTable).insert({
                    comment_id: commentId,
                    reaction_id: reactionId,
                });
                const { error } = await (insertQuery as unknown as Promise<{ data: unknown; error: unknown }>);
                if (error) throw error;
            }
        },

        onRealtimeChange(callback: (payload: unknown) => void): () => void {
            realtimeListeners.add(callback);

            // Set up channel on first listener — correct Supabase v2 API
            if (!realtimeChannel && client.channel) {
                realtimeChannel = client
                    .channel(`comments-${tableName}`)
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: tableName },
                        (payload: unknown) => {
                            for (const listener of realtimeListeners) {
                                listener(payload);
                            }
                        }
                    )
                    .subscribe();
            }

            return () => {
                realtimeListeners.delete(callback);
                if (realtimeListeners.size === 0 && realtimeChannel) {
                    realtimeChannel.unsubscribe();
                    realtimeChannel = null;
                }
            };
        },

        subscribe(listener: (comments: Comment<T>[]) => void): () => void {
            // Wire realtime changes to the subscribe interface
            // Use `adapter.onRealtimeChange` via closure reference to avoid `this` binding issues
            return adapter.onRealtimeChange(async () => {
                try {
                    const result = await adapter.getComments!();
                    // Handle both plain array and paginated response
                    const comments = Array.isArray(result) ? result : result.comments;
                    listener(comments);
                } catch {
                    // Silently ignore fetch errors during realtime sync
                }
            });
        },

        dispose(): void {
            if (realtimeChannel) {
                realtimeChannel.unsubscribe();
                realtimeChannel = null;
            }
            realtimeListeners.clear();
        },
    };

    return adapter;
}
