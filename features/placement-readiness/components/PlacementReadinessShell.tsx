'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { getProjectStatusState } from '@/features/placement-readiness/lib/prpStatus'
import { PRP_STATUS_EVENT } from '@/features/placement-readiness/lib/testChecklist'

const navItems = [
  { href: '/placement-readiness', label: 'Dashboard' },
  { href: '/placement-readiness/practice', label: 'Practice' },
  { href: '/placement-readiness/assessments', label: 'Assessments' },
  { href: '/placement-readiness/resources', label: 'Resources' },
  { href: '/placement-readiness/profile', label: 'Profile' },
]

type PlacementReadinessShellProps = {
  children: React.ReactNode
}

export default function PlacementReadinessShell({ children }: PlacementReadinessShellProps) {
  const pathname = usePathname()
  const [statusTick, setStatusTick] = useState(0)
  const status = getProjectStatusState()

  useEffect(() => {
    const handler = () => setStatusTick((prev) => prev + 1)
    window.addEventListener(PRP_STATUS_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(PRP_STATUS_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  void statusTick

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-white/80 p-6 shadow-[0_14px_30px_-22px_rgba(10,20,50,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/60">Placement Readiness</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-primary">
              Track prep progress and performance signals
            </h2>
          </div>
          <span
            className={clsx(
              'rounded-full px-4 py-1.5 text-xs font-semibold',
              status.isShipped ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            )}
          >
            {status.isShipped ? 'Shipped' : 'In Progress'}
          </span>
        </div>

        <nav className="mt-5 flex flex-wrap gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition',
                  isActive
                    ? 'bg-primary text-white shadow-[0_10px_20px_-16px_rgba(16,24,40,0.6)]'
                    : 'border border-border/70 bg-white text-primary/80 hover:border-primary/40 hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </section>

      {children}
    </div>
  )
}
