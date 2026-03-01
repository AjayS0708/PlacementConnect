'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface FilterPill {
  id: string;
  label: string;
  value: string;
  category: string;
}

interface FilterPillGroupProps {
  filters: FilterPill[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * FilterPillGroup - Displays active filters as animated pills with remove buttons
 */
export function FilterPillGroup({ filters, onRemove, onClearAll, className }: FilterPillGroupProps) {
  if (filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      <span className="text-sm font-medium text-slate-600">Active Filters:</span>
      
      <AnimatePresence mode="popLayout">
        {filters.map((filter) => (
          <motion.div
            key={filter.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200"
          >
            <span className="text-xs text-blue-600/70">{filter.category}:</span>
            <span>{filter.label}</span>
            <button
              onClick={() => onRemove(filter.id)}
              className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-blue-200"
              aria-label={`Remove ${filter.label} filter`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {filters.length > 1 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearAll}
          className="text-sm font-medium text-red-600 underline-offset-2 hover:underline"
        >
          Clear All
        </motion.button>
      )}
    </motion.div>
  );
}

interface MultiSelectFilterProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (selected: T[]) => void;
  className?: string;
  icon?: ReactNode;
}

/**
 * MultiSelectFilter - Dropdown with checkbox options for multi-selection
 */
export function MultiSelectFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
  className,
  icon,
}: MultiSelectFilterProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleOption = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const selectedCount = selected.length;

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg border-2 bg-white px-4 py-2.5 text-sm font-medium transition-all',
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-100'
            : 'border-slate-200 hover:border-slate-300',
          selectedCount > 0 && 'border-blue-300 bg-blue-50'
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className={cn('text-slate-700', selectedCount > 0 && 'text-blue-700')}>
            {label}
          </span>
          {selectedCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
              {selectedCount}
            </span>
          )}
        </div>
        <svg
          className={cn('h-4 w-4 text-slate-500 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-xl"
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.value)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className={cn('font-medium', isSelected ? 'text-blue-700' : 'text-slate-700')}>
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
            
            {selectedCount > 0 && (
              <div className="border-t border-slate-200 p-2">
                <button
                  onClick={() => onChange([])}
                  className="w-full rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Hook imports
import { useState, useEffect, useRef } from 'react';
