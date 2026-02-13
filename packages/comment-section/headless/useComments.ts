'use client';

/**
 * Hook to access the Headless Comments context
 * @module @comment-section/react/useComments
 */

import { useContext } from 'react';
import type { CommentSectionContextValue } from './types';
import { CommentSectionContext } from './CommentProvider';

/**
 * Hook to access the Headless Comments context.
 * Must be used within a CommentSectionProvider.
 */
export const useComments = (): CommentSectionContextValue => {
    const context = useContext(CommentSectionContext);
    if (!context) {
        throw new Error('useComments must be used within a CommentSectionProvider');
    }
    return context;
};

// Re-export for standard naming
export const useCommentSection = useComments;
