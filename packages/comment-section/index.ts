/**
 * Headless Comments React Component — v2.0
 * A highly customizable, TypeScript-ready comment section with tree CRUD,
 * standalone hooks, composable per-comment hooks, and pluggable adapters.
 *
 * @package @hasthiya_/headless-comments-react
 * @version 2.0.0
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

export type { SortOrder, CommentComparator, SortCommentsOptions } from './core/sorting';
export type { CommentAdapter, FetchCommentsOptions, PaginatedCommentsResponse } from './core/adapter';
export type { InMemoryAdapterOptions, InMemoryAdapter } from './core/adapters/memory';
export type { RestAdapterOptions } from './core/adapters/rest';

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

// Tree (read)
export {
  flattenComments,
  buildCommentTree,
  countReplies,
  findCommentById,
} from './core/tree';

// Tree (mutate)
export {
  addToTree,
  removeFromTree,
  updateInTree,
  toggleReactionInTree,
  exclusiveToggleReactionInTree,
} from './core/tree';

// Sorting & filtering
export { sortComments, filterComments, searchComments } from './core/sorting';

// Adapters
export { createInMemoryAdapter } from './core/adapters/memory';
export { createRestAdapter } from './core/adapters/rest';

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

// Provider & context
export { CommentSectionProvider } from './headless/CommentProvider';
export { useCommentSection, useOptionalCommentSection } from './headless/useComments';

// Standalone hooks
export { useCommentTree } from './headless/useCommentTree';
export type { UseCommentTreeOptions, UseCommentTreeReturn } from './headless/useCommentTree';

export { useSortedComments } from './headless/useSortedComments';
export type { UseSortedCommentsOptions, UseSortedCommentsReturn } from './headless/useSortedComments';

// Composable per-comment hooks
export { useEditComment } from './headless/useEditComment';
export type { UseEditCommentOptions, UseEditCommentReturn } from './headless/useEditComment';

export { useReplyTo } from './headless/useReplyTo';
export type { UseReplyToOptions, UseReplyToReturn } from './headless/useReplyTo';

export { useCommentReaction } from './headless/useCommentReaction';
export type { UseCommentReactionOptions, UseCommentReactionReturn } from './headless/useCommentReaction';

export { useComment } from './headless/useComment';
export type { UseCommentOptions, UseCommentReturn, UseCommentEditReturn } from './headless/useComment';

// Optimistic updates
export { useOptimisticUpdates } from './headless/useOptimisticUpdates';

// Utility hooks
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

// Headless components
export { HeadlessCommentItem } from './headless/CommentItem';
export type { HeadlessCommentItemProps, HeadlessCommentItemChildrenProps } from './headless/CommentItem';
export { HeadlessReplyForm } from './headless/ReplyForm';
export type { HeadlessReplyFormProps, HeadlessReplyFormChildrenProps } from './headless/ReplyForm';
export { CommentSkeleton } from './headless/CommentSkeleton';
export type { CommentSkeletonProps } from './headless/CommentSkeleton';
export { CommentSectionErrorBoundary } from './headless/CommentSectionErrorBoundary';
export type { CommentSectionErrorBoundaryProps } from './headless/CommentSectionErrorBoundary';

// ─── Default Preset (minimal unstyled) ─────────────────────────────────────
export { CommentSection, CommentSection as DefaultCommentSection } from './presets/default';

// ─── Styled Preset (polished CSS-only UI) ──────────────────────────────────
export { StyledCommentSection } from './presets/styled';
export type { StyledCommentSectionProps } from './presets/styled';

// Default export
export { CommentSection as default } from './presets/default';
