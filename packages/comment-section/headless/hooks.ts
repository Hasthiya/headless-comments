'use client';

/**
 * Utility hooks for the comment system
 * @module @comment-section/react/hooks
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for textarea auto-resize
 */
export const useAutoResize = (value: string, maxHeight: number = 200) => {
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
 * Hook for character count
 */
export const useCharacterCount = (value: string, maxLimit?: number) => {
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
 * Hook for click outside detection
 */
export const useClickOutside = <T extends HTMLElement>(
    callback: () => void,
    enabled: boolean = true
) => {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
 * Hook for keyboard shortcuts
 */
export const useKeyboardShortcut = (
    key: string,
    callback: () => void,
    modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) => {
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
 * Hook for local storage persistence
 */
export const useLocalStorage = <T,>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
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
 * Hook for debounced value
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
 * Hook for infinite scroll
 */
export const useInfiniteScroll = (
    callback: () => void,
    options: { threshold?: number; enabled?: boolean } = {}
) => {
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
 * Hook for managing focus
 */
export const useFocus = <T extends HTMLElement>() => {
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
 * Hook for animation state
 */
export const useAnimationState = (duration: number = 200) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const trigger = useCallback(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), duration);
    }, [duration]);

    return { isAnimating, trigger };
};
