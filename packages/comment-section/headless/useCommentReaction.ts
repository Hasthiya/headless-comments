'use client';

/**
 * Composable hook for managing reactions on a specific comment.
 * Works with or without CommentSectionProvider (context-optional pattern).
 * Supports both sync and async onReaction handlers — isPending reflects in-flight state.
 * @module @headless-comments/react/headless/useCommentReaction
 */

import { useState, useCallback, useRef } from 'react';
import type { Reaction } from '../core/types';
import { useOptionalCommentSection } from './useComments';

export interface UseCommentReactionOptions {
    /** Current reactions for this comment (for standalone use) */
    reactions?: Reaction[];
    /** Called when a reaction is toggled. Can return a Promise for async operations. If omitted, uses Provider context. */
    onReaction?: (commentId: string, reactionId: string) => void | Promise<void>;
}

export interface UseCommentReactionReturn {
    /** Toggle a reaction on this comment */
    toggle: (reactionId: string) => void;
    /** Check if a specific reaction toggle is pending */
    isPending: (reactionId: string) => boolean;
    /** The reactions array */
    reactions: Reaction[];
}

/**
 * Hook for managing reactions on a specific comment. Scoped to a single commentId.
 *
 * Context-optional: when used inside a Provider, auto-wires to context.toggleReaction.
 * When used standalone, pass onReaction in options.
 *
 * @param commentId - The id of the comment
 * @param options - Optional reactions data and callbacks
 */
export function useCommentReaction(
    commentId: string,
    options: UseCommentReactionOptions = {}
): UseCommentReactionReturn {
    const context = useOptionalCommentSection();
    const onReaction = options.onReaction ?? context?.toggleReaction;
    const reactions = options.reactions ?? [];

    const [pendingReactions, setPendingReactions] = useState<Set<string>>(new Set());
    // Use a ref to avoid putting pendingReactions in toggle's deps (prevents cascading re-renders)
    const pendingRef = useRef(pendingReactions);
    pendingRef.current = pendingReactions;

    const toggle = useCallback(
        (reactionId: string) => {
            if (!onReaction) {
                throw new Error(
                    'useCommentReaction: no onReaction handler provided. Either wrap in CommentSectionProvider or pass onReaction in options.'
                );
            }

            const key = `${commentId}-${reactionId}`;
            if (pendingRef.current.has(key)) return; // Prevent duplicate toggles

            setPendingReactions((prev) => new Set(prev).add(key));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const maybePromise: any = onReaction(commentId, reactionId);

            // Support both sync and async handlers
            if (maybePromise && typeof maybePromise.then === 'function') {
                (maybePromise as Promise<void>).finally(() => {
                    setPendingReactions((prev) => {
                        const next = new Set(prev);
                        next.delete(key);
                        return next;
                    });
                });
            } else {
                setPendingReactions((prev) => {
                    const next = new Set(prev);
                    next.delete(key);
                    return next;
                });
            }
        },
        [commentId, onReaction]
    );

    const isPending = useCallback(
        (reactionId: string) => {
            return pendingReactions.has(`${commentId}-${reactionId}`);
        },
        [commentId, pendingReactions]
    );

    return {
        toggle,
        isPending,
        reactions,
    };
}
