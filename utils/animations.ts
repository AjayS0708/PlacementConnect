import { Variants, Transition } from 'framer-motion'

/**
 * Reusable Framer Motion animation variants for PlacementConnect
 * Following spring physics and Material Design motion principles
 */

// Easing functions (as tuples for proper typing)
export const easings = {
  standard: [0.4, 0, 0.2, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
}

// Standard transitions
export const transitions = {
  fast: {
    duration: 0.1,
    ease: easings.standard,
  },
  standard: {
    duration: 0.2,
    ease: easings.standard,
  },
  slow: {
    duration: 0.4,
    ease: easings.standard,
  },
  spring: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
  } as Transition,
  springGentle: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  } as Transition,
}

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.standard },
  exit: { opacity: 0, transition: transitions.fast },
}

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: transitions.slow },
  exit: { opacity: 0, y: -16, transition: transitions.fast },
}

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: transitions.slow },
  exit: { opacity: 0, y: 16, transition: transitions.fast },
}

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: transitions.standard },
  exit: { opacity: 0, x: 16, transition: transitions.fast },
}

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0, transition: transitions.standard },
  exit: { opacity: 0, x: -16, transition: transitions.fast },
}

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.standard },
  exit: { opacity: 0, scale: 0.95, transition: transitions.fast },
}

export const scaleInSpring: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.9, transition: transitions.fast },
}

// Slide animations
export const slideInUp: Variants = {
  initial: { y: '100%' },
  animate: { y: 0, transition: transitions.slow },
  exit: { y: '100%', transition: transitions.standard },
}

export const slideInDown: Variants = {
  initial: { y: '-100%' },
  animate: { y: 0, transition: transitions.slow },
  exit: { y: '-100%', transition: transitions.standard },
}

export const slideInLeft: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: transitions.slow },
  exit: { x: '-100%', transition: transitions.standard },
}

export const slideInRight: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: transitions.slow },
  exit: { x: '100%', transition: transitions.standard },
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.standard },
  exit: { opacity: 0, y: -8, transition: transitions.fast },
}

// Interactive button animations
export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
}

export const buttonHover = {
  scale: 1.02,
  y: -2,
  transition: { duration: 0.2, ease: easings.standard },
}

// Card animations
export const cardHover = {
  y: -4,
  scale: 1.01,
  transition: { duration: 0.2, ease: easings.standard },
}

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
}

// Modal/Dialog animations
export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, type: 'spring', stiffness: 500, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
}

// Toast/Notification animations
export const toastSlideIn: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0, transition: transitions.springGentle },
  exit: { opacity: 0, x: '100%', transition: transitions.standard },
}

// Progress animations
export const progressBar: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: (width: number) => ({
    scaleX: width / 100,
    transition: { duration: 0.5, ease: easings.decelerate },
  }),
}

// Checkmark animation
export const checkmark = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: easings.standard },
  },
}

// Loading spinner
export const spinner = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

// Pulse animation (for attention)
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Glow animation
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 8px rgba(99, 102, 241, 0.3)',
      '0 0 24px rgba(99, 102, 241, 0.6)',
      '0 0 8px rgba(99, 102, 241, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easings.standard },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: easings.standard },
  },
}

/**
 * Utility function to create custom stagger animations
 */
export function createStagger(staggerDelay: number = 0.05, delayChildren: number = 0.1) {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  }
}

/**
 * Utility to wrap component with animation
 */
export const withAnimation = (variants: Variants) => ({
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants,
})
