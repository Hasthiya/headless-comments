/**
 * Headless React layer — hooks, components, and Provider
 * @module @headless-comments/react/headless
 */

// ─── Types ──────────────────────────────────────────────────────────────────
export * from './types';

// ─── Provider ───────────────────────────────────────────────────────────────
export { CommentSectionProvider, CommentSectionContext } from './CommentProvider';
export type { CommentSectionProviderProps } from './CommentProvider';

// ─── Context hooks ──────────────────────────────────────────────────────────
export { useCommentSection, useOptionalCommentSection, useComments } from './useComments';

// ─── Standalone state management ────────────────────────────────────────────
export { useCommentTree } from './useCommentTree';
export type { UseCommentTreeOptions, UseCommentTreeReturn } from './useCommentTree';

// ─── Standalone sort/filter ─────────────────────────────────────────────────
export { useSortedComments } from './useSortedComments';
export type { UseSortedCommentsOptions, UseSortedCommentsReturn } from './useSortedComments';

// ─── Composable per-comment hooks ───────────────────────────────────────────
export { useEditComment } from './useEditComment';
export type { UseEditCommentOptions, UseEditCommentReturn } from './useEditComment';

export { useReplyTo } from './useReplyTo';
export type { UseReplyToOptions, UseReplyToReturn } from './useReplyTo';

export { useCommentReaction } from './useCommentReaction';
export type { UseCommentReactionOptions, UseCommentReactionReturn } from './useCommentReaction';

export { useComment } from './useComment';
export type { UseCommentOptions, UseCommentReturn } from './useComment';

// ─── Optimistic updates ─────────────────────────────────────────────────────
export { useOptimisticUpdates } from './useOptimisticUpdates';

// ─── Headless components ────────────────────────────────────────────────────
export { HeadlessCommentItem } from './CommentItem';
export type { HeadlessCommentItemProps, HeadlessCommentItemChildrenProps } from './CommentItem';

export { HeadlessReplyForm } from './ReplyForm';
export type { HeadlessReplyFormProps, HeadlessReplyFormChildrenProps } from './ReplyForm';

// ─── Utility hooks ──────────────────────────────────────────────────────────
export {
    useAutoResize,
    useCharacterCount,
    useClickOutside,
    useEnterSubmit,
    useKeyboardShortcut,
    useLocalStorage,
    useDebouncedValue,
    useInfiniteScroll,
    useFocus,
    useAnimationState,
    useRelativeTime,
} from './hooks';
