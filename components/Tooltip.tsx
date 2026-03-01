'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tooltipVariants } from '@/utils/microInteractions';
import { cn } from '@/utils/cn';

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => setIsVisible(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white shadow-lg',
              positionClasses[position],
              className
            )}
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15 }}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute h-2 w-2 rotate-45 bg-neutral-900',
                {
                  'top-full left-1/2 -translate-x-1/2 -mt-1': position === 'top',
                  'bottom-full left-1/2 -translate-x-1/2 -mb-1': position === 'bottom',
                  'top-1/2 -translate-y-1/2 left-full -ml-1': position === 'left',
                  'top-1/2 -translate-y-1/2 right-full -mr-1': position === 'right',
                }
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Badge component with pulse animation
 */
export function PulseBadge({
  children,
  variant = 'primary',
  className,
}: {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}) {
  const variantClasses = {
    primary: 'bg-blue-500 text-white',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
  };

  return (
    <motion.span
      className={cn(
        'relative inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
      {/* Pulse ring */}
      <motion.span
        className={cn(
          'absolute inset-0 rounded-full',
          variantClasses[variant].split(' ')[0]
        )}
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.span>
  );
}

/**
 * Count badge with animation
 */
export function CountBadge({
  count,
  max = 99,
  className,
}: {
  count: number;
  max?: number;
  className?: string;
}) {
  const displayCount = count > max ? `${max}+` : count;

  return (
    <motion.span
      className={cn(
        'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white',
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      key={count}
    >
      {displayCount}
    </motion.span>
  );
}

/**
 * Status indicator dot
 */
export function StatusDot({
  status = 'online',
  animated = true,
  className,
}: {
  status?: 'online' | 'offline' | 'busy' | 'away';
  animated?: boolean;
  className?: string;
}) {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-red-500',
    away: 'bg-amber-500',
  };

  return (
    <span className={cn('relative inline-flex', className)}>
      <motion.span
        className={cn('h-2 w-2 rounded-full', statusColors[status])}
        animate={
          animated
            ? {
                scale: [1, 1.2, 1],
              }
            : undefined
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {animated && status === 'online' && (
        <motion.span
          className={cn(
            'absolute inset-0 h-2 w-2 rounded-full',
            statusColors[status],
            'opacity-75'
          )}
          animate={{
            scale: [1, 2, 2],
            opacity: [0.75, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
    </span>
  );
}
