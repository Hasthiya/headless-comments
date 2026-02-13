/**
 * React-dependent types for the comment system (v2)
 * @module @headless-comments/react/types
 */

import * as React from 'react';
import type {
    Comment,
    CommentUser,
    Reaction,
    ReactionConfig,
    CommentTexts,
    CommentTheme,
} from '../core/types';
import type { SortOrder } from '../core/sorting';
import type { UseCommentTreeReturn } from './useCommentTree';

type ReactNode = React.ReactNode;
type CSSProperties = React.CSSProperties;

// ─── CommentSection Context ─────────────────────────────────────────────────

/**
 * Context value for the CommentSection.
 * Generic parameter `T` matches the `Comment<T>` metadata shape.
 */
export interface CommentSectionContextValue<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Current user */
    currentUser?: CommentUser | null;
    /** Available reactions */
    availableReactions: ReactionConfig[];
    /** Custom texts */
    texts: Required<CommentTexts>;
    /** Theme */
    theme: Required<CommentTheme>;
    /** Locale */
    locale: string;
    /** Max depth for replies */
    maxDepth: number;
    /** Whether the section is read-only */
    readOnly: boolean;
    /** Generate unique ID */
    generateId: () => string;
    /** List of comments (from the tree) */
    comments: Comment<T>[];
    /** Error state */
    error: Error | null;
    /** Submit a new comment */
    submitComment: (content: string) => Comment<T>;
    /** Reply to a comment */
    replyToComment: (parentId: string, content: string) => Comment<T>;
    /** Toggle a reaction. Returns a Promise when backed by an adapter. */
    toggleReaction: (commentId: string, reactionId: string) => void | Promise<void>;
    /** Edit a comment. Returns a Promise when backed by an adapter. */
    editComment: (commentId: string, content: string) => void | Promise<void>;
    /** Delete a comment. Returns a Promise when backed by an adapter. */
    deleteComment: (commentId: string) => void | Promise<void>;
    /** Report a comment */
    reportComment?: (commentId: string, reason: string) => void;
    /** Set the comments tree */
    setComments: (comments: Comment<T>[]) => void;
    /** Find a comment by ID */
    findComment: (commentId: string) => Comment<T> | undefined;
    /** Total comment count */
    totalCount: number;
    /** Whether the adapter is loading */
    isLoading: boolean;
    /** Current sort order */
    sortOrder: SortOrder;
    /** Change sort order */
    setSortOrder: (order: SortOrder) => void;
}

// ─── Component Props ────────────────────────────────────────────────────────

/**
 * Props for the CommentItem component
 */
export interface CommentItemProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** The comment data */
    comment: Comment<T>;
    /** Current logged-in user */
    currentUser?: CommentUser | null;
    /** Callback when a reply is submitted */
    onReply?: (commentId: string, content: string) => void;
    /** Callback when a reaction is toggled */
    onReaction?: (commentId: string, reactionId: string) => void;
    /** Callback when a comment is edited */
    onEdit?: (commentId: string, content: string) => void;
    /** Callback when a comment is deleted */
    onDelete?: (commentId: string) => void;
    /** Maximum depth for nested replies */
    maxDepth?: number;
    /** Current depth level */
    depth?: number;
    /** Custom render function for the comment content */
    renderContent?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the avatar */
    renderAvatar?: (user: CommentUser) => ReactNode;
    /** Custom render function for reactions */
    renderReactions?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the action bar */
    renderActions?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the timestamp */
    renderTimestamp?: (date: Date | string) => ReactNode;
    /** Show/hide the reply form */
    showReplyForm?: boolean;
    /** Show/hide reactions */
    showReactions?: boolean;
    /** Show/hide the more options menu */
    showMoreOptions?: boolean;
    /** Available reactions configuration */
    availableReactions?: ReactionConfig[];
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Locale for date formatting */
    locale?: string;
    /** Whether to show verified badges */
    showVerifiedBadge?: boolean;
    /** Custom text for the reply button */
    replyButtonText?: string;
    /** Custom text for the edit button */
    editButtonText?: string;
    /** Custom text for the delete button */
    deleteButtonText?: string;
    /** Custom text for the cancel button */
    cancelButtonText?: string;
    /** Custom text for the submit button */
    submitButtonText?: string;
    /** Placeholder text for the reply input */
    replyPlaceholder?: string;
    /** Placeholder text for the edit input */
    editPlaceholder?: string;
    /** Whether the comment section is read-only */
    readOnly?: boolean;
    /** Custom theme configuration */
    theme?: CommentTheme;
    /** Max lines before "Read more" truncation (default 5) */
    maxCommentLines?: number;
}

/**
 * Props for the CommentSection component
 */
export interface CommentSectionProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Array of comments to display */
    comments?: Comment<T>[];
    /** Pre-configured tree instance from useCommentTree */
    tree?: UseCommentTreeReturn<T>;
    /** Current logged-in user */
    currentUser?: CommentUser | null;
    /** Callback when a new comment is submitted */
    onSubmitComment?: (content: string) => Comment<T>;
    /** Callback when a reply is submitted */
    onReply?: (commentId: string, content: string) => Comment<T>;
    /** Callback when a reaction is toggled */
    onReaction?: (commentId: string, reactionId: string) => void;
    /** Callback when a comment is edited */
    onEdit?: (commentId: string, content: string) => void;
    /** Callback when a comment is deleted */
    onDelete?: (commentId: string) => void;
    /** Callback when a comment is reported */
    onReport?: (commentId: string, reason: string) => void;
    /** Custom render for the reply form */
    renderReplyForm?: (props: RenderReplyFormProps<T>) => ReactNode;
    /** Maximum depth for nested replies */
    maxDepth?: number;
    /** Custom render function for a comment */
    renderComment?: (comment: Comment<T>, props: CommentItemProps<T>) => ReactNode;
    /** Custom render function for the comment content */
    renderContent?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the avatar */
    renderAvatar?: (user: CommentUser) => ReactNode;
    /** Custom render function for reactions */
    renderReactions?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the action bar */
    renderActions?: (comment: Comment<T>) => ReactNode;
    /** Custom render function for the timestamp */
    renderTimestamp?: (date: Date | string) => ReactNode;
    /** Custom render function for the empty state */
    renderEmpty?: () => ReactNode;
    /** Custom render function for the loading state */
    renderLoading?: () => ReactNode;
    /** Custom render function for the error state */
    renderError?: (error: Error) => ReactNode;
    /** Custom render function for the header */
    renderHeader?: () => ReactNode;
    /** Custom render function for the footer */
    renderFooter?: () => ReactNode;
    /** Show/hide reactions */
    showReactions?: boolean;
    /** Show/hide the more options menu */
    showMoreOptions?: boolean;
    /** Available reactions configuration */
    availableReactions?: ReactionConfig[];
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: CSSProperties;
    /** Locale for date formatting */
    locale?: string;
    /** Whether to show verified badges */
    showVerifiedBadge?: boolean;
    /** Custom text translations */
    texts?: CommentTexts;
    /** Whether the comment section is read-only */
    readOnly?: boolean;
    /** Custom theme configuration */
    theme?: CommentTheme;
    /** Placeholder text for the comment input */
    inputPlaceholder?: string;
    /** Initial value for the comment input */
    initialValue?: string;
    /** Maximum character limit for comments */
    maxCharLimit?: number;
    /** Max lines before "Read more" truncation (default 5) */
    maxCommentLines?: number;
    /** Show character count */
    showCharCount?: boolean;
    /** Auto focus the input on mount */
    autoFocus?: boolean;
    /** Enable mentions (@username) */
    enableMentions?: boolean;
    /** Sort order for comments */
    sortOrder?: SortOrder;
    /** localStorage key for persisting sort preference */
    sortOrderKey?: string;
    /** Include dislike reaction in defaults */
    includeDislike?: boolean;
    /** Custom unique ID generator */
    generateId?: () => string;
}

/**
 * Props passed to renderReplyForm when user supplies custom form UI
 */
export interface RenderReplyFormProps<T extends Record<string, unknown> = Record<string, unknown>> {
    /** Submit handler */
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    disabled?: boolean;
    isSubmitting?: boolean;
    parentComment?: Comment<T>;
}

/**
 * Props for the ReplyForm component
 */
export interface ReplyFormProps {
    /** Parent comment being replied to */
    parentComment?: Comment;
    /** Current user */
    currentUser?: CommentUser | null;
    /** Callback when reply is submitted */
    onSubmit: (content: string) => void;
    /** Callback when cancelled */
    onCancel?: () => void;
    /** Placeholder text */
    placeholder?: string;
    /** Submit button text */
    submitText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Maximum character limit */
    maxCharLimit?: number;
    /** Show character count */
    showCharCount?: boolean;
    /** Auto focus the input */
    autoFocus?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom theme */
    theme?: CommentTheme;
    /** Whether the form is disabled */
    disabled?: boolean;
}

/**
 * Props for the ReactionButton component
 */
export interface ReactionButtonProps {
    /** The reaction data */
    reaction: Reaction;
    /** Whether the reaction is active */
    isActive?: boolean;
    /** Callback when clicked */
    onClick: () => void;
    /** Show count */
    showCount?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom theme */
    theme?: CommentTheme;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Props for the Avatar component
 */
export interface AvatarProps {
    /** User data */
    user: CommentUser;
    /** Size of the avatar */
    size?: 'sm' | 'md' | 'lg';
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: CSSProperties;
    /** Custom render function */
    render?: (user: CommentUser) => ReactNode;
}

/**
 * Props for the ActionBar component
 */
export interface ActionBarProps {
    /** The comment */
    comment: Comment;
    /** Current user */
    currentUser?: CommentUser | null;
    /** Callback when reply is clicked */
    onReply?: () => void;
    /** Callback when reaction is toggled */
    onReaction?: (reactionId: string) => void;
    /** Callback when edit is clicked */
    onEdit?: () => void;
    /** Callback when delete is clicked */
    onDelete?: () => void;
    /** Available reactions */
    availableReactions?: ReactionConfig[];
    /** Show reactions */
    showReactions?: boolean;
    /** Show more options */
    showMoreOptions?: boolean;
    /** Custom texts */
    texts?: CommentTexts;
    /** Custom theme */
    theme?: CommentTheme;
    /** Whether the actions are disabled */
    disabled?: boolean;
    /** Whether the current user is the author */
    isAuthor?: boolean;
}
