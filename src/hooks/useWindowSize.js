import { useState, useEffect } from 'react';

/**
 * Debounce utility function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Custom hook for window size with debounced resize handling
 * @param {number} delay - Debounce delay in milliseconds (default: 150ms)
 * @returns {{ width: number, height: number }} - Current window dimensions
 */
export function useWindowSize(delay = 150) {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }, delay);

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [delay]);

    return windowSize;
}
