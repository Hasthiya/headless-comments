'use client';

import React, { useMemo } from 'react';
import type { CommentUser } from '../../core/types';
import { getDefaultAvatar } from '../../core/utils';

export interface StyledAvatarProps {
    user: CommentUser;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const StyledAvatar: React.FC<StyledAvatarProps> = ({
    user,
    size = 'md',
    className = '',
}) => {
    const initials = useMemo(() => {
        return user.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }, [user.name]);

    const avatarUrl = user.avatarUrl || getDefaultAvatar(user.name);
    const sizeClass = `cs-avatar--${size}`;

    const [imgError, setImgError] = React.useState(false);

    return (
        <span className={`cs-avatar ${sizeClass} ${className}`.trim()}>
            {!imgError ? (
                <img
                    className="cs-avatar__img"
                    src={avatarUrl}
                    alt={`${user.name}'s avatar`}
                    onError={() => setImgError(true)}
                />
            ) : (
                initials
            )}
        </span>
    );
};

StyledAvatar.displayName = 'StyledAvatar';
