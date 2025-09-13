import { useRef, useEffect } from 'react';

export type SwipeDirection = 'left' | 'right' | 'up' | 'down' | null;

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwiping?: (direction: SwipeDirection, distance: number) => void;
  threshold?: number;
}

export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  handlers: SwipeHandlers
): React.RefObject<T | null> {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwiping,
    threshold = 50,
  } = handlers;

  const elementRef = useRef<T>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipingRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let rafId: number;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      swipingRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - touchStartRef.current.x;
      const diffY = currentY - touchStartRef.current.y;

      // Cancel any pending animation frame
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!swipingRef.current) {
          swipingRef.current = true;
        }

        if (onSwiping) {
          const absX = Math.abs(diffX);
          const absY = Math.abs(diffY);
          
          if (absX > absY) {
            onSwiping(diffX > 0 ? 'right' : 'left', absX);
          } else {
            onSwiping(diffY > 0 ? 'down' : 'up', absY);
          }
        }
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - touchStartRef.current.x;
      const diffY = endY - touchStartRef.current.y;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      // Determine if it was a horizontal or vertical swipe
      if (absX > absY && absX > threshold) {
        // Horizontal swipe
        if (diffX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      } else if (absY > absX && absY > threshold) {
        // Vertical swipe
        if (diffY > 0) {
          onSwipeDown?.();
        } else {
          onSwipeUp?.();
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }

      touchStartRef.current = null;
      swipingRef.current = false;
      
      if (rafId) cancelAnimationFrame(rafId);
    };

    const handleTouchCancel = () => {
      touchStartRef.current = null;
      swipingRef.current = false;
      if (rafId) cancelAnimationFrame(rafId);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwiping, threshold]);

  return elementRef;
}