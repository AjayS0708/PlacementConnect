'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    number: '01',
    title: 'Set up in 60 seconds',
    body: 'Connect your college, pick your target roles and companies, and set your CTC expectation. PlacementConnect is personalised from the first minute.',
    detail: 'No generic feed. Filtered for you from day one.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Track everything that matters',
    body: 'Get daily job alerts ranked by match score. Complete readiness assessments. Build or update your resume. Every action feeds your career health score.',
    detail: 'One dashboard. All modules connected.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Walk into placement day ready',
    body: 'Show up with a polished, ATS-scored resume, a readiness score above 80%, and a tracked list of applied roles. Know your strengths. Close the gaps.',
    detail: 'The difference between shortlisted and ghosted.',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-xl"
        >
          <p className="mb-3 text-[12px] uppercase tracking-[0.1em] text-[#F5820A] font-sans font-semibold">How it works</p>
          <h2 className="font-display font-bold text-[#1A1F2E] leading-tight tracking-tight"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
            From campus to offer letter.<br />Here&apos;s how.
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-8 lg:grid-cols-3 lg:gap-6">

          {/* Connector line (desktop only) */}
          <div className="absolute top-[52px] left-[calc(33.33%-12px)] right-[calc(33.33%-12px)] hidden h-px border-t-2 border-dashed border-[#E2E4EA] lg:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.12 }}
              className="relative flex flex-col"
            >
              {/* Number badge + icon */}
              <div className="mb-6 flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
                <div className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-[#F5820A] text-white shadow-[0_4px_16px_rgba(245,130,10,0.35)]">
                  {step.icon}
                  {/* Connector dot (after step 1 and 2 on desktop) */}
                  {i < 2 && (
                    <div className="absolute -right-[calc(50vw/3+12px)] top-1/2 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[#F5820A] bg-white lg:block" />
                  )}
                </div>
                <span className="font-mono text-[11px] font-bold tracking-widest text-[#95a0b8]">{step.number}</span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-3 font-display text-[20px] font-bold text-[#1A1F2E] leading-snug">
                  {step.title}
                </h3>
                <p className="mb-4 text-[14px] leading-relaxed text-[#6B7280] font-sans">
                  {step.body}
                </p>
                <p className="text-[13px] font-semibold text-[#F5820A] font-sans">
                  → {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
