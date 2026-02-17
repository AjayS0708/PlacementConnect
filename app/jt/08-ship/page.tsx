'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/Card'
import Button from '@/components/Button'

interface TestItem {
  id: string
  label: string
  tooltip: string
  checked: boolean
}

export default function ShipPage() {
  const [isLocked, setIsLocked] = useState(true)
  const [testsPassed, setTestsPassed] = useState(0)
  const [totalTests, setTotalTests] = useState(10)

  useEffect(() => {
    // Check test checklist status
    const checkTestStatus = () => {
      const saved = localStorage.getItem('test-checklist')
      if (saved) {
        try {
          const tests: TestItem[] = JSON.parse(saved)
          const passed = tests.filter(item => item.checked).length
          const total = tests.length
          
          setTestsPassed(passed)
          setTotalTests(total)
          setIsLocked(passed < total)
        } catch {
          setIsLocked(true)
        }
      } else {
        setIsLocked(true)
      }
    }

    checkTestStatus()
    
    // Re-check status when window gains focus (in case tests were updated in another tab)
    const handleFocus = () => checkTestStatus()
    window.addEventListener('focus', handleFocus)
    
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  if (isLocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-[600px]">
          <div className="text-center space-y-32">
            {/* Lock Icon */}
            <div className="flex justify-center">
              <div className="w-[80px] h-[80px] rounded-full bg-[#FEF3C7] flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#F59E0B]"
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-16">
              <h1 className="font-serif text-heading-lg font-bold text-primary">
                Ship Route Locked
              </h1>
              <p className="text-body text-secondary max-w-[400px] mx-auto">
                Complete all test checklist items before accessing the ship page.
                This ensures quality and prevents shipping untested code.
              </p>
            </div>

            {/* Test Status */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-24">
              <div className="space-y-12">
                <div className="text-heading-sm font-semibold text-primary">
                  Tests Passed: {testsPassed} / {totalTests}
                </div>
                <div className="text-[14px] text-secondary">
                  {totalTests - testsPassed} test{totalTests - testsPassed !== 1 ? 's' : ''} remaining
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link href="/jt/07-test">
              <Button variant="primary" fullWidth>
                Go to Test Checklist
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-32">
      {/* Header */}
      <div>
        <h1 className="font-serif text-heading-lg font-bold text-primary mb-16">
          Ready to Ship
        </h1>
        <p className="text-body text-secondary">
          All tests have passed. Your application is ready for production.
        </p>
      </div>

      {/* Success Card */}
      <Card>
        <div className="space-y-32">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-[80px] h-[80px] rounded-full bg-[#D1FAE5] flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#10B981]"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-16">
            <h2 className="font-serif text-heading-md font-bold text-primary">
              All Tests Passed
            </h2>
            <p className="text-body text-secondary max-w-[500px] mx-auto">
              Congratulations! All {totalTests} test checklist items have been completed.
              Your Job Notification Tracker is ready to ship to production.
            </p>
          </div>

          {/* Test Summary */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-24">
            <div className="grid grid-cols-3 gap-24 text-center">
              <div>
                <div className="text-heading-sm font-bold text-[#10B981]">
                  {totalTests}
                </div>
                <div className="text-[13px] text-secondary mt-4">
                  Tests Passed
                </div>
              </div>
              <div>
                <div className="text-heading-sm font-bold text-primary">
                  0
                </div>
                <div className="text-[13px] text-secondary mt-4">
                  Tests Failed
                </div>
              </div>
              <div>
                <div className="text-heading-sm font-bold text-accent">
                  100%
                </div>
                <div className="text-[13px] text-secondary mt-4">
                  Success Rate
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-16 justify-center">
            <Link href="/jt/07-test">
              <Button variant="secondary">
                Review Tests
              </Button>
            </Link>
            <Button 
              variant="primary"
              onClick={() => {
                alert('🚀 Ship process would begin here!\n\nIn production, this would trigger your deployment pipeline.')
              }}
            >
              Ship to Production
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
