'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface CommentSectionErrorBoundaryProps {
    children: ReactNode;
    /** Rendered when an error is caught (receives error and reset callback) */
    fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
    error: Error | null;
}

/**
 * Minimal error boundary for the comment section subtree.
 * Catches errors in children and renders fallback (or a default message).
 * Wrap your comment section with it to avoid full-page crashes.
 *
 * @example
 * <CommentSectionErrorBoundary fallback={(err, reset) => (
 *   <div>
 *     <p>Something went wrong: {err.message}</p>
 *     <button type="button" onClick={reset}>Try again</button>
 *   </div>
 * )}>
 *   <CommentSectionProvider tree={tree}>...</CommentSectionProvider>
 * </CommentSectionErrorBoundary>
 */
export class CommentSectionErrorBoundary extends Component<CommentSectionErrorBoundaryProps, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        if (typeof console !== 'undefined' && console.error) {
            console.error('CommentSectionErrorBoundary caught an error:', error, errorInfo);
        }
    }

    reset = (): void => {
        this.setState({ error: null });
    };

    render(): ReactNode {
        const { error } = this.state;
        const { children, fallback } = this.props;

        if (error) {
            if (fallback) {
                return fallback(error, this.reset);
            }
            return (
                <div role="alert" className="headless-comment-error">
                    <p>Something went wrong loading comments.</p>
                    <button type="button" onClick={this.reset}>
                        Try again
                    </button>
                </div>
            );
        }

        return children;
    }
}
