'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 12000, suffix: '+', label: 'Students Placed', sublabel: 'and counting' },
  { value: 200,   suffix: '+', label: 'Partner Colleges', sublabel: 'across India' },
  { value: 500,   suffix: '+', label: 'Active Jobs Daily', sublabel: 'fresh & filtered' },
  { value: 94,    suffix: '%', label: 'Placement Rate',   sublabel: 'for active users' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section id="stats" className="relative overflow-hidden bg-gradient-to-br from-[#1A1F2E] to-[#0D1117] py-20 lg:py-24">
      {/* Background glow spots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-[#F5820A]/8 blur-[100px]" />
        <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#12B76A]/6 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center text-[12px] uppercase tracking-[0.1em] text-[#F5820A] font-sans font-semibold"
        >
          Results that speak
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="text-center"
            >
              {/* Divider line accent */}
              <div className="mx-auto mb-5 h-[2px] w-8 rounded-full bg-[#F5820A]" />

              <p className="font-display text-[clamp(36px,4vw,52px)] font-bold leading-none text-white">
                <CountUp target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-[15px] font-semibold text-[#E8EAF0] font-sans">{stat.label}</p>
              <p className="mt-1 text-[12px] text-[#8B929E] font-sans">{stat.sublabel}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 flex flex-col items-center gap-3 border-t border-[#2A2F3E] pt-10 sm:flex-row sm:justify-center"
        >
          <div className="flex items-center gap-1.5 text-[#8B929E] text-[13px] font-sans">
            <span className="text-[#F5820A]">★★★★★</span>
            <span>4.9 out of 5</span>
            <span className="text-[#2A2F3E]">·</span>
            <span>Based on 2,400+ reviews</span>
          </div>
          <span className="hidden sm:inline text-[#2A2F3E]">·</span>
          <div className="flex items-center gap-1.5 text-[#8B929E] text-[13px] font-sans">
            <svg className="h-4 w-4 text-[#12B76A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>NASSCOM Partner 2025</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
