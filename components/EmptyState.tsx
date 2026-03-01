'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'filter' | 'error';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'from-slate-100 to-slate-200',
    iconColor: 'text-slate-400',
  },
  search: {
    iconBg: 'from-blue-100 to-indigo-100',
    iconColor: 'text-blue-500',
  },
  filter: {
    iconBg: 'from-purple-100 to-pink-100',
    iconColor: 'text-purple-500',
  },
  error: {
    iconBg: 'from-red-100 to-orange-100',
    iconColor: 'text-red-500',
  },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const styles = variantStyles[variant];

  const defaultIcon = (
    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn('flex min-h-[400px] items-center justify-center py-12', className)}
    >
      <div className="space-y-6 text-center max-w-md px-4">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="mx-auto flex h-24 w-24 items-center justify-center"
        >
          <div
            className={cn(
              'flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br shadow-lg',
              styles.iconBg
            )}
          >
            <div className={styles.iconColor}>{icon || defaultIcon}</div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm leading-relaxed text-slate-600">{description}</p>
          )}
        </motion.div>

        {/* Action Button */}
        {action && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={action.onClick}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
          >
            {action.label}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Preset empty states
export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      variant="search"
      icon={
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title="No results found"
      description={`We couldn't find any matches for "${query}". Try adjusting your search or filters.`}
    />
  );
}

export function FilterEmptyState() {
  return (
    <EmptyState
      variant="filter"
      icon={
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      }
      title="No matching items"
      description="Adjust your filters or clear them to see more results."
    />
  );
}

export function ErrorEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      variant="error"
      icon={
        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      }
      title="Something went wrong"
      description="We encountered an error loading your data. Please try again."
      action={onRetry ? { label: 'Try Again', onClick: onRetry } : undefined}
    />
  );
}
