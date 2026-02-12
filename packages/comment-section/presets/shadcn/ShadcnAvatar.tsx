/**
 * Avatar component for the Comment Section (default preset)
 * @module @comment-section/presets/default/Avatar
 */

'use client';

import React, { useMemo } from 'react';
import type { AvatarProps } from '../../headless/types';
import { getDefaultAvatar } from '../../core/utils';
import { useCommentSection } from '../../headless/useComments';
import { cn } from '../../core/utils';

/**
 * ShadcnAvatar component displays a user's profile picture or initials
 */
export const ShadcnAvatar: React.FC<AvatarProps> = ({
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

    // Size mapping for Tailwind classes
    const sizeClasses = {
        sm: "h-7 w-7 text-[10px]",
        md: "h-9 w-9 text-xs",
        lg: "h-12 w-12 text-base",
    };

    // Get avatar URL or generate default
    const avatarUrl = user.avatarUrl || getDefaultAvatar(user.name);

    return (
        <div
            className={cn(
                "relative flex shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center font-semibold text-primary-foreground",
                sizeClasses[size],
                className
            )}
            style={{ backgroundColor: theme.secondaryColor, ...style }}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={`${user.name}'s avatar`}
                    className="aspect-square h-full w-full object-cover"
                    onError={(e) => {
                        // Fallback to initials on image load error
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                            const span = document.createElement('span');
                            span.innerText = initials;
                            parent.appendChild(span);
                        }
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};

ShadcnAvatar.displayName = 'ShadcnAvatar';

export default ShadcnAvatar;
