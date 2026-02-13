'use client';

import {
    CommentSection,
    useCommentTree,
    type Comment,
    type CommentUser,
} from '@hasthiya_/headless-comments-react';

const demoUser: CommentUser = {
    id: 'headless-user',
    name: 'You',
    isVerified: true,
};

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
    // useCommentTree manages all state: add, reply, edit, delete, reactions
    const tree = useCommentTree({
        initialComments: seedComments,
        currentUser: demoUser,
    });

    return (
        <div className="space-y-4">
            <div>
                <CommentSection
                    tree={tree}
                    currentUser={demoUser}
                    showReactions
                    inputPlaceholder="Type here (headless mode)..."
                />
            </div>
        </div>
    );
}
