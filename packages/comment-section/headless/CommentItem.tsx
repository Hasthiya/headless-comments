import React, { useState, useCallback } from 'react';
import { Comment } from '../core/types';
import { useCommentSection } from './useComments';
import { useReplyForm } from './useReplyForm';
import { useEditMode } from './useEditMode';
import { useReactions } from './useReactions';

export interface HeadlessCommentItemChildrenProps {
    comment: Comment;
    isAuthor: boolean;
    isEditing: boolean;
    showReplies: boolean;
    toggleReplies: () => void;
    onReplyOpen: () => void;
    onEditStart: () => void;
    onEditSubmit: (content: string) => void;
    onEditCancel: () => void;
    onDelete: () => void;
    onReaction: (reactionId: string) => void;
    isReactionPending: (commentId: string, reactionId: string) => boolean;
    currentUser: any;
    replies: Comment[];
    depth: number;
    maxDepth: number;
}

export interface HeadlessCommentItemProps {
    comment: Comment;
    children: (props: HeadlessCommentItemChildrenProps) => React.ReactNode;
    onReply?: (commentId: string, content: string) => void;
    onReaction?: (commentId: string, reactionId: string) => void;
    onEdit?: (commentId: string, content: string) => void;
    onDelete?: (commentId: string) => void;
    depth?: number;
    maxDepth?: number;
}

export const HeadlessCommentItem: React.FC<HeadlessCommentItemProps> = ({
    comment,
    children,
    onReaction,
    onEdit,
    onDelete,
    depth = 0,
    maxDepth: propMaxDepth,
}) => {
    const context = useCommentSection();
    const currentUser = context.currentUser;
    const maxDepth = propMaxDepth ?? context.maxDepth;

    // Local state
    const [showReplies, setShowReplies] = useState(true);
    const toggleReplies = useCallback(() => setShowReplies((prev) => !prev), []);

    // Hooks
    const replyForm = useReplyForm();
    const editMode = useEditMode();

    const { toggleReaction, isPending: isReactionPending } = useReactions(
        onReaction,
        context.enableOptimisticUpdates
    );

    // Computed
    const isAuthor = currentUser?.id === comment.author.id;
    const isEditing = editMode.isEditing && editMode.editingCommentId === comment.id;

    // Handlers
    const handleReplyOpen = useCallback(() => {
        replyForm.openReply(comment.id);
    }, [comment.id, replyForm]);

    const handleEditStart = useCallback(() => {
        editMode.startEdit(comment.id, comment.content);
    }, [comment.id, comment.content, editMode]);

    const handleEditSubmit = useCallback(
        (content: string) => {
            if (onEdit) {
                onEdit(comment.id, content);
                editMode.cancelEdit();
            }
        },
        [comment.id, onEdit, editMode]
    );

    const handleDelete = useCallback(() => {
        if (onDelete) onDelete(comment.id);
    }, [comment.id, onDelete]);

    const handleReaction = useCallback(
        (reactionId: string) => {
            toggleReaction(comment.id, reactionId);
        },
        [comment.id, toggleReaction]
    );

    // Helper for checking reaction pending state
    const checkReactionPending = useCallback(
        (cId: string, rId: string) => isReactionPending(cId, rId),
        [isReactionPending]
    );

    return (
        <>
            {children({
                comment,
                isAuthor,
                isEditing,
                showReplies,
                toggleReplies,
                onReplyOpen: handleReplyOpen,
                onEditStart: handleEditStart,
                onEditSubmit: handleEditSubmit,
                onEditCancel: editMode.cancelEdit,
                onDelete: handleDelete,
                onReaction: handleReaction,
                isReactionPending: checkReactionPending,
                currentUser,
                replies: showReplies ? (comment.replies || []) : [],
                depth,
                maxDepth,
            })}
        </>
    );
};
