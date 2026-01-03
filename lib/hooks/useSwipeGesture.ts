// Swipe Gesture Detection Hook for Mobile Sidebar
import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
    onSwipeRight?: () => void;
    onSwipeLeft?: () => void;
    threshold?: number;
}

export function useSwipeGesture(options: SwipeGestureOptions) {
    const { onSwipeRight, onSwipeLeft, threshold = 50 } = options;
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const [isSwiping, setIsSwiping] = useState(false);

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            setIsSwiping(true);
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchEndX.current = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            setIsSwiping(false);
            const swipeDistance = touchEndX.current - touchStartX.current;

            if (Math.abs(swipeDistance) > threshold) {
                if (swipeDistance > 0 && onSwipeRight) {
                    // Swipe right
                    onSwipeRight();
                } else if (swipeDistance < 0 && onSwipeLeft) {
                    // Swipe left
                    onSwipeLeft();
                }
            }

            touchStartX.current = 0;
            touchEndX.current = 0;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipeRight, onSwipeLeft, threshold]);

    return { isSwiping };
}
