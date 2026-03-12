'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const FEATURES = [
  {
    id: 'jobs',
    tab: 'Job Notifications',
    tag: '01',
    tagColor: 'text-blue-400',
    tagBg: 'bg-blue-500/10',
    headline: "Every relevant job, the moment it's posted.",
    body: 'Stop manually checking portals. Placement Connect aggregates openings from your college portal, company career pages, and direct postings — filtered by your role preference, CTC range, and location.',
    bullets: [
      'Smart filters: role, CTC, location, company tier',
      'Priority alerts for your wishlist companies',
      'One-click save, track, and apply',
      'Deadline countdown so you never miss a window',
    ],
    preview: (
      <div className="rounded-xl bg-[#0D1117] p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-wider text-[#8B929E] font-sans">Live Openings</span>
          <span className="rounded-full bg-[#F5820A]/15 px-2.5 py-1 text-[11px] font-bold text-[#F5820A]">47 new today</span>
        </div>
        {[
          { company: 'Google', role: 'SWE Intern', ctc: '₹18L', tag: 'Dream', tagColor: 'text-amber-400 bg-amber-400/10' },
          { company: 'Zepto', role: 'Product Analyst', ctc: '₹14L', tag: 'Match', tagColor: 'text-[#12B76A] bg-[#12B76A]/10' },
          { company: 'Razorpay', role: 'Backend Engineer', ctc: '₹20L', tag: 'New', tagColor: 'text-blue-400 bg-blue-400/10' },
        ].map((job) => (
          <div key={job.company} className="flex items-center justify-between rounded-lg bg-[#1A1F2E] px-4 py-3">
            <div>
              <p className="text-[13px] font-semibold text-[#E8EAF0] font-display">{job.company}</p>
              <p className="text-[11px] text-[#8B929E] font-sans">{job.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-[#E8EAF0]">{job.ctc}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${job.tagColor}`}>{job.tag}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'readiness',
    tab: 'Placement Readiness',
    tag: '02',
    tagColor: 'text-[#12B76A]',
    tagBg: 'bg-[#12B76A]/10',
    headline: 'Know exactly how ready you are — and what to fix.',
    body: 'Paste a job description, and Placement Connect gives you a readiness score in seconds. Track your interview performance, practice with a question bank, and watch your score climb week over week.',
    bullets: [
      'JD-matched readiness score (0–100%)',
      'Gap analysis: skills you\'re missing for each role',
      'Weekly mock interview question bank',
      'Progress tracker: see improvement over time',
    ],
    preview: (
      <div className="rounded-xl bg-[#0D1117] p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-wider text-[#8B929E] font-sans">Readiness Score</span>
          <span className="text-[11px] text-[#12B76A] font-semibold">↑ +8 this week</span>
        </div>
        {/* Big score */}
        <div className="flex items-center justify-between rounded-lg bg-[#1A1F2E] px-4 py-4">
          <div>
            <p className="font-display text-4xl font-bold text-[#F5820A]">78<span className="text-xl text-[#8B929E]">%</span></p>
            <p className="text-[12px] text-[#12B76A] font-sans mt-1">Strong · Keep going</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-[11px] text-[#8B929E]">vs. role benchmark</p>
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#2A2F3E]">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#F5820A] to-[#F5A623]" />
            </div>
            <p className="text-[11px] text-[#8B929E]">Need: 85%</p>
          </div>
        </div>
        {/* Gap items */}
        {['System Design', 'SQL Queries', 'Behavioural STAR'].map((skill, i) => (
          <div key={skill} className="flex items-center justify-between rounded-lg bg-[#1A1F2E] px-3 py-2.5">
            <span className="text-[12px] text-[#E8EAF0] font-sans">{skill}</span>
            <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
              i === 0 ? 'bg-red-500/10 text-red-400' :
              i === 1 ? 'bg-amber-500/10 text-amber-400' : 'bg-[#12B76A]/10 text-[#12B76A]'
            }`}>{i === 0 ? 'Gap' : i === 1 ? 'Weak' : 'Good'}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'resume',
    tab: 'Resume Builder',
    tag: '03',
    tagColor: 'text-purple-400',
    tagBg: 'bg-purple-500/10',
    headline: "A resume that's actually ready when they call.",
    body: 'Build a structured, ATS-optimised resume using guided templates designed for campus placements. No design skills needed — just fill in your details, choose your layout, and download a PDF that gets past the screener.',
    bullets: [
      'ATS-friendly templates for freshers & laterals',
      'JD keyword matching — score your resume against the role',
      'One-click PDF export, multiple format support',
      'Version control — maintain College, Startup, and MAANG variants',
    ],
    preview: (
      <div className="rounded-xl bg-[#0D1117] p-5 space-y-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-wider text-[#8B929E] font-sans">Resume Score</span>
          <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[11px] font-bold text-purple-400">ATS Ready</span>
        </div>
        <div className="rounded-lg bg-[#1A1F2E] px-4 py-4 flex items-center justify-between">
          <div>
            <p className="font-display text-4xl font-bold text-purple-400">94<span className="text-xl text-[#8B929E]">%</span></p>
            <p className="text-[12px] text-[#12B76A] font-sans mt-1">Strong ATS match</p>
          </div>
          <div className="space-y-1.5">
            {['Keywords', 'Format', 'Sections'].map((l, i) => (
              <div key={l} className="flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#2A2F3E]">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${[94, 100, 88][i]}%` }} />
                </div>
                <span className="text-[10px] text-[#8B929E] w-12">{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg bg-[#1A1F2E] px-3 py-2.5 text-center">
            <p className="font-display text-lg font-bold text-white">3</p>
            <p className="text-[10px] text-[#8B929E]">Versions</p>
          </div>
          <div className="flex-1 rounded-lg bg-[#1A1F2E] px-3 py-2.5 text-center">
            <p className="font-display text-lg font-bold text-white">2</p>
            <p className="text-[10px] text-[#8B929E]">Exports</p>
          </div>
          <div className="flex-1 rounded-lg bg-[#1A1F2E] px-3 py-2.5 text-center">
            <p className="font-display text-lg font-bold text-[#12B76A]">✓</p>
            <p className="text-[10px] text-[#8B929E]">ATS Pass</p>
          </div>
        </div>
      </div>
    ),
  },
]

export default function FeatureShowcase() {
  const [active, setActive] = useState(0)
  const feature = FEATURES[active]

  return (
    <section id="features" className="bg-[#F4F5F7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <p className="mb-3 text-[12px] uppercase tracking-[0.1em] text-[#F5820A] font-sans font-semibold">The platform</p>
          <h2 className="font-display font-bold text-[#1A1F2E] leading-tight tracking-tight"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}>
            Three tools. One dashboard.<br />Built for campus placement.
          </h2>
        </motion.div>

        {/* Tab strip */}
        <div className="mb-10 flex flex-wrap gap-2 border-b border-[#E2E4EA]">
          {FEATURES.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActive(i)}
              className={`relative pb-3 px-1 text-[14px] font-semibold font-sans transition-colors ${
                active === i ? 'text-[#1A1F2E]' : 'text-[#6B7280] hover:text-[#1A1F2E]'
              }`}
            >
              {f.tab}
              {active === i && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 inset-x-0 h-[2px] rounded-full bg-[#F5820A]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content: asymmetric split — 48/52 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid items-center gap-10 lg:grid-cols-[48fr_52fr] xl:gap-16"
          >
            {/* Left: text */}
            <div>
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full ${feature.tagBg} px-3 py-1.5`}>
                <span className={`font-mono text-[11px] font-bold ${feature.tagColor}`}>{feature.tag}</span>
                <span className={`text-[12px] font-semibold font-sans ${feature.tagColor}`}>{feature.tab}</span>
              </div>
              <h3 className="font-display font-bold text-[#1A1F2E] leading-tight mb-4"
                style={{ fontSize: 'clamp(22px, 2.8vw, 32px)' }}>
                {feature.headline}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#6B7280] font-sans mb-6">
                {feature.body}
              </p>
              <ul className="space-y-3 mb-8">
                {feature.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px] text-[#1A1F2E] font-sans">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-[#12B76A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1A1F2E] px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#363c52] active:scale-95"
              >
                Explore {feature.tab}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Right: mockup */}
            <div className="rounded-2xl border border-[#E2E4EA] bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              {feature.preview}
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
