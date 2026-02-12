'use client';

/**
 * Hook for optimistic updates
 * @module @comment-section/react/useOptimisticUpdates
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type { OptimisticState } from '../core/types';

/**
 * Hook for optimistic updates.
 * Simplified version that avoids ref access during render.
 */
export const useOptimisticUpdates = <T extends { id: string }>(
    initialData: T[]
): OptimisticState<T> => {
    // Track the base data (from server) and optimistic overlay
    const [baseData, setBaseData] = useState<T[]>(initialData);
    const [optimisticPatch, setOptimisticPatch] = useState<Map<string, Partial<T> | null>>(new Map());
    const [pendingAdds, setPendingAdds] = useState<T[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Compute final data by applying optimistic patch
    const data = useMemo(() => {
        let result = [...pendingAdds, ...baseData];

        // Apply patches
        optimisticPatch.forEach((patch, id) => {
            if (patch === null) {
                // Remove item
                result = result.filter((item) => item.id !== id);
            } else {
                // Update item
                result = result.map((item) =>
                    item.id === id ? { ...item, ...patch } : item
                );
            }
        });

        return result;
    }, [baseData, optimisticPatch, pendingAdds]);

    const add = useCallback((item: T) => {
        setIsPending(true);
        setError(null);
        setPendingAdds((prev) => [item, ...prev]);
    }, []);

    const update = useCallback((id: string, updates: Partial<T>) => {
        setIsPending(true);
        setError(null);
        setOptimisticPatch((prev) => {
            const next = new Map(prev);
            const existing = next.get(id);
            next.set(id, existing ? { ...existing, ...updates } : updates);
            return next;
        });
    }, []);

    const remove = useCallback((id: string) => {
        setIsPending(true);
        setError(null);
        setOptimisticPatch((prev) => {
            const next = new Map(prev);
            next.set(id, null); // null means remove
            return next;
        });
    }, []);

    const rollback = useCallback(() => {
        setPendingAdds([]);
        setOptimisticPatch(new Map());
        setIsPending(false);
        setError(null);
    }, []);

    // Sync with initialData changes
    useEffect(() => {
        setBaseData(initialData);
    }, [initialData]);

    const confirm = useCallback(() => {
        // Sync base data with current optimistic state
        setBaseData(data);
        setPendingAdds([]);
        setOptimisticPatch(new Map());
        setIsPending(false);
        setError(null);
    }, [data]);

    return useMemo(
        () => ({
            data,
            isPending,
            error,
            add,
            update,
            remove,
            rollback,
            confirm,
        }),
        [data, isPending, error, add, update, remove, rollback, confirm]
    );
};
