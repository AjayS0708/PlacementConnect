'use client';

import { useRef, useEffect, TouchEvent } from 'react';

export interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface SwipeConfig {
  minDistance?: number;
  maxDuration?: number;
  preventDefaultTouchMove?: boolean;
}

/**
 * Hook to detect swipe gestures on touch devices
 */
export function useSwipe(
  callbacks: SwipeCallbacks,
  config: SwipeConfig = {}
) {
  const {
    minDistance = 50,
    maxDuration = 300,
    preventDefaultTouchMove = false,
  } = config;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchMove) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const duration = Date.now() - touchStart.current.time;

    if (duration > maxDuration) {
      touchStart.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Horizontal swipe
    if (absX > absY && absX > minDistance) {
      if (deltaX > 0) {
        callbacks.onSwipeRight?.();
      } else {
        callbacks.onSwipeLeft?.();
      }
    }
    // Vertical swipe
    else if (absY > absX && absY > minDistance) {
      if (deltaY > 0) {
        callbacks.onSwipeDown?.();
      } else {
        callbacks.onSwipeUp?.();
      }
    }

    touchStart.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Hook to detect long press gesture
 */
export function useLongPress(
  callback: () => void,
  duration: number = 500
) {
  const timeout = useRef<NodeJS.Timeout>();
  const prevented = useRef(false);

  const start = () => {
    prevented.current = false;
    timeout.current = setTimeout(() => {
      if (!prevented.current) {
        callback();
      }
    }, duration);
  };

  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  const prevent = () => {
    prevented.current = true;
    clear();
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onTouchMove: prevent,
  };
}

/**
 * Hook to detect double tap gesture
 */
export function useDoubleTap(
  callback: () => void,
  delay: number = 300
) {
  const lastTap = useRef<number>(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < delay) {
      callback();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  };

  return {
    onClick: handleTap,
    onTouchEnd: handleTap,
  };
}

/**
 * Hook to detect pinch gesture for zoom
 */
export function usePinch(
  onPinch: (scale: number) => void,
  onPinchEnd?: () => void
) {
  const initialDistance = useRef<number>(0);
  const currentDistance = useRef<number>(0);

  const getDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
      currentDistance.current = initialDistance.current;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      currentDistance.current = getDistance(e.touches);
      const scale = currentDistance.current / initialDistance.current;
      onPinch(scale);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistance.current = 0;
      currentDistance.current = 0;
      onPinchEnd?.();
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Hook to handle pull-to-refresh gesture
 */
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  threshold: number = 80
) {
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isRefreshing.current || window.scrollY > 0) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = currentY.current - startY.current;

    if (pullDistance > 0) {
      // Visual feedback can be added here
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing.current) return;

    const pullDistance = currentY.current - startY.current;

    if (pullDistance > threshold) {
      isRefreshing.current = true;
      await onRefresh();
      isRefreshing.current = false;
    }

    startY.current = 0;
    currentY.current = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}
