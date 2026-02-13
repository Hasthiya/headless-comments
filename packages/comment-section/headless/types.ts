/**
 * React-dependent types for the comment system
 * @module @comment-section/react/types
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

type ReactNode = React.ReactNode;
type CSSProperties = React.CSSProperties;

/**
 * Props for the CommentItem component
 */
export interface CommentItemProps {
    /** The comment data */
    comment: Comment;
    /** Current logged-in user */
    currentUser?: CommentUser | null;
    /** Callback when a reply is submitted (sync) */
    onReply?: (commentId: string, content: string) => void;
    /** Callback when a reaction is toggled */
    onReaction?: (commentId: string, reactionId: string) => void;
    /** Callback when a comment is edited (sync) */
    onEdit?: (commentId: string, content: string) => void;
    /** Callback when a comment is deleted */
    onDelete?: (commentId: string) => void;
    /** Maximum depth for nested replies */
    maxDepth?: number;
    /** Current depth level */
    depth?: number;
    /** Custom render function for the comment content */
    renderContent?: (comment: Comment) => ReactNode;
    /** Custom render function for the avatar */
    renderAvatar?: (user: CommentUser) => ReactNode;
    /** Custom render function for reactions */
    renderReactions?: (comment: Comment) => ReactNode;
    /** Custom render function for the action bar */
    renderActions?: (comment: Comment) => ReactNode;
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
export interface CommentSectionProps {
    /** Array of comments to display */
    comments: Comment[];
    /** Current logged-in user */
    currentUser?: CommentUser | null;
    /** Callback when a new comment is submitted */
    onSubmitComment?: (content: string) => Comment;
    /** Callback when a reply is submitted */
    onReply?: (commentId: string, content: string) => Comment;
    /** Callback when a reaction is toggled */
    onReaction?: (commentId: string, reactionId: string) => void;
    /** Callback when a comment is edited */
    onEdit?: (commentId: string, content: string) => Comment;
    /** Callback when a comment is deleted */
    onDelete?: (commentId: string) => void;
    /** Callback when a comment is reported */
    onReport?: (commentId: string, reason: string) => void;
    /** Callback when more comments are loaded */
    onLoadMore?: () => Comment[] | void;
    /** Whether more comments are available */
    hasMore?: boolean;
    /** Whether comments are currently loading */
    isLoading?: boolean;
    /** User-controlled: new comment form is submitting (e.g. API in progress) */
    isSubmittingComment?: boolean;
    /** User-controlled: reply form is submitting */
    isSubmittingReply?: boolean;
    /** Custom render for the new comment / reply form (user supplies UI) */
    renderReplyForm?: (props: RenderReplyFormProps) => ReactNode;
    /** Maximum depth for nested replies */
    maxDepth?: number;
    /** Custom render function for a comment */
    renderComment?: (comment: Comment, props: CommentItemProps) => ReactNode;
    /** Custom render function for the comment content */
    renderContent?: (comment: Comment) => ReactNode;
    /** Custom render function for the avatar */
    renderAvatar?: (user: CommentUser) => ReactNode;
    /** Custom render function for reactions */
    renderReactions?: (comment: Comment) => ReactNode;
    /** Custom render function for the action bar */
    renderActions?: (comment: Comment) => ReactNode;
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
    /** Custom sort function for comments */
    sortComments?: (comments: Comment[]) => Comment[];
    /** Sort order for comments */
    sortOrder?: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
    /** localStorage key for persisting sort preference */
    sortOrderKey?: string;
    /** Include dislike reaction in defaults (guideline: avoid unless required) */
    includeDislike?: boolean;
    /** Enable optimistic updates */
    enableOptimisticUpdates?: boolean;
    /** Custom unique ID generator */
    generateId?: () => string;
}

/**
 * Props passed to renderReplyForm when user supplies custom form UI
 */
export interface RenderReplyFormProps {
    /** Submit handler (sync) */
    onSubmit: (content: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    disabled?: boolean;
    /** Whether the form is in a submitting state (from isSubmittingComment / isSubmittingReply) */
    isSubmitting?: boolean;
    parentComment?: Comment;
}

/**
 * Props for the ReplyForm component
 */
export interface ReplyFormProps {
    /** Parent comment being replied to */
    parentComment?: Comment;
    /** Current user */
    currentUser?: CommentUser | null;
    /** Callback when reply is submitted (sync) */
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

/**
 * Context value for the CommentSection
 */
export interface CommentSectionContextValue {
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
    /** Whether optimistic updates are enabled */
    enableOptimisticUpdates: boolean;
    /** Max depth for replies */
    maxDepth: number;
    /** Whether the section is read-only */
    readOnly: boolean;
    /** Generate unique ID */
    generateId: () => string;
    /** List of comments (sorted) */
    comments: Comment[];
    /** Error state */
    error: Error | null;
    /** Set error state */
    setError: (error: Error | null) => void;
    /** Submit a new comment (sync) */
    submitComment: (content: string) => void;
    /** Reply to a comment (sync) */
    replyToComment: (commentId: string, content: string) => void;
    /** Toggle a reaction (sync) */
    toggleReaction: (commentId: string, reactionId: string) => void;
    /** Edit a comment (sync) */
    editComment: (commentId: string, content: string) => void;
    /** Delete a comment (sync) */
    deleteComment: (commentId: string) => void;
    /** Report a comment */
    reportComment?: (commentId: string, reason: string) => void;

    // Pagination
    onLoadMore?: () => Comment[] | void;
    hasMore: boolean;
    isLoading: boolean;
    isLoadingMore: boolean;
    loadMore: () => void;

    /** User-controlled: new comment form is submitting */
    isSubmittingComment: boolean;
    /** User-controlled: reply form is submitting */
    isSubmittingReply: boolean;

    /** Current sort order */
    sortOrder: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular';
    /** Change sort order (persists to localStorage when sortOrderKey is set) */
    setSortOrder: (order: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular') => void;
}
