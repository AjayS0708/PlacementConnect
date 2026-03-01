'use client';

import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  overlay?: boolean;
}

const sizeClasses = {
  left: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    full: 'w-full',
  },
  right: {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96',
    full: 'w-full',
  },
  top: {
    sm: 'h-64',
    md: 'h-80',
    lg: 'h-96',
    full: 'h-full',
  },
  bottom: {
    sm: 'h-64',
    md: 'h-80',
    lg: 'h-96',
    full: 'h-full',
  },
};

const drawerVariants = {
  left: {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  },
  right: {
    hidden: { x: '100%' },
    visible: { x: 0 },
  },
  top: {
    hidden: { y: '-100%' },
    visible: { y: 0 },
  },
  bottom: {
    hidden: { y: '100%' },
    visible: { y: 0 },
  },
};

/**
 * Mobile-optimized drawer component with swipe gestures
 */
export function Drawer({
  isOpen,
  onClose,
  children,
  position = 'left',
  size = 'md',
  className,
  overlay = true,
}: DrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe to close gesture
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = 500;

    if (position === 'left' && (info.offset.x < -threshold || info.velocity.x < -velocity)) {
      onClose();
    } else if (position === 'right' && (info.offset.x > threshold || info.velocity.x > velocity)) {
      onClose();
    } else if (position === 'top' && (info.offset.y < -threshold || info.velocity.y < -velocity)) {
      onClose();
    } else if (position === 'bottom' && (info.offset.y > threshold || info.velocity.y > velocity)) {
      onClose();
    }
  };

  const isVertical = position === 'top' || position === 'bottom';
  const dragConstraint = isVertical ? 'y' : 'x';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {overlay && (
            <motion.div
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
          )}

          {/* Drawer */}
          <motion.div
            className={cn(
              'fixed z-[110] bg-white shadow-2xl',
              {
                'left-0 top-0 h-full': position === 'left',
                'right-0 top-0 h-full': position === 'right',
                'top-0 left-0 w-full': position === 'top',
                'bottom-0 left-0 w-full': position === 'bottom',
              },
              sizeClasses[position][size],
              className
            )}
            variants={drawerVariants[position]}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag={dragConstraint}
            dragConstraints={{ [dragConstraint]: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Mobile navigation drawer with standard layout
 */
export function MobileNavDrawer({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="left" size="md">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="text-lg font-bold text-slate-900">Menu</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            aria-label="Close drawer"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </Drawer>
  );
}

/**
 * Bottom sheet drawer (common on mobile)
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[]; // Reserved for future snap functionality
}) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="bottom" size="lg">
      <div className="flex flex-col">
        {/* Drag handle */}
        <div className="flex justify-center py-2">
          <div className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </Drawer>
  );
}
