/**
 * Sorting utilities for comments
 * @module @comment-section/core/sorting
 */

import type { Comment } from './types';

/**
 * Sort comments by different criteria
 */
export const sortComments = (
    comments: Comment[],
    order: 'asc' | 'desc' | 'oldest' | 'newest' | 'popular' = 'newest'
): Comment[] => {
    const sorted = [...comments];

    switch (order) {
        case 'oldest':
        case 'asc':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateA - dateB;
            });
        case 'newest':
        case 'desc':
            return sorted.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA;
            });
        case 'popular':
            return sorted.sort((a, b) => {
                const reactionsA = a.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
                const reactionsB = b.reactions?.reduce((sum, r) => sum + r.count, 0) || 0;
                return reactionsB - reactionsA;
            });
        default: {
            const exhaustive: never = order;
            void exhaustive;
            return sorted;
        }
    }
};
