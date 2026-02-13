'use client';

import React, { useMemo } from 'react';
import type { AvatarProps } from '@hasthiya_/headless-comments-react';
import { getDefaultAvatar, useCommentSection } from '@hasthiya_/headless-comments-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const ShadcnAvatar: React.FC<AvatarProps> = ({
  user,
  size = 'md',
  className = '',
  style = {},
  render,
}) => {
  const { theme } = useCommentSection();

  const initials = useMemo(() => {
    return user.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }, [user.name]);

  if (render) {
    return <>{render(user)}</>;
  }

  const sizeClasses = {
    sm: 'h-7 w-7 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-base',
  };

  const avatarUrl = user.avatarUrl || getDefaultAvatar(user.name);

  return (
    <Avatar
      className={cn(sizeClasses[size], className)}
      style={{ backgroundColor: theme.secondaryColor, ...style } as React.CSSProperties}
    >
      <AvatarImage src={avatarUrl} alt={`${user.name}'s avatar`} />
      <AvatarFallback className="font-semibold" style={{ backgroundColor: theme.secondaryColor }}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

ShadcnAvatar.displayName = 'ShadcnAvatar';

