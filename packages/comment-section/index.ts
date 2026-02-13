'use client';

/**
 * Headless Comments React Component
 * A highly customizable, TypeScript-ready comment section with reply and reaction support
 *
 * @package @headless-comments/react
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
  getCommentPermalink,
  defaultTexts,
  defaultTheme,
  defaultReactions,
  generateUniqueId,
  formatRelativeTime,
  formatDate,
  mergeTexts,
  mergeTheme,
  defaultReactionsWithoutDislike,
  mergeReactions,
  themeToCSSVariables,
  truncateText,
  truncateToLines,
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
  RenderReplyFormProps,
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
  useEnterSubmit,
  useKeyboardShortcut,
  useLocalStorage,
  useDebouncedValue,
  useInfiniteScroll,
  useFocus,
  useAnimationState,
  useRelativeTime,
} from './headless/hooks';

export { HeadlessCommentItem } from './headless/CommentItem';
export type { HeadlessCommentItemProps, HeadlessCommentItemChildrenProps } from './headless/CommentItem';
export { HeadlessReplyForm } from './headless/ReplyForm';
export type { HeadlessReplyFormProps, HeadlessReplyFormChildrenProps } from './headless/ReplyForm';

// ─── Default Preset (minimal unstyled) ─────────────────────────────────────
export { CommentSection, CommentSection as DefaultCommentSection } from './presets/default';

// ─── Styled Preset (polished CSS-only UI) ──────────────────────────────────
export { StyledCommentSection } from './presets/styled';
export type { StyledCommentSectionProps } from './presets/styled';

// Default export for backwards compatibility
export { CommentSection as default } from './presets/default';
