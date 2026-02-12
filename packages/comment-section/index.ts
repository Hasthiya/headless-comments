'use client';

/**
 * React Comment Section Component
 * A highly customizable, TypeScript-ready comment section with reply and reaction support
 *
 * @package @comment-section/react
 * @version 1.0.0
 * @license MIT
 */

// ─── Core (zero React deps) ────────────────────────────────────────────────
export type {
  Comment,
  CommentUser,
  Reaction,
  ReactionConfig,
  CommentTexts,
  CommentTheme,
  OptimisticState,
} from './core/types';

export {
  defaultTexts,
  defaultTheme,
  defaultReactions,
  generateUniqueId,
  formatRelativeTime,
  formatDate,
  mergeTexts,
  mergeTheme,
  mergeReactions,
  themeToCSSVariables,
  truncateText,
  escapeHtml,
  parseMentions,
  debounce,
  throttle,
  isBrowser,
  getDefaultAvatar,
  copyToClipboard,
} from './core/utils';

export { sortComments } from './core/sorting';

export {
  flattenComments,
  buildCommentTree,
  countReplies,
  findCommentById,
} from './core/tree';

export type { CommentAdapter } from './core/adapter';
export { createCallbackAdapter } from './core/adapter';

// ─── React Headless Layer ───────────────────────────────────────────────────
export type {
  CommentSectionProps,
  CommentItemProps,
  ReplyFormProps,
  ReactionButtonProps,
  AvatarProps,
  ActionBarProps,
  CommentSectionContextValue,
} from './headless/types';

export { CommentSectionProvider } from './headless/CommentProvider';
export { useCommentSection } from './headless/useComments';
export { useOptimisticUpdates } from './headless/useOptimisticUpdates';
export { useReplyForm } from './headless/useReplyForm';
export { useEditMode } from './headless/useEditMode';
export { useReactions } from './headless/useReactions';
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
} from './headless/hooks';

export { HeadlessCommentItem } from './headless/CommentItem';
export type { HeadlessCommentItemProps, HeadlessCommentItemChildrenProps } from './headless/CommentItem';
export { HeadlessReplyForm } from './headless/ReplyForm';
export type { HeadlessReplyFormProps, HeadlessReplyFormChildrenProps } from './headless/ReplyForm';

// ─── Default Preset (styled components) ────────────────────────────────────
export {
  CommentSection,
  CommentItem,
  ActionBar,
  ReplyForm,
  ReactionButton,
  Avatar,
} from './presets/default';

// ─── Shadcn Preset (new default implementation) ─────────────────────────────
export {
  ShadcnCommentSection,
  ShadcnCommentItem,
  ShadcnActionBar,
  ShadcnReplyForm,
  ShadcnReactionButton,
  ShadcnAvatar,
} from './presets/shadcn';

// Default export for backwards compatibility
export { CommentSection as default } from './presets/default';
