'use client';

import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  className?: string;
}

/**
 * PaginationControls - Pagination UI with page navigation and items per page selector
 */
export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  startIndex,
  endIndex,
  className,
}: PaginationControlsProps) {
  const itemsPerPageOptions = [5, 10, 20, 50];

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Items info and per-page selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-900">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalItems}</span> jobs
        </p>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="rounded-lg border-2 border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 focus:border-purple-500 focus:outline-none"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous button */}
          <motion.button
            whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
            whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all',
              currentPage === 1
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-slate-500">
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <motion.button
                key={pageNum}
                whileHover={{ scale: !isActive ? 1.05 : 1 }}
                whileTap={{ scale: !isActive ? 0.95 : 1 }}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all',
                  isActive
                    ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                {pageNum}
              </motion.button>
            );
          })}

          {/* Next button */}
          <motion.button
            whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
            whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all',
              currentPage === totalPages
                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            )}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      )}
    </div>
  );
}
