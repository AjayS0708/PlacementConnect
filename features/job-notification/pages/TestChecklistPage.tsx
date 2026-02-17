'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface TestItem {
  id: string
  label: string
  tooltip: string
  checked: boolean
}

const TEST_ITEMS: Omit<TestItem, 'checked'>[] = [
  {
    id: 'test-1',
    label: 'Preferences persist after refresh',
    tooltip: 'Change settings, refresh the page, and verify they remain the same'
  },
  {
    id: 'test-2',
    label: 'Match score calculates correctly',
    tooltip: 'Check that job match scores reflect your preferences accurately'
  },
  {
    id: 'test-3',
    label: '"Show only matches" toggle works',
    tooltip: 'Toggle the filter and verify only matching jobs are displayed'
  },
  {
    id: 'test-4',
    label: 'Save job persists after refresh',
    tooltip: 'Save a job, refresh the page, and confirm it appears in saved jobs'
  },
  {
    id: 'test-5',
    label: 'Apply opens in new tab',
    tooltip: 'Click apply button and verify it opens the job link in a new tab'
  },
  {
    id: 'test-6',
    label: 'Status update persists after refresh',
    tooltip: 'Update a job status, refresh, and confirm the status is preserved'
  },
  {
    id: 'test-7',
    label: 'Status filter works correctly',
    tooltip: 'Filter by different statuses and verify correct jobs are shown'
  },
  {
    id: 'test-8',
    label: 'Digest generates top 10 by score',
    tooltip: 'Check that the digest page displays the top 10 jobs by match score'
  },
  {
    id: 'test-9',
    label: 'Digest persists for the day',
    tooltip: 'Verify the digest remains consistent throughout the day'
  },
  {
    id: 'test-10',
    label: 'No console errors on main pages',
    tooltip: 'Open browser console and navigate through main pages checking for errors'
  }
]

export default function TestChecklistPage() {
  const [testItems, setTestItems] = useState<TestItem[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    // Load test status from localStorage
    const saved = localStorage.getItem('test-checklist')
    if (saved) {
      try {
        setTestItems(JSON.parse(saved))
      } catch {
        initializeTests()
      }
    } else {
      initializeTests()
    }
  }, [])

  const initializeTests = () => {
    const items = TEST_ITEMS.map(item => ({ ...item, checked: false }))
    setTestItems(items)
    localStorage.setItem('test-checklist', JSON.stringify(items))
  }

  const handleCheckboxChange = (id: string) => {
    const updated = testItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    )
    setTestItems(updated)
    localStorage.setItem('test-checklist', JSON.stringify(updated))
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all test statuses?')) {
      initializeTests()
    }
  }

  const passedCount = testItems.filter(item => item.checked).length
  const totalCount = testItems.length
  const allTestsPassed = passedCount === totalCount

  return (
    <div className="space-y-32">
      {/* Header */}
      <div>
        <h1 className="font-serif text-heading-lg font-bold text-primary mb-16">
          Test Checklist
        </h1>
        <p className="text-body text-secondary">
          Complete all tests before shipping to production
        </p>
      </div>

      {/* Test Summary */}
      <Card>
        <div className="space-y-24">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-heading-sm font-semibold text-primary">
              Test Results
            </h2>
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              Reset Test Status
            </Button>
          </div>

          <div className="space-y-16">
            <div className="text-heading-md font-bold text-primary">
              Tests Passed: {passedCount} / {totalCount}
            </div>

            {!allTestsPassed && (
              <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg px-16 py-12">
                <div className="flex items-start gap-12">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-[#F59E0B] flex-shrink-0 mt-2"
                  >
                    <path
                      d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                  <p className="text-[14px] text-[#92400E] font-medium">
                    Resolve all issues before shipping.
                  </p>
                </div>
              </div>
            )}

            {allTestsPassed && (
              <div className="bg-[#D1FAE5] border border-[#10B981] rounded-lg px-16 py-12">
                <div className="flex items-start gap-12">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-[#10B981] flex-shrink-0 mt-2"
                  >
                    <path
                      d="M16.5 6L7.5 15L3.5 11"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </svg>
                  <p className="text-[14px] text-[#065F46] font-medium">
                    All tests passed! Ready to ship.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Test Checklist */}
      <Card>
        <div className="space-y-24">
          <h2 className="font-sans text-heading-sm font-semibold text-primary">
            Test Items
          </h2>

          <div className="space-y-16">
            {testItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start gap-16 p-16 rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="flex-1 flex items-start gap-16">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                    className="mt-4 w-20 h-20 border-2 border-[#D1D5DB] rounded checked:bg-accent checked:border-accent cursor-pointer"
                  />
                  <label
                    htmlFor={item.id}
                    className="flex-1 cursor-pointer select-none"
                  >
                    <span className={`text-body ${item.checked ? 'text-secondary line-through' : 'text-primary'}`}>
                      {item.label}
                    </span>
                  </label>
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(item.id)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="text-[#9CA3AF] hover:text-primary transition-colors"
                    aria-label="How to test"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="10" cy="10" r="9" />
                      <path d="M10 14V10M10 6H10.01" strokeLinecap="square" />
                    </svg>
                  </button>
                  {showTooltip === item.id && (
                    <div className="absolute right-0 top-full mt-8 w-[280px] z-10">
                      <div className="bg-[#1F2937] text-white text-[13px] px-12 py-8 rounded-lg shadow-lg">
                        {item.tooltip}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
