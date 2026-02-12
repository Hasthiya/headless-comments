/**
 * Avatar component for the Comment Section (default preset)
 * @module @comment-section/presets/default/Avatar
 */

'use client';

import React, { useMemo } from 'react';
import type { AvatarProps } from '../../headless/types';
import { getDefaultAvatar } from '../../core/utils';
import { useCommentSection } from '../../headless/useComments';

/**
 * Avatar component displays a user's profile picture or initials
 */
export const Avatar: React.FC<AvatarProps> = ({
    user,
    size = 'md',
    className = '',
    style = {},
    render,
}) => {
    const { theme } = useCommentSection();

    // Generate initials from name (must be before early return)
    const initials = useMemo(() => {
        return user.name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }, [user.name]);

    // Use custom render if provided
    if (render) {
        return <>{render(user)}</>;
    }

    // Size mapping
    const sizeMap = {
        sm: '28px',
        md: '36px',
        lg: '48px',
    };

    const avatarSize = sizeMap[size];
    const fontSize = size === 'sm' ? '10px' : size === 'md' ? '13px' : '16px';

    // Get avatar URL or generate default
    const avatarUrl = user.avatarUrl || getDefaultAvatar(user.name);

    const containerStyle: React.CSSProperties = {
        width: avatarSize,
        height: avatarSize,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: theme.secondaryColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 600,
        color: '#ffffff',
        ...style,
    };

    return (
        <div className={`cs-avatar ${className}`} style={containerStyle}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={`${user.name}'s avatar`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                    onError={(e) => {
                        // Fallback to initials on image load error
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            parent.innerText = initials;
                        }
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

Avatar.displayName = 'Avatar';

export default Avatar;
