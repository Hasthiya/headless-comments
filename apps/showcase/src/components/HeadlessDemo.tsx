'use client';

import { useCallback, useState } from 'react';
import {
    CommentSection,
    generateUniqueId,
    type Comment,
    type CommentUser,
    type Reaction,
} from '@comment-section/react';

const demoUser: CommentUser = {
    id: 'headless-user',
    name: 'You',
    isVerified: true,
};

const defaultReactions: Reaction[] = [
    { id: 'like', label: 'Like', emoji: '👍', count: 0, isActive: false },
    { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
];

const seedComments: Comment[] = [
    {
        id: 'h1',
        content: 'This is the headless preset — unstyled by default, fully customisable.',
        author: { id: 'u10', name: 'Dev', isVerified: true },
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        reactions: [
            { id: 'like', label: 'Like', emoji: '👍', count: 4, isActive: false },
            { id: 'heart', label: 'Heart', emoji: '❤️', count: 1, isActive: false },
        ],
        replies: [
            {
                id: 'h1-1',
                content: 'You can style every element with your own classes.',
                author: { id: 'u11', name: 'Designer' },
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                parentId: 'h1',
                reactions: [
                    { id: 'like', label: 'Like', emoji: '👍', count: 1, isActive: false },
                    { id: 'heart', label: 'Heart', emoji: '❤️', count: 0, isActive: false },
                ],
            },
        ],
    },
];

export function HeadlessDemo() {
    const [comments, setComments] = useState<Comment[]>(seedComments);

    const handleSubmit = useCallback((content: string): Comment => {
        const c: Comment = {
            id: generateUniqueId(),
            content,
            author: demoUser,
            createdAt: new Date(),
            reactions: [...defaultReactions],
        };
        setComments((prev) => [c, ...prev]);
        return c;
    }, []);

    const handleReply = useCallback((commentId: string, content: string): Comment => {
        const reply: Comment = {
            id: generateUniqueId(),
            content,
            author: demoUser,
            createdAt: new Date(),
            parentId: commentId,
            reactions: [...defaultReactions],
        };
        setComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) return { ...c, replies: [...(c.replies ?? []), reply] };
                if (c.replies) {
                    return {
                        ...c,
                        replies: c.replies.map((r) =>
                            r.id === commentId ? { ...r, replies: [...(r.replies ?? []), reply] } : r
                        ),
                    };
                }
                return c;
            })
        );
        return reply;
    }, []);

    const handleReaction = useCallback((commentId: string, reactionId: string) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) {
                    return {
                        ...c,
                        reactions: (c.reactions ?? []).map((r) =>
                            r.id === reactionId
                                ? { ...r, count: r.count + (r.isActive ? -1 : 1), isActive: !r.isActive }
                                : r
                        ),
                    };
                }
                if (c.replies) {
                    return {
                        ...c,
                        replies: c.replies.map((r) =>
                            r.id === commentId
                                ? {
                                    ...r,
                                    reactions: (r.reactions ?? []).map((re) =>
                                        re.id === reactionId
                                            ? { ...re, count: re.count + (re.isActive ? -1 : 1), isActive: !re.isActive }
                                            : re
                                    ),
                                }
                                : r
                        ),
                    };
                }
                return c;
            })
        );
    }, []);

    const handleEdit = useCallback(
        (commentId: string, content: string): Comment => {
            const updatedAt = new Date();
            const applyEdit = (list: Comment[]): { next: Comment[]; updated: Comment | null } => {
                let updated: Comment | null = null;
                const next = list.map((c) => {
                    if (c.id === commentId) {
                        updated = { ...c, content, updatedAt, isEdited: true };
                        return updated;
                    }
                    if (c.replies) {
                        const { next: replyNext, updated: replyUpdated } = applyEdit(c.replies);
                        if (replyUpdated) updated = replyUpdated;
                        return { ...c, replies: replyNext };
                    }
                    return c;
                });
                return { next, updated };
            };
            const { next, updated } = applyEdit(comments);
            setComments(next);
            return updated ?? { id: commentId, content, author: demoUser, createdAt: new Date(), updatedAt, isEdited: true };
        },
        [comments]
    );

    const handleDelete = useCallback((commentId: string) => {
        const remove = (list: Comment[]): Comment[] =>
            list
                .filter((c) => c.id !== commentId)
                .map((c) => (c.replies ? { ...c, replies: remove(c.replies) } : c));
        setComments((prev) => remove(prev));
    }, []);

    return (
        <div className="space-y-4">
            <div>
                <CommentSection
                    comments={comments}
                    currentUser={demoUser}
                    onSubmitComment={handleSubmit}
                    onReply={handleReply}
                    onReaction={handleReaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showReactions
                    inputPlaceholder="Type here (headless mode)..."
                    enableOptimisticUpdates
                />
            </div>
        </div>
    );
}
