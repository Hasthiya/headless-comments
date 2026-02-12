/**
 * General utilities, defaults, and merge functions
 * @module @comment-section/core/utils
 */

import type { CommentTexts, CommentTheme, ReactionConfig } from './types';

/**
 * Default text translations (English)
 */
export const defaultTexts: Required<CommentTexts> = {
    reply: 'Reply',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    submit: 'Submit',
    loadMore: 'Load more comments',
    noComments: 'No comments yet. Be the first to comment!',
    loading: 'Loading comments...',
    deleteConfirm: 'Are you sure you want to delete this comment?',
    replyPlaceholder: 'Write a reply...',
    editPlaceholder: 'Edit your comment...',
    replies: 'replies',
    hideReplies: 'Hide replies',
    showReplies: 'Show replies',
    edited: '(edited)',
    verified: 'Verified',
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
};

/**
 * Default theme configuration
 */
export const defaultTheme: Required<CommentTheme> = {
    primaryColor: '#f97316',
    secondaryColor: '#6b7280',
    backgroundColor: '#ffffff',
    hoverBackgroundColor: '#f9fafb',
    textColor: '#1f2937',
    secondaryTextColor: '#6b7280',
    borderColor: '#e5e7eb',
    borderRadius: '8px',
    fontFamily: 'inherit',
    fontSize: '14px',
    avatarSize: '40px',
    commentSpacing: '16px',
    animationDuration: '200ms',
    customCSS: {},
};

/**
 * Default reactions configuration
 */
export const defaultReactions: ReactionConfig[] = [
    { id: 'like', label: 'Like', emoji: '👍', activeColor: '#f97316' },
    { id: 'dislike', label: 'Dislike', emoji: '👎', activeColor: '#6b7280' },
    { id: 'heart', label: 'Love', emoji: '❤️', activeColor: '#ef4444' },
    { id: 'laugh', label: 'Laugh', emoji: '😂', activeColor: '#fbbf24' },
];

/**
 * Generate a unique ID
 */
export const generateUniqueId = (): string => {
    return `comment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Format a date to a relative time string
 */
export const formatRelativeTime = (
    date: Date | string,
    _locale: string = 'en',
    texts: Required<CommentTexts> = defaultTexts
): string => {
    const now = new Date();
    const past = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
        return texts.justNow;
    } else if (diffMin < 60) {
        return `${diffMin} ${texts.minutesAgo}`;
    } else if (diffHour < 24) {
        return `${diffHour} ${texts.hoursAgo}`;
    } else if (diffDay < 7) {
        return `${diffDay} ${texts.daysAgo}`;
    } else if (diffWeek < 4) {
        return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
    } else if (diffMonth < 12) {
        return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    } else {
        return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
    }
};

/**
 * Format date using Intl.DateTimeFormat
 */
export const formatDate = (
    date: Date | string,
    locale: string = 'en',
    options?: Intl.DateTimeFormatOptions
): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
};

/**
 * Merge user-provided texts with defaults
 */
export const mergeTexts = (texts?: CommentTexts): Required<CommentTexts> => {
    return {
        ...defaultTexts,
        ...texts,
    };
};

/**
 * Merge user-provided theme with defaults
 */
export const mergeTheme = (theme?: CommentTheme): Required<CommentTheme> => {
    return {
        ...defaultTheme,
        ...theme,
    };
};

/**
 * Merge user-provided reactions with defaults
 */
export const mergeReactions = (reactions?: ReactionConfig[]): ReactionConfig[] => {
    if (!reactions || reactions.length === 0) {
        return defaultReactions;
    }
    return reactions;
};

/**
 * Create CSS variables from theme
 */
export const themeToCSSVariables = (theme: Required<CommentTheme>): Record<string, string> => {
    return {
        '--cs-primary-color': theme.primaryColor,
        '--cs-secondary-color': theme.secondaryColor,
        '--cs-bg-color': theme.backgroundColor,
        '--cs-hover-bg-color': theme.hoverBackgroundColor,
        '--cs-text-color': theme.textColor,
        '--cs-secondary-text-color': theme.secondaryTextColor,
        '--cs-border-color': theme.borderColor,
        '--cs-border-radius': theme.borderRadius,
        '--cs-font-family': theme.fontFamily,
        '--cs-font-size': theme.fontSize,
        '--cs-avatar-size': theme.avatarSize,
        '--cs-comment-spacing': theme.commentSpacing,
        '--cs-animation-duration': theme.animationDuration,
        ...theme.customCSS,
    };
};

/**
 * Truncate text to a maximum length
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
};

/**
 * Escape HTML to prevent XSS
 */
export const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Parse mentions (@username) from text
 */
export const parseMentions = (text: string): { username: string; index: number }[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: { username: string; index: number }[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push({
            username: match[1],
            index: match.index,
        });
    }

    return mentions;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: Parameters<T>) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(...args), wait);
    };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: Parameters<T>) => void>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};

/**
 * Check if running in browser
 */
export const isBrowser = (): boolean => {
    return typeof window !== 'undefined';
};

/**
 * Get default avatar URL (generates a placeholder)
 */
export const getDefaultAvatar = (name: string): string => {
    const initials = name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    const colors = ['f97316', '3b82f6', '10b981', '8b5cf6', 'ec4899', '06b6d4'];
    const colorIndex = name.length % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${colors[colorIndex]}&color=fff`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        textArea.remove();
        return result;
    } catch {
        return false;
    }
};
