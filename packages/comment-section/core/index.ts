/**
 * Core module — framework-agnostic logic for the comment system
 * @module @headless-comments/react/core
 */

// ─── Types ──────────────────────────────────────────────────────────────────
export type {
    Comment,
    CommentUser,
    Reaction,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
    OptimisticState,
} from './types';

// ─── Adapter ────────────────────────────────────────────────────────────────
export type { CommentAdapter, FetchCommentsOptions, PaginatedCommentsResponse } from './adapter';

// ─── Adapter Implementations ────────────────────────────────────────────────
export { createInMemoryAdapter } from './adapters/memory';
export type { InMemoryAdapterOptions, InMemoryAdapter } from './adapters/memory';
export { createRestAdapter } from './adapters/rest';
export type { RestAdapterOptions } from './adapters/rest';
// Note: Supabase adapter is a separate entry point — import from './adapters/supabase'

// ─── Tree Operations (read) ─────────────────────────────────────────────────
export { buildCommentTree, flattenComments, findCommentById, countReplies } from './tree';

// ─── Tree Operations (mutate — pure, immutable) ─────────────────────────────
export { addToTree, removeFromTree, updateInTree, toggleReactionInTree, exclusiveToggleReactionInTree } from './tree';

// ─── Sorting & Filtering ────────────────────────────────────────────────────
export { sortComments, filterComments, searchComments } from './sorting';
export type { SortOrder, CommentComparator, SortCommentsOptions } from './sorting';

// ─── Utilities & Defaults ───────────────────────────────────────────────────
export {
    defaultTexts,
    defaultTheme,
    defaultReactions,
    defaultReactionsWithoutDislike,
    generateUniqueId,
    formatRelativeTime,
    formatDate,
    mergeTexts,
    mergeTheme,
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
} from './utils';
