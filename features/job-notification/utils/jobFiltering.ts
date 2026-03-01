import { Job } from '@/features/job-notification/data/jobs';

/**
 * Pagination utility for job listings
 */
export interface PaginationConfig {
  page: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startIndex: number;
    endIndex: number;
  };
}

/**
 * Paginate an array of items
 */
export function paginateItems<T>(
  items: T[],
  page: number = 1,
  itemsPerPage: number = 10
): PaginatedResult<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const paginatedItems = items.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    pagination: {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex,
      endIndex,
    },
  };
}

/**
 * Advanced sorting options for jobs
 */
export type JobSortOption =
  | 'match-desc' // Highest match score first
  | 'match-asc' // Lowest match score first
  | 'date-desc' // Newest first
  | 'date-asc' // Oldest first
  | 'company-asc' // Company name A-Z
  | 'company-desc' // Company name Z-A
  | 'salary-desc' // Highest salary first
  | 'salary-asc'; // Lowest salary first

export interface JobWithScore extends Job {
  matchScore: number;
}

/**
 * Sort jobs based on selected option
 */
export function sortJobs(jobs: JobWithScore[], sortOption: JobSortOption): JobWithScore[] {
  const sorted = [...jobs];
  
  switch (sortOption) {
    case 'match-desc':
      return sorted.sort((a, b) => b.matchScore - a.matchScore);
    
    case 'match-asc':
      return sorted.sort((a, b) => a.matchScore - b.matchScore);
    
    case 'date-desc':
      return sorted.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    
    case 'date-asc':
      return sorted.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    
    case 'company-asc':
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    
    case 'company-desc':
      return sorted.sort((a, b) => b.company.localeCompare(a.company));
    
    case 'salary-desc':
      return sorted.sort((a, b) => {
        const salaryA = parseSalary(a.salaryRange);
        const salaryB = parseSalary(b.salaryRange);
        return salaryB - salaryA;
      });
    
    case 'salary-asc':
      return sorted.sort((a, b) => {
        const salaryA = parseSalary(a.salaryRange);
        const salaryB = parseSalary(b.salaryRange);
        return salaryA - salaryB;
      });
    
    default:
      return sorted;
  }
}

/**
 * Parse salary string to numeric value for comparison
 */
function parseSalary(salary: string): number {
  // Extract numeric values from salary string
  const numbers = salary.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  // If range (e.g., "5-8 LPA"), take the average
  if (numbers.length === 2) {
    const min = parseInt(numbers[0]);
    const max = parseInt(numbers[1]);
    return (min + max) / 2;
  }
  
  // Single number
  return parseInt(numbers[0]);
}

/**
 * Get sort option label for display
 */
export function getSortOptionLabel(sortOption: JobSortOption): string {
  const labels: Record<JobSortOption, string> = {
    'match-desc': 'Best Match',
    'match-asc': 'Lowest Match',
    'date-desc': 'Newest First',
    'date-asc': 'Oldest First',
    'company-asc': 'Company (A-Z)',
    'company-desc': 'Company (Z-A)',
    'salary-desc': 'Highest Salary',
    'salary-asc': 'Lowest Salary',
  };
  
  return labels[sortOption];
}

/**
 * Get pagination settings from localStorage
 */
export function getPaginationSettings(): { itemsPerPage: number } {
  if (typeof window === 'undefined') return { itemsPerPage: 10 };
  
  const stored = localStorage.getItem('jobPaginationSettings');
  if (!stored) return { itemsPerPage: 10 };
  
  try {
    return JSON.parse(stored);
  } catch {
    return { itemsPerPage: 10 };
  }
}

/**
 * Save pagination settings to localStorage
 */
export function savePaginationSettings(itemsPerPage: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jobPaginationSettings', JSON.stringify({ itemsPerPage }));
}

/**
 * Get sort preference from localStorage
 */
export function getSortPreference(): JobSortOption {
  if (typeof window === 'undefined') return 'match-desc';
  
  const stored = localStorage.getItem('jobSortPreference');
  if (!stored) return 'match-desc';
  
  return stored as JobSortOption;
}

/**
 * Save sort preference to localStorage
 */
export function saveSortPreference(sortOption: JobSortOption): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jobSortPreference', sortOption);
}
