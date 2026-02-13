'use client';

/**
 * Hooks to access the comment section context.
 * @module @headless-comments/react/useComments
 */

import { useContext } from 'react';
import type { CommentSectionContextValue } from './types';
import { CommentSectionContext } from './CommentProvider';

/**
 * Hook to access the Headless Comments context.
 * Must be used within a CommentSectionProvider. Throws if no Provider found.
 */
export const useCommentSection = (): CommentSectionContextValue => {
    const context = useContext(CommentSectionContext);
    if (!context) {
        throw new Error('useCommentSection must be used within a CommentSectionProvider');
    }
    return context;
};

/**
 * Non-throwing version — returns the context value or null if no Provider is found.
 * Used internally by composable hooks for the "context optional" pattern.
 */
export const useOptionalCommentSection = (): CommentSectionContextValue | null => {
    return useContext(CommentSectionContext);
};

// Legacy alias
export const useComments = useCommentSection;
