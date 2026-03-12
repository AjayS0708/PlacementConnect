'use client'

import { motion } from 'framer-motion'

const PAINS = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    stat: '83%',
    label: 'of students miss opportunities',
    pain: 'Job alerts buried in email, WhatsApp forwards, and spam folders. By the time you see it, the deadline is gone.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    stat: '67%',
    label: 'walk into interviews unprepared',
    pain: 'No way to quantify interview readiness or know exactly which skills to work on before the placement date.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    stat: '71%',
    label: 'update their resume the night before',
    pain: 'Resume is an afterthought. Edited in a panic, formatted differently every time, and never Job-Description-matched.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: i * 0.1 },
  }),
}

export default function ProblemSection() {
  return (
    <section className="bg-[#1A1F2E] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Heading block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-2xl"
        >
          <p className="mb-3 text-[12px] uppercase tracking-[0.1em] text-[#F5820A] font-sans font-semibold">
            The problem
          </p>
          <h2 className="font-display font-bold text-white leading-tight tracking-tight mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            You're juggling 4 tabs, 3 WhatsApp groups,<br className="hidden lg:block" /> and 2 Excel sheets.
            <span className="text-[#8B929E]"> That's not a strategy.</span>
          </h2>
          <p className="text-[16px] leading-relaxed text-[#8B929E] font-sans">
            Every day without a system is a day your competition gets ahead. Here's what the old way costs you.
          </p>
        </motion.div>

        {/* Pain cards — staggered vertical offset on desktop */}
        <div className="grid gap-4 md:grid-cols-3 md:items-start">
          {PAINS.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className={`rounded-xl border border-[#2A2F3E] bg-[#0D1117] p-6 ${i === 1 ? 'md:mt-8' : ''}`}
            >
              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5820A]/10 text-[#F5820A]">
                {item.icon}
              </div>

              {/* Stat */}
              <div className="mb-3">
                <span className="font-display text-4xl font-bold text-white">{item.stat}</span>
                <p className="mt-1 text-[13px] font-semibold text-[#E8EAF0] font-sans">{item.label}</p>
              </div>

              {/* Pain description */}
              <p className="text-[13px] leading-relaxed text-[#8B929E] font-sans border-t border-[#2A2F3E] pt-4 mt-4">
                {item.pain}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2A2F3E]" />
          <p className="text-[14px] font-semibold text-[#F5820A] font-sans px-2">
            There's a better way. ↓
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#2A2F3E]" />
        </motion.div>

      </div>
    </section>
  )
}
