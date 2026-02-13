'use client';

/**
 * Hook for managing edit mode
 * @module @headless-comments/react/useEditMode
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing edit mode
 */
export const useEditMode = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const startEdit = useCallback((commentId: string, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditValue(currentContent);
        setIsEditing(true);
    }, []);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setEditingCommentId(null);
        setEditValue('');
    }, []);

    return {
        isEditing,
        editingCommentId,
        editValue,
        setEditValue,
        startEdit,
        cancelEdit,
    };
};
