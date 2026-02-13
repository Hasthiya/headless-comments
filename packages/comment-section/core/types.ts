/**
 * Core types for the comment system — framework-agnostic
 * @module @comment-section/core/types
 */

/**
 * Represents a user in the comment system
 */
export interface CommentUser {
    /** Unique identifier for the user */
    id: string;
    /** Display name of the user */
    name: string;
    /** URL to the user's avatar image */
    avatarUrl?: string;
    /** Whether the user is verified */
    isVerified?: boolean;
    /** User role for badge display (instructor, moderator, staff) */
    role?: 'verified' | 'instructor' | 'moderator' | 'staff';
    /** Additional metadata for the user */
    metadata?: Record<string, unknown>;
}

/**
 * Represents a single reaction on a comment
 */
export interface Reaction {
    /** Unique identifier for the reaction type (e.g., 'like', 'dislike', 'heart') */
    id: string;
    /** Display label for the reaction */
    label: string;
    /** Emoji or icon for the reaction */
    emoji: string;
    /** Count of users who reacted with this type */
    count: number;
    /** Whether the current user has reacted with this type */
    isActive?: boolean;
}

/**
 * Represents a single comment
 */
export interface Comment {
    /** Unique identifier for the comment */
    id: string;
    /** The comment content/text */
    content: string;
    /** The author of the comment */
    author: CommentUser;
    /** Timestamp when the comment was created */
    createdAt: Date | string;
    /** Timestamp when the comment was last updated */
    updatedAt?: Date | string;
    /** Parent comment ID for nested replies */
    parentId?: string;
    /** Array of reply comments */
    replies?: Comment[];
    /** Array of reactions on the comment */
    reactions?: Reaction[];
    /** Whether the comment has been edited */
    isEdited?: boolean;
    /** Whether the comment is pending (optimistic update) */
    isPending?: boolean;
    /** Whether the comment failed to submit */
    hasError?: boolean;
    /** Error message if submission failed */
    errorMessage?: string;
    /** Additional metadata for the comment */
    metadata?: Record<string, unknown>;
}

/**
 * Configuration for a reaction type
 */
export interface ReactionConfig {
    /** Unique identifier */
    id: string;
    /** Display label */
    label: string;
    /** Emoji or icon */
    emoji: string;
    /** Custom color for active state */
    activeColor?: string;
    /** Custom color for inactive state */
    inactiveColor?: string;
}

/**
 * Custom text translations
 */
export interface CommentTexts {
    /** Text for the reply button */
    reply?: string;
    /** Text for the edit button */
    edit?: string;
    /** Text for the delete button */
    delete?: string;
    /** Text for the cancel button */
    cancel?: string;
    /** Text for the submit button */
    submit?: string;
    /** Text for the load more button */
    loadMore?: string;
    /** Text for no comments */
    noComments?: string;
    /** Text for loading */
    loading?: string;
    /** Text for delete confirmation */
    deleteConfirm?: string;
    /** Placeholder for new comment input (main form) */
    inputPlaceholder?: string;
    /** Placeholder for reply input */
    replyPlaceholder?: string;
    /** Placeholder for edit input */
    editPlaceholder?: string;
    /** Text for replies count */
    replies?: string;
    /** Text for hide replies */
    hideReplies?: string;
    /** Text for show replies */
    showReplies?: string;
    /** Text for edited indicator */
    edited?: string;
    /** Text for verified badge */
    verified?: string;
    /** Copy link */
    copyLink?: string;
    /** Report */
    report?: string;
    /** Report reason: Spam */
    reportSpam?: string;
    /** Report reason: Harassment */
    reportHarassment?: string;
    /** Report reason: Off-topic */
    reportOffTopic?: string;
    /** Report reason: Other */
    reportOther?: string;
    /** Badge: Instructor */
    instructor?: string;
    /** Badge: Moderator */
    moderator?: string;
    /** Badge: Staff */
    staff?: string;
    /** Thanks for report feedback */
    reportThanks?: string;
    /** Text for just now */
    justNow?: string;
    /** Text for minutes ago */
    minutesAgo?: string;
    /** Text for hours ago */
    hoursAgo?: string;
    /** Text for days ago */
    daysAgo?: string;
    /** Sort: Newest */
    sortNewest?: string;
    /** Sort: Oldest */
    sortOldest?: string;
    /** Sort: Top (popular) */
    sortTop?: string;
    /** Read more button */
    readMore?: string;
}

/**
 * Theme configuration for styling
 */
export interface CommentTheme {
    /** Primary color for active elements */
    primaryColor?: string;
    /** Secondary color */
    secondaryColor?: string;
    /** Background color for comments */
    backgroundColor?: string;
    /** Background color for hover states */
    hoverBackgroundColor?: string;
    /** Text color */
    textColor?: string;
    /** Secondary text color (for timestamps, etc.) */
    secondaryTextColor?: string;
    /** Border color */
    borderColor?: string;
    /** Border radius */
    borderRadius?: string;
    /** Font family */
    fontFamily?: string;
    /** Font size */
    fontSize?: string;
    /** Avatar size */
    avatarSize?: string;
    /** Spacing between comments */
    commentSpacing?: string;
    /** Animation duration */
    animationDuration?: string;
    /** Custom CSS variables */
    customCSS?: Record<string, string>;
}

/**
 * State for the optimistic update hook
 */
export interface OptimisticState<T> {
    /** The optimistic data */
    data: T[];
    /** Whether an operation is pending */
    isPending: boolean;
    /** Any error that occurred */
    error: Error | null;
    /** Function to add an item optimistically */
    add: (item: T) => void;
    /** Function to update an item optimistically */
    update: (id: string, updates: Partial<T>) => void;
    /** Function to remove an item optimistically */
    remove: (id: string) => void;
    /** Function to rollback to the previous state */
    rollback: () => void;
    /** Function to confirm the optimistic update */
    confirm: () => void;
}
