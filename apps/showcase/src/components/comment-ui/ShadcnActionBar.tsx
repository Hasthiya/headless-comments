'use client';

import React, { useState, useCallback } from 'react';
import type { ActionBarProps } from '@comment-section/react';
import type { Reaction } from '@comment-section/react';
import {
  useCommentSection,
  useClickOutside,
  getCommentPermalink,
  copyToClipboard,
} from '@comment-section/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MessageCircle, Share2, Flag, MoreHorizontal, Pencil, Trash2, Link2 } from 'lucide-react';
import { ShadcnReactionButton } from './ShadcnReactionButton';

export const ShadcnActionBar: React.FC<ActionBarProps & { className?: string }> = ({
  comment,
  currentUser: _currentUser,
  onReply,
  onReaction,
  onEdit,
  onDelete,
  availableReactions,
  showReactions = true,
  showMoreOptions = true,
  texts: customTexts,
  theme: _customTheme,
  disabled = false,
  isAuthor = false,
  className,
}) => {
  const context = useCommentSection();
  const texts = customTexts || context.texts;
  const reportComment = context.reportComment;
  const reactions = availableReactions || context.availableReactions;

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportThanks, setReportThanks] = useState(false);

  const reactionPickerRef = useClickOutside<HTMLDivElement>(
    () => setShowReactionPicker(false),
    showReactionPicker
  );

  const commentReactions: Reaction[] = reactions.map((config) => {
    const existingReaction = comment.reactions?.find((r) => r.id === config.id);
    return {
      id: config.id,
      label: config.label,
      emoji: config.emoji,
      count: existingReaction?.count || 0,
      isActive: existingReaction?.isActive || false,
    };
  });

  const primaryReaction = commentReactions[0];

  const handleReactionClick = (reactionId: string) => {
    if (!disabled) {
      onReaction?.(reactionId);
      setShowReactionPicker(false);
    }
  };

  const handleReport = useCallback(
    (reason: string) => {
      if (reportComment) {
        reportComment(comment.id, reason);
      }
      setReportThanks(true);
      setTimeout(() => setReportThanks(false), 3000);
    },
    [comment.id, reportComment]
  );

  const handleCopyLink = useCallback(async () => {
    await copyToClipboard(getCommentPermalink(comment.id));
  }, [comment.id]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    onDelete?.();
    setShowDeleteConfirm(false);
  }, [onDelete]);

  return (
    <div className={cn('flex flex-wrap items-center gap-1 mt-2', className)}>
      {showReactions && primaryReaction && (
        <ShadcnReactionButton
          reaction={primaryReaction}
          isActive={primaryReaction.isActive}
          onClick={() => handleReactionClick(primaryReaction.id)}
          showCount
          size="sm"
          disabled={disabled}
        />
      )}
      {showReactions && commentReactions.length > 1 && (
        <div className="relative" ref={reactionPickerRef}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-7 sm:w-7 text-muted-foreground"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            disabled={disabled}
            aria-label="More reactions"
          >
            <span className="text-base leading-none">😊</span>
          </Button>
          {showReactionPicker && (
            <div className={cn(
              'absolute left-0 z-50 flex gap-1 p-1 bg-popover text-popover-foreground rounded-md border shadow-md max-h-[50vh] overflow-auto flex-wrap',
              'top-full mt-2 sm:top-auto sm:mt-0 sm:bottom-full sm:mb-2'
            )}>
              {commentReactions.map((reaction) => (
                <ShadcnReactionButton
                  key={reaction.id}
                  reaction={reaction}
                  isActive={reaction.isActive}
                  onClick={() => handleReactionClick(reaction.id)}
                  showCount={false}
                  size="md"
                  disabled={disabled}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {onReply && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-[44px] py-2 sm:min-h-0 sm:h-7 sm:py-0 px-2 text-muted-foreground hover:text-foreground"
          onClick={onReply}
          disabled={disabled}
          aria-label={texts.reply}
        >
          <MessageCircle className="h-3.5 w-3.5 mr-1" />
          {texts.reply}
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-[44px] py-2 sm:min-h-0 sm:h-7 sm:py-0 px-2 text-muted-foreground hover:text-foreground"
        onClick={handleCopyLink}
        disabled={disabled}
        aria-label={texts.copyLink}
      >
        <Share2 className="h-3.5 w-3.5 mr-1" />
        {texts.copyLink}
      </Button>
      {showMoreOptions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-7 sm:w-7 text-muted-foreground"
              disabled={disabled}
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[10rem]">
            {isAuthor && onEdit && (
              <DropdownMenuItem onSelect={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                {texts.edit}
              </DropdownMenuItem>
            )}
            {isAuthor && onDelete && (
              <DropdownMenuItem
                onSelect={handleDeleteClick}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {texts.delete}
              </DropdownMenuItem>
            )}
            {(isAuthor && (onEdit || onDelete)) && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={handleCopyLink}>
              <Link2 className="mr-2 h-4 w-4" />
              {texts.copyLink}
            </DropdownMenuItem>
            {!isAuthor && reportComment && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Flag className="mr-2 h-4 w-4" />
                  {texts.report}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onSelect={() => handleReport('spam')}>
                    {texts.reportSpam}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleReport('harassment')}>
                    {texts.reportHarassment}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleReport('off-topic')}>
                    {texts.reportOffTopic}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleReport('other')}>
                    {texts.reportOther}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{texts.deleteConfirm}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{texts.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {texts.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {reportThanks && (
        <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground shadow-lg">
          {texts.reportThanks}
        </div>
      )}
    </div>
  );
};

ShadcnActionBar.displayName = 'ShadcnActionBar';
