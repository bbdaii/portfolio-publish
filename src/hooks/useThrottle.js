import { useRef, useEffect, useCallback } from 'react';

/**
 * Throttle utility function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The minimum time between function calls in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Custom hook for throttled callback
 * @param {Function} callback - The callback to throttle
 * @param {number} delay - The throttle delay in milliseconds
 * @returns {Function} - The throttled callback
 */
export function useThrottle(callback, delay) {
    const throttledCallback = useRef(throttle(callback, delay));

    useEffect(() => {
        throttledCallback.current = throttle(callback, delay);
    }, [callback, delay]);

    return useCallback((...args) => {
        throttledCallback.current(...args);
    }, []);
}
