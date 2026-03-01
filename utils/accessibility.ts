/**
 * Accessibility Utilities
 * 
 * Helper functions and hooks for improving accessibility across the application
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Generate a unique ID for accessibility attributes
 */
export function useId(prefix: string = 'id'): string {
  const [id] = useState(() => `${prefix}-${Math.random().toString(36).substr(2, 9)}`);
  return id;
}

/**
 * Hook to manage focus trap within a component
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook to handle keyboard navigation in a list
 */
export function useKeyboardNavigation(length: number) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : length - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(length - 1);
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  };

  return { activeIndex, setActiveIndex, handleKeyDown };
}

/**
 * Hook to restore focus when component unmounts
 */
export function useRestoreFocus() {
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    return () => {
      // Restore focus when component unmounts
      previouslyFocusedElement.current?.focus();
    };
  }, []);
}

/**
 * Hook to announce screen reader messages
 */
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!announcement) return;

    // Create or update live region
    let liveRegion = document.getElementById('sr-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = announcement;

    // Clear announcement after it's been read
    const timeout = setTimeout(() => {
      setAnnouncement('');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [announcement]);

  return { announce: setAnnouncement };
}

/**
 * Get ARIA label for form validation state
 */
export function getValidationAriaLabel(
  label: string,
  error?: string,
  required?: boolean
): string {
  let ariaLabel = label;
  if (required) ariaLabel += ' (required)';
  if (error) ariaLabel += `, Error: ${error}`;
  return ariaLabel;
}

/**
 * Visually hidden class for screen readers only
 */
export const srOnlyClass = 'sr-only';

/**
 * Focus visible class for keyboard navigation
 */
export const focusVisibleClass = 
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-shadow';

/**
 * Keyboard-accessible button props
 */
export function getAccessibleButtonProps(onClick: () => void, label: string) {
  return {
    onClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * High contrast mode detection
 */
export function useHighContrastMode(): boolean {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const checkHighContrast = () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-contrast: high)').matches;
    };

    setIsHighContrast(checkHighContrast());

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

/**
 * Announce route changes to screen readers
 */
export function announceRouteChange(pageName: string) {
  const announcement = `Navigated to ${pageName}`;
  const liveRegion = document.getElementById('sr-live-region');
  
  if (liveRegion) {
    liveRegion.textContent = announcement;
  }
}
