'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
    },
    wave: {
      backgroundPosition: ['-200% 0', '200% 0'],
    },
    none: {},
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      animate={animationVariants[animation]}
      transition={{
        duration: animation === 'pulse' ? 1.5 : 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

// Preset skeleton patterns
export function SkeletonCard() {
  return (
    <div className="p-6 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton width="70%" height={24} />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton variant="circular" width={40} height={40} />
      </div>
      <Skeleton width="100%" height={80} />
      <div className="flex gap-2">
        <Skeleton width={100} height={32} className="rounded-full" />
        <Skeleton width={100} height={32} className="rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonJobCard() {
  return (
    <div className="p-6 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={16} />
        </div>
        <Skeleton width={80} height={32} className="rounded-full" />
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
        <Skeleton width="75%" height={16} />
      </div>
      
      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        <Skeleton width={80} height={24} className="rounded-full" />
        <Skeleton width={100} height={24} className="rounded-full" />
        <Skeleton width={90} height={24} className="rounded-full" />
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-700/50">
        <Skeleton width={120} height={20} />
        <Skeleton width={100} height={36} className="rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="p-6 bg-neutral-800/50 rounded-xl border border-neutral-700/50 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width={80} height={20} />
        <Skeleton variant="circular" width={36} height={36} />
      </div>
      <Skeleton width={120} height={40} />
      <Skeleton width="60%" height={16} />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
