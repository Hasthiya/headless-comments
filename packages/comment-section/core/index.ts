/**
 * Core module — framework-agnostic logic for the comment system
 * @module @headless-comments/react/core
 */

// Types
export type {
    Comment,
    CommentUser,
    Reaction,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
    OptimisticState,
} from './types';

// Adapter
export type { CommentAdapter, FetchCommentsOptions, CallbackAdapterConfig } from './adapter';
export { createCallbackAdapter } from './adapter';

// Tree operations
export { buildCommentTree, flattenComments, findCommentById, countReplies } from './tree';

// Sorting
export { sortComments } from './sorting';

// Utilities & defaults
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
    truncateToLines,
    escapeHtml,
    parseMentions,
    debounce,
    throttle,
    isBrowser,
    getDefaultAvatar,
    copyToClipboard,
} from './utils';
