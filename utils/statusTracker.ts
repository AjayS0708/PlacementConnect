export type JobStatus = 'Not Applied' | 'Applied' | 'Rejected' | 'Selected'

export interface StatusUpdate {
  jobId: string
  status: JobStatus
  timestamp: number
}

const STATUS_KEY = 'jobTrackerStatus'
const HISTORY_KEY = 'jobStatusHistory'
const MAX_HISTORY = 50

export const statusColors = {
  'Not Applied': 'bg-[#9CA3AF] text-white border-[#6B7280]',
  'Applied': 'bg-[#3B82F6] text-white border-[#2563EB]',
  'Rejected': 'bg-[#EF4444] text-white border-[#DC2626]',
  'Selected': 'bg-[#10B981] text-white border-[#059669]',
}

export const statusBadgeColors = {
  'Not Applied': 'bg-[#9CA3AF]',
  'Applied': 'bg-[#3B82F6]',
  'Rejected': 'bg-[#EF4444]',
  'Selected': 'bg-[#10B981]',
}

/**
 * Get status for a specific job
 */
export function getJobStatus(jobId: string): JobStatus {
  if (typeof window === 'undefined') return 'Not Applied'
  
  try {
    const statuses = JSON.parse(localStorage.getItem(STATUS_KEY) || '{}')
    return statuses[jobId] || 'Not Applied'
  } catch {
    return 'Not Applied'
  }
}

/**
 * Set status for a specific job
 */
export function setJobStatus(jobId: string, status: JobStatus): void {
  if (typeof window === 'undefined') return
  
  try {
    // Update status
    const statuses = JSON.parse(localStorage.getItem(STATUS_KEY) || '{}')
    statuses[jobId] = status
    localStorage.setItem(STATUS_KEY, JSON.stringify(statuses))
    
    // Add to history
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
    history.unshift({
      jobId,
      status,
      timestamp: Date.now(),
    })
    
    // Keep only last MAX_HISTORY updates
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Error setting job status:', error)
  }
}

/**
 * Get all job statuses
 */
export function getAllJobStatuses(): Record<string, JobStatus> {
  if (typeof window === 'undefined') return {}
  
  try {
    return JSON.parse(localStorage.getItem(STATUS_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * Get status history (most recent first)
 */
export function getStatusHistory(): StatusUpdate[] {
  if (typeof window === 'undefined') return []
  
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Clear all status data
 */
export function clearAllStatuses(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(STATUS_KEY)
  localStorage.removeItem(HISTORY_KEY)
}
