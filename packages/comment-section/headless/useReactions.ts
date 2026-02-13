'use client';

/**
 * Hook for handling reactions
 * @module @comment-section/react/useReactions
 */

import { useState, useCallback } from 'react';

/**
 * Hook for handling reactions with pending state tracking
 */
export const useReactions = (
    onReaction?: (commentId: string, reactionId: string) => void,
    _enableOptimistic?: boolean
) => {
    const [pendingReactions, setPendingReactions] = useState<Set<string>>(new Set());

    const toggleReaction = useCallback(
        (commentId: string, reactionId: string) => {
            const key = `${commentId}-${reactionId}`;
            if (pendingReactions.has(key)) return;
            setPendingReactions((prev) => new Set(prev).add(key));
            try {
                onReaction?.(commentId, reactionId);
            } finally {
                setPendingReactions((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        },
        [onReaction, pendingReactions]
    );

    const isPending = useCallback(
        (commentId: string, reactionId: string) => {
            return pendingReactions.has(`${commentId}-${reactionId}`);
        },
        [pendingReactions]
    );

    return {
        toggleReaction,
        isPending,
    };
};
