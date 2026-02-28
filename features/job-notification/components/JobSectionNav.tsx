'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const items = [
  { href: '/job-notifications', label: 'Dashboard' },
  { href: '/job-notifications/saved', label: 'Saved' },
  { href: '/job-notifications/digest', label: 'Digest' },
  { href: '/job-notifications/settings', label: 'Settings' },
  { href: '/job-notifications/test', label: 'Test' },
  { href: '/job-notifications/ship', label: 'Ship' },
]

export default function JobSectionNav() {
  const pathname = usePathname()

  return (
    <section className="mb-6 rounded-2xl border border-border/60 bg-white/80 p-3">
      <nav className="flex flex-wrap gap-2" aria-label="Job Notifications Sections">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition',
                isActive
                  ? 'bg-primary text-white'
                  : 'border border-border/70 bg-white text-primary/80 hover:border-primary/40 hover:text-primary'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </section>
  )
}
