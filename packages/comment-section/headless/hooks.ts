'use client';

/**
 * Utility hooks for the comment system
 * @module @headless-comments/react/hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { RefObject, KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { CommentTexts } from '../core/types';
import { formatRelativeTime } from '../core/utils';

/**
 * Hook for textarea auto-resize.
 * @param value - Current textarea value (triggers resize on change).
 * @param maxHeight - Max height in pixels (default 200).
 * @returns Ref to attach to the textarea element.
 */
export const useAutoResize = (value: string, maxHeight: number = 200): RefObject<HTMLTextAreaElement | null> => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }, [value, maxHeight]);

    return textareaRef;
};

/**
 * Hook for character count.
 * @param value - String to count.
 * @param maxLimit - Optional character limit (enables isOverLimit and remaining).
 * @returns Object with count, isOverLimit, and remaining (when maxLimit set).
 */
export const useCharacterCount = (
    value: string,
    maxLimit?: number
): { count: number; isOverLimit: boolean; remaining: number | undefined } => {
    const count = value.length;
    const isOverLimit = maxLimit !== undefined ? count > maxLimit : false;
    const remaining = maxLimit !== undefined ? maxLimit - count : undefined;

    return {
        count,
        isOverLimit,
        remaining,
    };
};

/**
 * Hook for click outside detection.
 * @param callback - Called when a click happens outside the ref element.
 * @param enabled - Whether the listener is active (default true).
 * @returns Ref to attach to the element that defines "inside".
 */
export const useClickOutside = <T extends HTMLElement>(
    callback: () => void,
    enabled: boolean = true
): RefObject<T | null> => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // Node for contains() check (EventTarget is not assignable to Node in strict typings).
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [callback, enabled]);

    return ref;
};

/**
 * Hook for Enter/Shift+Enter submit behavior in textarea.
 * Enter (no Shift) → submit; Shift+Enter → newline.
 *
 * @param onSubmit - Called when user submits via Enter.
 * @param disabled - When true, Enter does not submit.
 * @param options.submitOnEnter - If false, Enter inserts newline (default true).
 * @returns onKeyDown handler to attach to textarea.
 */
export const useEnterSubmit = (
    onSubmit: () => void,
    disabled: boolean,
    options: { submitOnEnter?: boolean } = {}
): (e: ReactKeyboardEvent<HTMLTextAreaElement>) => void => {
    const { submitOnEnter = true } = options;

    return useCallback(
        (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key !== 'Enter') return;
            if (e.shiftKey) return; // Shift+Enter = newline (default behavior)
            if (!submitOnEnter || disabled) return;

            e.preventDefault();
            onSubmit();
        },
        [onSubmit, disabled, submitOnEnter]
    );
};

/**
 * Hook for keyboard shortcuts.
 * @param key - Key to listen for (e.g. 'Enter', 'Escape').
 * @param callback - Called when key + modifiers match.
 * @param modifiers - Optional ctrl, shift, alt (all must match when specified).
 * @returns void (registers global keydown listener).
 */
export const useKeyboardShortcut = (
    key: string,
    callback: () => void,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
): void => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const ctrlMatch = modifiers.ctrl ? event.ctrlKey || event.metaKey : true;
            const shiftMatch = modifiers.shift ? event.shiftKey : true;
            const altMatch = modifiers.alt ? event.altKey : true;

            if (event.key === key && ctrlMatch && shiftMatch && altMatch) {
                event.preventDefault();
                callback();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [key, callback, modifiers]);
};

/**
 * Hook for local storage persistence.
 * Stored value is trusted (same app wrote it); parsed with JSON.parse and cast to T.
 * For untrusted storage, pass a validate function to narrow from unknown.
 *
 * @param key - localStorage key
 * @param initialValue - value when key is missing or parse fails
 * @param validate - optional guard to validate parsed value (e.g. (v: unknown) => v as T)
 * @returns [value, setValue]
 */
export const useLocalStorage = <T,>(
    key: string,
    initialValue: T,
    validate?: (value: unknown) => T
): [T, (value: T | ((prev: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            const parsed: unknown = JSON.parse(item);
            if (validate) return validate(parsed);
            return parsed as T;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
};

/**
 * Hook for debounced value.
 * @param value - Value to debounce.
 * @param delay - Delay in ms before updating.
 * @returns The debounced value (updates after delay).
 */
export const useDebouncedValue = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Hook for infinite scroll.
 * @param callback - Called when the sentinel enters viewport.
 * @param options.threshold - rootMargin in px (default 100).
 * @param options.enabled - Whether observer is active (default true).
 * @returns Ref to attach to the sentinel element.
 */
export const useInfiniteScroll = (
    callback: () => void,
    options: { threshold?: number; enabled?: boolean } = {}
): RefObject<HTMLDivElement | null> => {
    const { threshold = 100, enabled = true } = options;
    const targetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    callback();
                }
            },
            { rootMargin: `${threshold}px` }
        );

        const target = targetRef.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, [callback, threshold, enabled]);

    return targetRef;
};

/**
 * Hook for managing focus.
 * @returns Object with ref (attach to element), focus, and blur functions.
 */
export const useFocus = <T extends HTMLElement>(): {
    ref: RefObject<T | null>;
    focus: () => void;
    blur: () => void;
} => {
    const ref = useRef<T>(null);

    const focus = useCallback(() => {
        ref.current?.focus();
    }, []);

    const blur = useCallback(() => {
        ref.current?.blur();
    }, []);

    return { ref, focus, blur };
};

/**
 * Hook for relative time that auto-updates at interval.
 * @param date - Date or ISO string.
 * @param locale - Locale for formatting (currently used via texts).
 * @param texts - Required comment texts (e.g. "minutes ago").
 * @param intervalMs - Update interval in ms (default 60000).
 * @returns Formatted relative time string (e.g. "5m ago").
 */
export const useRelativeTime = (
    date: Date | string,
    locale: string,
    texts: Required<CommentTexts>,
    intervalMs: number = 60000
): string => {
    const [formatted, setFormatted] = useState(() =>
        formatRelativeTime(date, locale, texts)
    );

    useEffect(() => {
        setFormatted(formatRelativeTime(date, locale, texts));

        const id = setInterval(() => {
            setFormatted(formatRelativeTime(date, locale, texts));
        }, intervalMs);

        return () => clearInterval(id);
    }, [date, locale, texts, intervalMs]);

    return formatted;
};

/**
 * Hook for animation state.
 * @param duration - How long isAnimating stays true after trigger (default 200ms).
 * @returns Object with isAnimating and trigger function.
 */
export const useAnimationState = (duration: number = 200): {
    isAnimating: boolean;
    trigger: () => void;
} => {
    const [isAnimating, setIsAnimating] = useState(false);

    const trigger = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), duration);
    }, [duration]);

    return { isAnimating, trigger };
};
