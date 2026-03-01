'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  color?: string;
}

/**
 * Animated hamburger menu button
 */
export function HamburgerMenu({
  isOpen,
  onClick,
  className,
  color = 'currentColor',
}: HamburgerMenuProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-slate-100',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="relative h-5 w-6">
        {/* Top line */}
        <motion.span
          className="absolute left-0 h-0.5 w-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            top: isOpen ? '50%' : '0%',
            rotate: isOpen ? 45 : 0,
            translateY: isOpen ? '-50%' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Middle line */}
        <motion.span
          className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            opacity: isOpen ? 0 : 1,
            scale: isOpen ? 0.8 : 1,
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        />

        {/* Bottom line */}
        <motion.span
          className="absolute bottom-0 left-0 h-0.5 w-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            bottom: isOpen ? '50%' : '0%',
            rotate: isOpen ? -45 : 0,
            translateY: isOpen ? '50%' : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </button>
  );
}

/**
 * Alternative animated menu icon (dots to X)
 */
export function MenuIconDots({
  isOpen,
  onClick,
  className,
}: {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-lg transition-colors hover:bg-slate-100',
        className
      )}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <motion.circle
          cx="5"
          cy="12"
          r="2"
          fill="currentColor"
          animate={{
            cx: isOpen ? 12 : 5,
            cy: isOpen ? 12 : 12,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="2"
          fill="currentColor"
          animate={{
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.circle
          cx="19"
          cy="12"
          r="2"
          fill="currentColor"
          animate={{
            cx: isOpen ? 12 : 19,
            cy: isOpen ? 12 : 12,
            scale: isOpen ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* X lines when open */}
        <motion.line
          x1="8"
          y1="8"
          x2="16"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
        />
        <motion.line
          x1="16"
          y1="8"
          x2="8"
          y2="16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
        />
      </svg>
    </button>
  );
}

/**
 * Floating action button for mobile
 */
export function FloatingActionButton({
  onClick,
  icon,
  label,
  className,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-elevation-3',
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}
