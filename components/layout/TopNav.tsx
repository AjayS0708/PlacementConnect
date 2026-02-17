 import Link from 'next/link'
 
 export default function TopNav() {
   return (
     <header className="sticky top-0 z-20 border-b border-border/60 bg-white/70 px-6 py-4 backdrop-blur-xl md:px-10">
       <div className="flex flex-wrap items-center justify-between gap-4">
         <div>
           <p className="text-xs uppercase tracking-[0.24em] text-primary/50">Placement Connect</p>
           <h1 className="font-display text-lg font-semibold text-primary md:text-xl">
             Unified Placement Dashboard
           </h1>
         </div>
         <div className="flex items-center gap-3">
           <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-white px-4 py-2 text-xs text-primary/60 shadow-sm md:flex">
             <span className="h-2 w-2 rounded-full bg-emerald-500" />
             All systems normal
           </div>
           <Link
             href="/resume-builder"
             className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_-16px_rgba(16,24,40,0.6)] transition hover:-translate-y-0.5"
           >
             Build Resume
           </Link>
         </div>
       </div>
     </header>
   )
 }
