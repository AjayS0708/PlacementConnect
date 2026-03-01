'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const variantClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-accent-200 border-t-accent-600',
  white: 'border-white/20 border-t-white',
};

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        className={cn(
          'rounded-full',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
      {label && (
        <motion.p
          className="text-sm text-neutral-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'white';
}

export function LoadingOverlay({
  isLoading,
  children,
  label = 'Loading...',
  variant = 'primary',
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LoadingSpinner size="lg" variant={variant} label={label} />
        </motion.div>
      )}
    </div>
  );
}

// Pulse loader for inline loading states
export function PulseLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
