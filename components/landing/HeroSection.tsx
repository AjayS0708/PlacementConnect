'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

// ── Mini Dashboard Mockup (the visual inside the hero card) ──────────────────
function DashboardMockup() {
  return (
    <div className="w-full rounded-xl bg-[#0D1117] p-5 font-sans text-xs">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#F5820A]" />
          <span className="font-semibold text-[#E8EAF0] text-[11px] font-display">PlacementConnect</span>
        </div>
        <span className="rounded-full bg-[#12B76A]/15 px-2 py-0.5 text-[10px] font-semibold text-[#12B76A]">
          ● Live
        </span>
      </div>

      {/* Placement score ring row */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-[#1A1F2E] px-4 py-3">
        <div>
          <p className="text-[10px] text-[#8B929E] uppercase tracking-wider mb-0.5">Readiness Score</p>
          <p className="text-2xl font-bold text-[#F5820A] font-display">78<span className="text-sm text-[#8B929E]">%</span></p>
          <p className="text-[10px] text-[#12B76A] font-medium mt-0.5">↑ +6 this week</p>
        </div>
        {/* Mini arc gauge SVG */}
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-[120deg]">
          <circle cx="28" cy="28" r="22" fill="none" stroke="#2A2F3E" strokeWidth="5" />
          <circle
            cx="28" cy="28" r="22" fill="none"
            stroke="#F5820A" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 22 * 0.78} ${2 * Math.PI * 22}`}
          />
        </svg>
      </div>

      {/* 3 module stat pills */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Jobs', value: '47', color: 'text-blue-400', dot: 'bg-blue-500' },
          { label: 'Applied', value: '12', color: 'text-[#12B76A]', dot: 'bg-[#12B76A]' },
          { label: 'Resume', value: '94%', color: 'text-[#F5820A]', dot: 'bg-[#F5820A]' },
        ].map(({ label, value, color, dot }) => (
          <div key={label} className="rounded-lg bg-[#1A1F2E] p-2.5 text-center">
            <div className={`text-base font-bold font-display ${color}`}>{value}</div>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <div className={`h-1 w-1 rounded-full ${dot}`} />
              <span className="text-[9px] text-[#8B929E]">{label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity bar */}
      <div className="rounded-lg bg-[#1A1F2E] px-3 py-2.5">
        <p className="text-[9px] uppercase tracking-wider text-[#8B929E] mb-2">Weekly Activity</p>
        <div className="flex items-end gap-1 h-8">
          {[40, 65, 45, 80, 70, 90, 78].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i === 6
                  ? 'linear-gradient(180deg, #F5820A, #F5A623)'
                  : `rgba(245,130,10,${0.15 + h * 0.003})`,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          {['M','T','W','T','F','S','S'].map((d,i) => (
            <span key={i} className="flex-1 text-center text-[8px] text-[#8B929E]">{d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F4F5F7] pt-24 pb-16 lg:pt-28 lg:pb-24">
      {/* Background: subtle radial glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-[480px] w-[480px] rounded-full bg-[#F5820A]/6 blur-[120px]" />
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[#1A1F2E]/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[320px] w-[640px] rounded-full bg-[#12B76A]/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[58fr_42fr] xl:gap-20">

          {/* ── LEFT: Copy ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F5820A]/30 bg-[#F5820A]/8 px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5820A] animate-pulse" />
              <span className="text-[13px] font-semibold text-[#F5820A] font-sans">
                3 tools · 1 platform · zero tab-switching
              </span>
            </div>

            {/* H1 */}
            <h1 className="font-display font-bold text-[#1A1F2E] leading-[1.1] tracking-tight mb-5"
              style={{ fontSize: 'clamp(38px, 5.5vw, 62px)' }}>
              Land your dream job<br />
              <span className="relative">
                before your batch
                <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-[#F5820A] to-[#F5A623]" />
              </span>{' '}
              <span className="text-[#F5820A]">even applies.</span>
            </h1>

            {/* Subhead */}
            <p className="mb-8 text-[17px] leading-relaxed text-[#6B7280] font-sans max-w-lg">
              Track live job openings, measure your placement readiness, and build
              a job-ready resume — all synced in one dashboard built for campus placement.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-lg bg-[#F5820A] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#dc6c08] hover:shadow-[0_4px_20px_rgba(245,130,10,0.4)] active:scale-95"
              >
                Start for Free
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E4EA] bg-white px-6 py-3.5 text-[15px] font-semibold text-[#1A1F2E] transition-all hover:border-[#1A1F2E] hover:shadow-sm active:scale-95"
              >
                <svg className="h-4 w-4 text-[#F5820A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See Live Demo
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#6B7280] font-sans">
              {/* Avatar stack */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'].map((c, i) => (
                    <div key={i} className={`h-7 w-7 rounded-full border-2 border-white ${c} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span><strong className="text-[#1A1F2E] font-semibold">12,000+</strong> students placed</span>
              </div>
              <span className="hidden sm:inline text-[#E2E4EA]">·</span>
              <span><strong className="text-[#1A1F2E] font-semibold">200+</strong> partner colleges</span>
              <span className="hidden sm:inline text-[#E2E4EA]">·</span>
              <span className="flex items-center gap-1">
                <span className="text-[#F5820A]">★★★★★</span>
                <span>4.9/5</span>
              </span>
            </div>
          </motion.div>

          {/* ── RIGHT: Dashboard Mockup Card ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative"
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 rounded-2xl bg-[#F5820A]/12 blur-[48px] scale-90 translate-y-4" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-[#2A2F3E] bg-[#1A1F2E] p-1 shadow-[0_20px_48px_rgba(0,0,0,0.28)]">
              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.35 }}
                className="absolute -top-4 -right-3 z-10 flex items-center gap-1.5 rounded-full border border-[#2A2F3E] bg-[#0D1117] px-3 py-1.5 shadow-lg"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F5820A] opacity-60" />
                  <span className="h-2 w-2 rounded-full bg-[#F5820A]" />
                </span>
                <span className="text-[11px] font-semibold text-[#E8EAF0]">47 new jobs today</span>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.35 }}
                className="absolute -bottom-4 -left-3 z-10 flex items-center gap-1.5 rounded-full border border-[#2A2F3E] bg-[#0D1117] px-3 py-1.5 shadow-lg"
              >
                <span className="text-[#12B76A]">✓</span>
                <span className="text-[11px] font-semibold text-[#E8EAF0]">Resume scored 94%</span>
              </motion.div>

              <DashboardMockup />
            </div>
          </motion.div>

        </div>

        {/* ── Trusted by logos bar ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 lg:mt-20"
        >
          <p className="mb-5 text-center text-[12px] uppercase tracking-widest text-[#6B7280] font-sans">
            Trusted by students from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {['IIT Bombay', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore', 'RVCE Bangalore', 'SRM Chennai'].map((college) => (
              <span key={college} className="text-[13px] font-semibold text-[#95a0b8] font-sans hover:text-[#1A1F2E] transition-colors cursor-default">
                {college}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
