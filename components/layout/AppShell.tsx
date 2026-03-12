'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import Link from 'next/link'
import { HiddenOnMobile } from '@/components/Responsive'

// ─── Global mobile bottom nav config ─────────────────────────────────────────

const MOB_TABS = [
  {
    label: 'Home',
    href: '/dashboard',
    exact: true,
    activeColor: 'text-indigo-600',
    activeBg: 'bg-indigo-50',
    activeDot: 'bg-indigo-500',
    icon: (active: boolean) => (
      <svg className="h-[22px] w-[22px]" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'Jobs',
    href: '/job-notifications',
    exact: false,
    activeColor: 'text-blue-600',
    activeBg: 'bg-blue-50',
    activeDot: 'bg-blue-500',
    icon: (active: boolean) => (
      <svg className="h-[22px] w-[22px]" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Readiness',
    href: '/placement-readiness',
    exact: false,
    activeColor: 'text-emerald-600',
    activeBg: 'bg-emerald-50',
    activeDot: 'bg-emerald-500',
    icon: (active: boolean) => (
      <svg className="h-[22px] w-[22px]" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Resume',
    href: '/resume-builder',
    exact: false,
    activeColor: 'text-purple-600',
    activeBg: 'bg-purple-50',
    activeDot: 'bg-purple-500',
    icon: (active: boolean) => (
      <svg className="h-[22px] w-[22px]" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/analytics',
    exact: false,
    activeColor: 'text-amber-600',
    activeBg: 'bg-amber-50',
    activeDot: 'bg-amber-500',
    icon: (active: boolean) => (
      <svg className="h-[22px] w-[22px]" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

type AppShellProps = {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Landing page at "/" renders without the app shell
  if (pathname === '/') return <>{children}</>

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef6e8_0%,_#f5f7ff_45%,_#f7f3ee_100%)] text-primary">
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 opacity-30 z-0">
          <div className="absolute -top-40 -left-40 h-[320px] w-[320px] rounded-full bg-[#f3c7a8] blur-[120px]" />
          <div className="absolute top-32 right-0 h-[360px] w-[360px] rounded-full bg-[#b6c4ff] blur-[140px]" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Desktop Sidebar */}
          <HiddenOnMobile>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
          </HiddenOnMobile>

          <div className="flex-1 min-w-0">
            {/* Mobile Header — clean brand bar, no hamburger */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-xl shadow-sm sm:hidden">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-[15px] font-bold tracking-tight text-slate-900">PlacementConnect</span>
              </div>
              {/* Active page label */}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                {MOB_TABS.find(t => t.exact ? pathname === t.href : pathname?.startsWith(t.href))?.label ?? 'App'}
              </span>
            </div>

            {/* Desktop TopNav */}
            <HiddenOnMobile>
              <TopNav />
            </HiddenOnMobile>

            {/* Page content — extra bottom padding on mobile for the nav bar */}
            <main id="main-content" className="px-4 pb-[84px] pt-4 sm:px-6 sm:pb-10 sm:pt-6 md:px-10" role="main" aria-label="Main content">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* ── Global Mobile Bottom Nav — always visible on all pages ─────────── */}
      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Frosted glass background */}
        <div className="border-t border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.07)]">
          <div className="flex items-stretch">
            {MOB_TABS.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : (pathname?.startsWith(tab.href) ?? false)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative flex flex-1 flex-col items-center justify-center gap-[3px] pb-2 pt-2.5 transition-all active:scale-95 min-h-[58px] ${isActive ? tab.activeColor : 'text-slate-400'}`}
                >
                  {/* Active top indicator pill */}
                  {isActive && (
                    <span className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full ${tab.activeDot}`} />
                  )}
                  {/* Active background blob */}
                  {isActive && (
                    <span className={`absolute inset-x-1 inset-y-1 rounded-xl ${tab.activeBg} opacity-60`} />
                  )}
                  {/* Icon */}
                  <span className="relative z-10">
                    {tab.icon(isActive)}
                  </span>
                  {/* Label */}
                  <span className={`relative z-10 text-[10px] font-semibold tracking-tight leading-none ${isActive ? tab.activeColor : 'text-slate-400'}`}>
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
