'use client';

import React, { useMemo } from 'react';
import type { CommentSectionProps } from '../../headless/types';
import { CommentSectionProvider } from '../../headless/CommentProvider';
import { useCommentSection } from '../../headless/useComments';
import { mergeTheme, themeToCSSVariables } from '../../core/utils';
import { StyledCommentItem } from './StyledCommentItem';
import { StyledReplyForm } from './StyledReplyForm';

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function CommentSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="cs-skeleton-comment">
                    <div className="cs-skeleton cs-skeleton--circle cs-skeleton-comment__avatar" />
                    <div className="cs-skeleton-comment__body">
                        <div className="cs-skeleton cs-skeleton-comment__name" />
                        <div className="cs-skeleton cs-skeleton-comment__line cs-skeleton-comment__line--full" />
                        <div className="cs-skeleton cs-skeleton-comment__line cs-skeleton-comment__line--medium" />
                        <div className="cs-skeleton cs-skeleton-comment__line cs-skeleton-comment__line--short" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Sort Bar ─────────────────────────────────────────────────────────── */
function SortBar() {
    const { sortOrder, setSortOrder, texts } = useCommentSection();
    const options = [
        { value: 'newest' as const, label: texts.sortNewest },
        { value: 'oldest' as const, label: texts.sortOldest },
        { value: 'popular' as const, label: texts.sortTop },
    ];

    return (
        <div className="cs-sort-bar">
            <span className="cs-sort-bar__label">Sort by:</span>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    className={`cs-sort-btn${sortOrder === opt.value ? ' cs-sort-btn--active' : ''}`}
                    onClick={() => setSortOrder(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

/* ── Internal ─────────────────────────────────────────────────────────── */
interface InternalProps {
    readOnly?: boolean;
    showReactions?: boolean;
    showMoreOptions?: boolean;
    showVerifiedBadge?: boolean;
    maxCommentLines?: number;
    inputPlaceholder?: string;
    maxCharLimit?: number;
    showCharCount?: boolean;
    autoFocus?: boolean;
    maxDepth?: number;
    showSortBar?: boolean;
}

const StyledCommentSectionInternal: React.FC<InternalProps> = ({
    readOnly = false,
    showReactions = true,
    showMoreOptions = true,
    showVerifiedBadge = true,
    maxCommentLines,
    inputPlaceholder,
    maxCharLimit,
    showCharCount = false,
    autoFocus = false,
    maxDepth: propMaxDepth,
    showSortBar = true,
}) => {
    const {
        comments,
        currentUser,
        submitComment,
        isLoading,
        texts,
        maxDepth: contextMaxDepth,
    } = useCommentSection();

    const maxDepth = propMaxDepth ?? contextMaxDepth;

    return (
        <>
            {/* Sort Bar */}
            {showSortBar && comments.length > 1 && <SortBar />}

            {/* New Comment Form */}
            {!readOnly && currentUser && submitComment && (
                <StyledReplyForm
                    currentUser={currentUser}
                    onSubmit={(content) => submitComment(content)}
                    placeholder={inputPlaceholder}
                    maxCharLimit={maxCharLimit}
                    showCharCount={showCharCount}
                    autoFocus={autoFocus}
                />
            )}

            {/* Loading skeleton */}
            {isLoading && comments.length === 0 && <CommentSkeleton count={3} />}

            {/* Empty state */}
            {!isLoading && comments.length === 0 && (
                <div className="cs-empty">
                    <div className="cs-empty__icon">💬</div>
                    <p className="cs-empty__text">{texts.noComments}</p>
                </div>
            )}

            {/* Comments */}
            {comments.map((comment) => (
                <StyledCommentItem
                    key={comment.id}
                    comment={comment}
                    depth={0}
                    maxDepth={maxDepth}
                    readOnly={readOnly}
                    showReactions={showReactions}
                    showMoreOptions={showMoreOptions}
                    showVerifiedBadge={showVerifiedBadge}
                    maxCommentLines={maxCommentLines}
                />
            ))}
        </>
    );
};

/* ── Public Component ─────────────────────────────────────────────────── */
export interface StyledCommentSectionProps extends CommentSectionProps {
    /** Show sort bar (newest / oldest / top). Default: true */
    showSortBar?: boolean;
}

export const StyledCommentSection: React.FC<StyledCommentSectionProps> = (props) => {
    const { theme, showSortBar } = props;
    const mergedTheme = useMemo(() => mergeTheme(theme), [theme]);
    const cssVars = useMemo(
        () => themeToCSSVariables(mergedTheme) as React.CSSProperties,
        [mergedTheme]
    );

    return (
        <CommentSectionProvider
            initialComments={props.comments ?? []}
            currentUser={props.currentUser}
            tree={props.tree}
            availableReactions={props.availableReactions}
            texts={props.texts}
            theme={mergedTheme}
            locale={props.locale}
            maxDepth={props.maxDepth}
            readOnly={props.readOnly}
            generateId={props.generateId}
            sortOrder={props.sortOrder}
            onReport={props.onReport}
            includeDislike={props.includeDislike}
        >
            <div className="cs-root" style={cssVars}>
                <StyledCommentSectionInternal
                    readOnly={props.readOnly}
                    showReactions={props.showReactions}
                    showMoreOptions={props.showMoreOptions}
                    showVerifiedBadge={props.showVerifiedBadge}
                    maxCommentLines={props.maxCommentLines}
                    inputPlaceholder={props.inputPlaceholder}
                    maxCharLimit={props.maxCharLimit}
                    showCharCount={props.showCharCount}
                    autoFocus={props.autoFocus}
                    maxDepth={props.maxDepth}
                    showSortBar={showSortBar}
                />
            </div>
        </CommentSectionProvider>
    );
};

StyledCommentSection.displayName = 'StyledCommentSection';
