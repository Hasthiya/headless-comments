'use client';

/**
 * React headless layer — hooks, provider, and types
 * @module @comment-section/react
 */

// Types
export type {
    CommentItemProps,
    CommentSectionProps,
    ReplyFormProps,
    ReactionButtonProps,
    AvatarProps,
    ActionBarProps,
    CommentSectionContextValue,
} from './types';

// Provider
export { CommentSectionContext, CommentSectionProvider } from './CommentProvider';
export type { CommentSectionProviderProps } from './CommentProvider';

// Core hooks
export { useCommentSection } from './useComments';
export { useOptimisticUpdates } from './useOptimisticUpdates';
export { useReplyForm } from './useReplyForm';
export { useEditMode } from './useEditMode';
export { useReactions } from './useReactions';

// Utility hooks
export {
    useAutoResize,
    useCharacterCount,
    useClickOutside,
    useKeyboardShortcut,
    useLocalStorage,
    useDebouncedValue,
    useInfiniteScroll,
    useFocus,
    useAnimationState,
} from './hooks';
