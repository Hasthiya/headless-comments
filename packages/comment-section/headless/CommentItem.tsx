import React, { memo } from 'react';
import type { Comment, CommentUser } from '../core/types';
import { useComment } from './useComment';
import type { UseCommentReturn } from './useComment';

/**
 * Props for the headless comment item.
 * Render function receives the same shape as useComment() return.
 * Works with or without CommentSectionProvider.
 */
export interface HeadlessCommentItemProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The comment data */
    comment: Comment<T>;
    /** Render function receiving comment state and handlers */
    children: (props: UseCommentReturn<T> & { depth: number; maxDepth: number }) => React.ReactNode;
    /** When outside Provider, pass handlers directly */
    onEdit?: (commentId: string, content: string) => void;
    /** When outside Provider, pass handlers directly */
    onReply?: (commentId: string, content: string) => void;
    /** When outside Provider, pass handlers directly */
    onReaction?: (commentId: string, reactionId: string) => void;
    /** When outside Provider, pass handlers directly */
    onDelete?: (commentId: string) => void;
    /** Current user (for standalone use) */
    currentUser?: CommentUser;
    /** Current nesting depth */
    depth?: number;
    /** Maximum nesting depth */
    maxDepth?: number;
}

/**
 * Props passed to the render function of HeadlessCommentItem.
 * Extends UseCommentReturn with depth info.
 */
export type HeadlessCommentItemChildrenProps<T extends Record<string, unknown> = Record<string, unknown>> = UseCommentReturn<T> & {
    depth: number;
    maxDepth: number;
};

/**
 * Headless comment item: provides comment state and handlers via render props.
 * Uses useComment internally. Works with or without CommentSectionProvider.
 * Wrapped in React.memo to prevent unnecessary re-renders in comment lists.
 */
function HeadlessCommentItemInner<T extends Record<string, unknown> = Record<string, unknown>>({
    comment,
    children,
    onEdit,
    onReply,
    onReaction,
    onDelete,
    currentUser,
    depth = 0,
    maxDepth = 3,
}: HeadlessCommentItemProps<T>): React.ReactElement {
    const commentState = useComment<T>(comment, {
        onEdit,
        onReply,
        onReaction,
        onDelete,
        currentUser,
    });

    return (
        <>
            {children({
                ...commentState,
                depth,
                maxDepth,
            })}
        </>
    );
}

/**
 * Memoized headless comment item component.
 * Re-renders only when props change (shallow comparison).
 */
export const HeadlessCommentItem = memo(HeadlessCommentItemInner) as typeof HeadlessCommentItemInner;
