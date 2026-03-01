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
                   className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   🏠 Home
                 </Link>
                 <Link
                   href="/job-notifications"
                   className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   💼 Job Notifications
                 </Link>
                 <Link
                   href="/placement-readiness"
                   className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   📊 Placement Readiness
                 </Link>
                 <Link
                   href="/resume-builder"
                   className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   📄 Resume Builder
                 </Link>
               </nav>
             </MobileNavDrawer>
           </MobileOnly>

           <div className="flex-1">
            {/* Mobile Header with Hamburger */}
            <MobileOnly>
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-white/80 p-4 backdrop-blur-lg">
                <HamburgerMenu 
                  isOpen={mobileMenuOpen} 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
                <h1 className="text-lg font-bold text-slate-900">PlacementConnect</h1>
                <div className="w-12" /> {/* Spacer for balance */}
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
