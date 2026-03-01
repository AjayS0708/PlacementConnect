'use client'
 
import { useState } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import Link from 'next/link'
import { MobileNavDrawer } from '@/components/Drawer'
import { HamburgerMenu } from '@/components/HamburgerMenu'
import { MobileOnly, HiddenOnMobile } from '@/components/Responsive'
 
 type AppShellProps = {
   children: React.ReactNode
 }
 
 export default function AppShell({ children }: AppShellProps) {
   const [collapsed, setCollapsed] = useState(false)
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
 
   return (
     <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef6e8_0%,_#f5f7ff_45%,_#f7f3ee_100%)] text-primary">
       <div className="relative">
         <div className="pointer-events-none absolute inset-0 opacity-50">
           <div className="absolute -top-40 -left-40 h-[320px] w-[320px] rounded-full bg-[#f3c7a8] blur-[120px]" />
           <div className="absolute top-32 right-0 h-[360px] w-[360px] rounded-full bg-[#b6c4ff] blur-[140px]" />
         </div>
 
         <div className="relative z-10 flex">
           {/* Desktop Sidebar */}
           <HiddenOnMobile>
             <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
           </HiddenOnMobile>

           {/* Mobile Drawer */}
           <MobileOnly>
             <MobileNavDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
               <nav className="space-y-2">
                 <Link
                   href="/"
                   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                   </svg>
                   Home
                 </Link>
                 <Link
                   href="/job-notifications"
                   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                   Job Notifications
                 </Link>
                 <Link
                   href="/placement-readiness"
                   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                   </svg>
                   Placement Readiness
                 </Link>
                 <Link
                   href="/resume-builder"
                   className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                   Resume Builder
                 </Link>
               </nav>
             </MobileNavDrawer>
           </MobileOnly>

           <div className="flex-1">
            {/* Mobile Header with Hamburger */}
            <MobileOnly>
              <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur-lg">
                <HamburgerMenu 
                  isOpen={mobileMenuOpen} 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-slate-700"
                />
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-base font-bold text-slate-900">PlacementConnect</h1>
                </div>
                <div className="w-10" /> {/* Spacer for balance */}
              </div>
            </MobileOnly>

            {/* Desktop TopNav */}
            <HiddenOnMobile>
              <TopNav />
            </HiddenOnMobile>

            <div className="md:hidden px-6">
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href="/job-notifications"
                  className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Jobs
                </Link>
                <Link
                  href="/placement-readiness"
                  className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Readiness
                </Link>
                <Link
                  href="/resume-builder"
                  className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Resume
                </Link>
                <Link
                  href="/"
                  className="rounded-2xl border border-border/60 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                >
                  Overview
                </Link>
              </div>
            </div>
            <main className="px-6 pb-10 pt-6 md:px-10">
              {children}
            </main>
           </div>
         </div>
       </div>
     </div>
   )
 }
