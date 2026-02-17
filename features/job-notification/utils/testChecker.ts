/**
 * Test Checklist Utilities
 * 
 * Provides centralized functions for checking test status and managing the ship lock.
 */

export interface TestItem {
  id: string
  label: string
  tooltip: string
  checked: boolean
}

const STORAGE_KEY = 'test-checklist'

/**
 * Check if all tests have passed
 * @returns true if all test items are checked, false otherwise
 */
export function areAllTestsPassed(): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return false
    
    const tests: TestItem[] = JSON.parse(saved)
    return tests.every(item => item.checked)
  } catch {
    return false
  }
}

/**
 * Get the current test status
 * @returns Object containing passed count, total count, and whether all passed
 */
export function getTestStatus(): { passed: number; total: number; allPassed: boolean } {
  if (typeof window === 'undefined') {
    return { passed: 0, total: 10, allPassed: false }
  }
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      return { passed: 0, total: 10, allPassed: false }
    }
    
    const tests: TestItem[] = JSON.parse(saved)
    const passed = tests.filter(item => item.checked).length
    const total = tests.length
    
    return {
      passed,
      total,
      allPassed: passed === total
    }
  } catch {
    return { passed: 0, total: 10, allPassed: false }
  }
}

/**
 * Check if the ship route should be locked
 * @returns true if ship should be locked, false if accessible
 */
export function isShipLocked(): boolean {
  return !areAllTestsPassed()
}

/**
 * Subscribe to test status changes
 * @param callback Function to call when test status changes
 * @returns Cleanup function to remove listeners
 */
export function subscribeToTestStatus(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleChange = () => {
    callback()
  }

  window.addEventListener('storage', handleChange)
  window.addEventListener('focus', handleChange)

  return () => {
    window.removeEventListener('storage', handleChange)
    window.removeEventListener('focus', handleChange)
  }
}
