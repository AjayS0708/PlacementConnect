'use client'
 
 import Link from 'next/link'
 import { usePathname } from 'next/navigation'
 import clsx from 'clsx'
 
 const navItems = [
   { href: '/', label: 'Dashboard' },
   { href: '/job-notifications', label: 'Job Notifications' },
   { href: '/placement-readiness', label: 'Placement Readiness' },
   { href: '/resume-builder', label: 'Resume Builder' },
 ]
 
 type SidebarProps = {
   collapsed: boolean
   onToggle: () => void
 }
 
 export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
   const pathname = usePathname()
 
   return (
     <aside
       className={clsx(
         'sticky top-0 hidden h-screen border-r border-border/60 bg-white/70 backdrop-blur-xl md:flex md:flex-col',
         collapsed ? 'w-20' : 'w-72'
       )}
     >
       <div className={clsx('flex items-center justify-between px-6 py-6', collapsed && 'px-4')}>
         <Link
           href="/"
           className={clsx(
             'font-display text-xl font-semibold tracking-tight text-primary',
             collapsed && 'text-center text-lg'
           )}
         >
           {collapsed ? 'PC' : 'Placement Connect'}
         </Link>
         <button
           onClick={onToggle}
           className="rounded-full border border-border/60 bg-white px-2.5 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30"
           aria-label="Toggle sidebar"
         >
           {collapsed ? '>' : '<'}
         </button>
       </div>
 
       <nav className="mt-2 flex-1 space-y-2 px-4">
         {navItems.map((item) => {
           const isActive = pathname === item.href
           return (
             <Link
               key={item.href}
               href={item.href}
               className={clsx(
                 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                 isActive
                   ? 'bg-primary text-white shadow-[0_10px_25px_-14px_rgba(22,34,66,0.7)]'
                   : 'text-primary/80 hover:bg-primary/10 hover:text-primary'
               )}
             >
               <span className="h-2.5 w-2.5 rounded-full bg-current opacity-70" />
               {!collapsed && <span>{item.label}</span>}
             </Link>
           )
         })}
       </nav>
 
       <div className="px-6 pb-6">
         {!collapsed && (
           <div className="rounded-2xl border border-border/60 bg-white/80 px-4 py-4 text-xs text-primary/70">
             SaaS Merge in progress. Modules are being unified into one experience.
           </div>
         )}
       </div>
     </aside>
   )
 }
