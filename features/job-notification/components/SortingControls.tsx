'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { JobSortOption, getSortOptionLabel } from '@/features/job-notification/utils/jobFiltering';

interface SortingControlsProps {
  sortOption: JobSortOption;
  onSortChange: (option: JobSortOption) => void;
  className?: string;
}

const SORT_OPTIONS: JobSortOption[] = [
  'match-desc',
  'date-desc',
  'date-asc',
  'company-asc',
  'company-desc',
  'salary-desc',
  'salary-asc',
];

/**
 * SortingControls - Dropdown for selecting job sort order
 */
export function SortingControls({ sortOption, onSortChange, className }: SortingControlsProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <label className="text-sm font-medium text-slate-700">Sort by:</label>
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as JobSortOption)}
        className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all hover:border-slate-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {getSortOptionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * SortingControlsPills - Alternative pill-based sorting UI
 */
export function SortingControlsPills({ sortOption, onSortChange, className }: SortingControlsProps) {
  const quickSortOptions: JobSortOption[] = ['match-desc', 'date-desc', 'salary-desc'];

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Quick Sort</p>
      <div className="flex flex-wrap gap-2">
        {quickSortOptions.map((option) => {
          const isActive = sortOption === option;
          return (
            <motion.button
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSortChange(option)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                isActive
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              {getSortOptionLabel(option)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
