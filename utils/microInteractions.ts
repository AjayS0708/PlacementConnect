'use client';

import { Variants } from 'framer-motion';

/**
 * Advanced hover effects for cards and interactive elements
 */
export const hoverEffects = {
  // Lift effect with enhanced shadow
  lift: {
    rest: {
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  },

  // Glow effect
  glow: {
    rest: {
      boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
      transition: { duration: 0.3 },
    },
    hover: {
      boxShadow: '0 0 30px 0 rgba(59, 130, 246, 0.3)',
      transition: { duration: 0.3 },
    },
  },

  // Tilt effect (3D rotation)
  tilt: {
    rest: {
      rotateX: 0,
      rotateY: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },

  // Scale and brighten
  brighten: {
    rest: {
      scale: 1,
      filter: 'brightness(1)',
      transition: { duration: 0.3 },
    },
    hover: {
      scale: 1.05,
      filter: 'brightness(1.1)',
      transition: { duration: 0.3 },
    },
  },

  // Shimmer effect
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  // Border glow
  borderGlow: {
    rest: {
      borderColor: 'rgba(148, 163, 184, 0.2)',
      transition: { duration: 0.3 },
    },
    hover: {
      borderColor: 'rgba(59, 130, 246, 0.5)',
      transition: { duration: 0.3 },
    },
  },

  // Float animation
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Pulse
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Rotate on hover
  rotate: {
    rest: {
      rotate: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      rotate: 5,
      transition: { duration: 0.3 },
    },
  },

  // Slide and fade icon
  slideIcon: {
    rest: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    hover: {
      x: 5,
      opacity: 0.8,
      transition: { duration: 0.2 },
    },
  },
};

/**
 * Button interaction variants
 */
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeIn',
    },
  },
  loading: {
    opacity: 0.7,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Ripple effect for buttons
 */
export const rippleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: [0, 0.3, 0],
    scale: [0, 2, 2],
  },
};

/**
 * Icon animation variants
 */
export const iconAnimations = {
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  bounce: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  shake: {
    animate: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
  },
  heartbeat: {
    animate: {
      scale: [1, 1.3, 1, 1.3, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

/**
 * Page transition variants
 */
export const pageTransitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3 },
  },
};

/**
 * Tooltip animation
 */
export const tooltipVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 5,
  },
};
