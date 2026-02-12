'use client';

/**
 * Hook to access the Comment Section context
 * @module @comment-section/react/useComments
 */

import { useContext } from 'react';
import type { CommentSectionContextValue } from './types';
import { CommentSectionContext } from './CommentProvider';

/**
 * Hook to access the Comment Section context.
 * Must be used within a CommentSectionProvider.
 */
export const useCommentSection = (): CommentSectionContextValue => {
    const context = useContext(CommentSectionContext);
    if (!context) {
        throw new Error('useCommentSection must be used within a CommentSectionProvider');
    }
    return context;
};
