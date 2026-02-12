'use client';

/**
 * Hook for managing reply form state
 * @module @comment-section/react/useReplyForm
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing reply form state
 */
export const useReplyForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [value, setValue] = useState('');

    const openReply = useCallback((commentId: string) => {
        setActiveCommentId(commentId);
        setIsOpen(true);
        setValue('');
    }, []);

    const closeReply = useCallback(() => {
        setIsOpen(false);
        setActiveCommentId(null);
        setValue('');
    }, []);

    return {
        isOpen,
        activeCommentId,
        value,
        setValue,
        openReply,
        closeReply,
    };
};
