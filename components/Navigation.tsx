'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

interface NavLink {
  href: string
  label: string
  requiresTests?: boolean
}

const navLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/saved', label: 'Saved' },
  { href: '/digest', label: 'Digest' },
  { href: '/settings', label: 'Settings' },
  { href: '/jt/09-proof', label: 'Proof' },
  { href: '/jt/07-test', label: 'Test' },
  { href: '/jt/08-ship', label: 'Ship', requiresTests: true },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isShipLocked, setIsShipLocked] = useState(true)

  useEffect(() => {
    const checkTestStatus = () => {
      try {
        const saved = localStorage.getItem('test-checklist')
        if (saved) {
          const tests = JSON.parse(saved)
          const allPassed = tests.every((item: { checked: boolean }) => item.checked)
          setIsShipLocked(!allPassed)
        } else {
          setIsShipLocked(true)
        }
      } catch {
        setIsShipLocked(true)
      }
    }

    checkTestStatus()

    // Re-check when window gains focus (e.g., returning from test page)
    window.addEventListener('focus', checkTestStatus)
    window.addEventListener('storage', checkTestStatus)

    return () => {
      window.removeEventListener('focus', checkTestStatus)
      window.removeEventListener('storage', checkTestStatus)
    }
  }, [])

  return (
    <nav className="border-b border-[#E5E7EB] bg-white">
      <div className="max-w-[1440px] mx-auto px-40 py-24">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          <Link 
            href="/" 
            className="font-serif text-[36px] font-bold tracking-tight text-primary hover:text-accent transition-all duration-200"
          >
            KodNest
          </Link>
          <div className="flex items-center gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              const isLocked = link.requiresTests && isShipLocked
              
              if (isLocked) {
                return (
                  <div
                    key={link.href}
                    className="relative group"
                  >
                    <div
                      className={clsx(
                        'font-sans text-[15px] font-medium transition-all duration-200 px-24 py-12 rounded-lg text-center w-[120px] cursor-not-allowed',
                        'text-[#9CA3AF] bg-[#F3F4F6] opacity-60'
                      )}
                    >
                      <div className="flex items-center justify-center gap-6">
                        {link.label}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-8 w-[200px] bg-[#1F2937] text-white text-[13px] px-12 py-8 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Complete all tests to unlock
                    </div>
                  </div>
                )
              }
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'font-sans text-[15px] font-medium transition-all duration-200 px-24 py-12 rounded-lg text-center w-[120px]',
                    {
                      'text-white bg-accent shadow-sm': isActive,
                      'text-[#374151] hover:bg-[#F3F4F6] hover:text-primary': !isActive,
                    }
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="font-serif text-heading-sm text-primary"
            >
              KodNest
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-8 text-primary"
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="pt-24 pb-8 space-y-16">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                const isLocked = link.requiresTests && isShipLocked
                
                if (isLocked) {
                  return (
                    <div
                      key={link.href}
                      className="flex items-center justify-between py-8 opacity-60"
                    >
                      <span className="font-sans text-body-base font-medium text-[#9CA3AF] cursor-not-allowed">
                        {link.label}
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-[#9CA3AF]"
                      >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" />
                      </svg>
                    </div>
                  )
                }
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'block font-sans text-body-base font-medium py-8',
                      {
                        'text-accent': isActive,
                        'text-primary': !isActive,
                      }
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
