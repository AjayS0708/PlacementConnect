'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getDashboardData, DashboardData, ActivityEvent, PriorityAction } from '@/utils/dashboardData'
import { cn } from '@/utils/cn'

// ─── Mobile bottom nav data ───────────────────────────────────────────────────

const MOB_NAV = [
  { label: 'Jobs',      href: '/job-notifications',   color: 'text-blue-400',    dot: 'bg-blue-500',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { label: 'Readiness', href: '/placement-readiness', color: 'text-emerald-400', dot: 'bg-emerald-500',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { label: 'Resume',    href: '/resume-builder',      color: 'text-purple-400',  dot: 'bg-purple-500',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { label: 'Analytics', href: '/analytics',           color: 'text-amber-400',   dot: 'bg-amber-500',
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
]

// ─── Time helpers ─────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 172800) return 'yesterday'
  return `${Math.floor(s / 86400)}d ago`
}

// ─── Count-Up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200): number {
  const [value, setValue] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(ease * target))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])
  return value
}

// ─── Arc Gauge (dark-bg variant) ─────────────────────────────────────────────

function ArcGauge({ score, size = 140 }: { score: number; size?: number }) {
  const anim = useCountUp(score)
  const R = 52, cx = size / 2, cy = size / 2 + 10
  const startAngle = -210, totalArc = 240
  const toRad = (d: number) => (d * Math.PI) / 180
  const arcPath = (from: number, to: number) => {
    const s = { x: cx + R * Math.cos(toRad(from)), y: cy + R * Math.sin(toRad(from)) }
    const e = { x: cx + R * Math.cos(toRad(to)),   y: cy + R * Math.sin(toRad(to)) }
    const large = to - from > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`
  }
  const fillAngle = startAngle + (score / 100) * totalArc
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#818cf8' : score > 0 ? '#fbbf24' : '#475569'

  return (
    <svg width={size} height={size - 10} viewBox={`0 0 ${size} ${size}`} aria-label={`Career health: ${score}/100`}>
      <path d={arcPath(startAngle, startAngle + totalArc)} fill="none" stroke="#e2e8f0" strokeWidth={10} strokeLinecap="round" />
      {score > 0 && (
        <motion.path d={arcPath(startAngle, fillAngle)} fill="none" stroke={color} strokeWidth={10}
          strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }} />
      )}
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={score === 0 ? 20 : 30} fontWeight="700"
        fill={score === 0 ? '#94a3b8' : color} fontFamily="Fraunces, serif">
        {score === 0 ? '—' : anim}
      </text>
      {score > 0 && <text x={cx} y={cy + 22} textAnchor="middle" fontSize={10} fill="#94a3b8" fontFamily="Sora, sans-serif">/ 100</text>}
    </svg>
  )
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const W = 64, H = 24, pad = 2
  const mn = Math.min(...values), mx = Math.max(...values)
  const range = mx - mn || 1
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (W - pad * 2)
    const y = H - pad - ((v - mn) / range) * (H - pad * 2)
    return `${x},${y}`
  }).join(' ')
  const last = values[values.length - 1], prev = values[values.length - 2]
  const trend = last > prev ? '▲' : last < prev ? '▼' : '→'
  const trendColor = last > prev ? '#10b981' : last < prev ? '#fbbf24' : '#94a3b8'

  return (
    <div className="flex items-center gap-2">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <polyline points={pts} fill="none" stroke="#818cf8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        {/* Last dot */}
        {(() => { const [lx, ly] = pts.split(' ').pop()!.split(','); return <circle cx={lx} cy={ly} r={2.5} fill={trendColor} /> })()}
      </svg>
      <span className="text-xs font-bold tabular-nums" style={{ color: trendColor }}>{trend} {last}%</span>
    </div>
  )
}

// ─── Trend Arrow ──────────────────────────────────────────────────────────────

function TrendArrow({ current, prev }: { current: number; prev: number | null }) {
  if (prev === null || prev === 0) return null
  const delta = current - prev
  if (Math.abs(delta) < 2) return <span className="text-[10px] font-semibold text-slate-400">→</span>
  return delta > 0
    ? <span className="text-[10px] font-bold text-emerald-500">▲{delta}</span>
    : <span className="text-[10px] font-bold text-red-400">▼{Math.abs(delta)}</span>
}

// ─── Urgency badge ────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency }: { urgency: PriorityAction['urgency'] }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest',
      urgency === 'high'   ? 'bg-red-100 text-red-700' :
      urgency === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
    )}>{urgency}</span>
  )
}

// ─── Module tag ───────────────────────────────────────────────────────────────

function ModuleTag({ module }: { module: ActivityEvent['module'] }) {
  const cfg = {
    jobs:      { label: 'Jobs',      cls: 'bg-blue-100 text-blue-700' },
    readiness: { label: 'Readiness', cls: 'bg-emerald-100 text-emerald-700' },
    resume:    { label: 'Resume',    cls: 'bg-purple-100 text-purple-700' },
  }[module]
  return <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide', cfg.cls)}>{cfg.label}</span>
}

// ─── Large Ring (72px) for module health ─────────────────────────────────────

function LargeRing({ value, max = 100, color, track = '#1e293b' }: { value: number; max?: number; color: string; track?: string }) {
  const R = 30, circ = 2 * Math.PI * R, pct = Math.min(value / max, 1)
  return (
    <svg width={72} height={72} className="-rotate-90">
      <circle cx={36} cy={36} r={R} fill="none" stroke={track} strokeWidth={6} />
      <motion.circle cx={36} cy={36} r={R} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ─── Heatmap dots row ─────────────────────────────────────────────────────────

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function HeatDots({ dots, color }: { dots: boolean[]; color: string }) {
  return (
    <div className="flex items-center gap-1">
      {dots.map((active, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <div className={cn('h-2 w-2 rounded-sm transition-colors', active ? color : 'bg-slate-100')} />
          <span className="text-[8px] font-medium text-slate-400">{DAY_LABELS[i]}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Animated number ─────────────────────────────────────────────────────────

function AnimNum({ n }: { n: number }) { return <>{useCountUp(n, 900)}</> }

// ─── Animation variants ───────────────────────────────────────────────────────

const fade    = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
const stagger = { show: { transition: { staggerChildren: 0.06 } } }

// ─── Module CTA colors ────────────────────────────────────────────────────────

const MOD_CTA = {
  jobs:      { border: 'border-blue-300',   text: 'text-blue-700',    hover: 'hover:bg-blue-50'    },
  readiness: { border: 'border-emerald-300', text: 'text-emerald-700', hover: 'hover:bg-emerald-50' },
  resume:    { border: 'border-purple-300',  text: 'text-purple-700',  hover: 'hover:bg-purple-50'  },
}

const MOD_BORDER = {
  jobs:      'border-l-blue-400',
  readiness: 'border-l-emerald-400',
  resume:    'border-l-purple-400',
}

// ─── Activity icon ────────────────────────────────────────────────────────────

function ActivityIcon({ module }: { module: ActivityEvent['module'] }) {
  const cfg = {
    jobs:      { bg: 'bg-blue-50',    ico: <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    readiness: { bg: 'bg-emerald-50', ico: <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    resume:    { bg: 'bg-purple-50',  ico: <svg className="h-3.5 w-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  }[module]
  return <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-xl', cfg.bg)}>{cfg.ico}</span>
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => { setData(getDashboardData()) }, [])

  if (!data) {
    return (
      <div className="space-y-4 px-1 py-2 animate-pulse">
        <div className="h-48 rounded-3xl bg-slate-200 sm:h-56" />
        <div className="flex gap-3 overflow-hidden">
          {[0,1,2].map(i => <div key={i} className="h-32 min-w-[260px] flex-1 rounded-2xl bg-slate-200" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <div className="h-80 rounded-2xl bg-slate-200" />
          <div className="h-80 rounded-2xl bg-slate-200" />
        </div>

      </div>
    )
  }

  const {
    careerHealthScore, healthLabel,
    jobsModule: j, readinessModule: r, resumeModule: res,
    priorityActions, recentActivity, isFirstVisit,
    scoreHistory, weeklyActivityDots,
  } = data

  const scoreColor = careerHealthScore >= 75 ? 'text-emerald-600' : careerHealthScore >= 50 ? 'text-indigo-600' : careerHealthScore > 0 ? 'text-amber-600' : 'text-slate-500'

  // Stat card urgency: pick the worst module to highlight
  const worstModule = r.score > 0 && r.score < 60 ? 'readiness' : j.savedCount > 0 && j.appliedCount === 0 ? 'jobs' : null

  return (
    <>
      <motion.div
        className="space-y-4 px-0 pb-20 sm:pb-6 lg:px-1"
        variants={stagger} initial="hidden" animate="show"
      >
        {/* ── Zone A — Hero ─────────────────────────────────────────────────── */}
        <motion.section
          variants={fade}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/60 to-purple-50/40 shadow-sm"
        >
          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="absolute -bottom-12 left-8 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>
          {/* Top accent bar */}
          <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

          <div className="relative flex flex-col gap-6 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
            {/* Left — greeting */}
            <div className="min-w-0">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-slate-400">{formatDate()}</p>
              <h1 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                {getGreeting()} 👋
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
                {isFirstVisit
                  ? 'Welcome to PlacementConnect. Set up your modules below to track your career readiness.'
                  : `Career health is ${healthLabel.toLowerCase()}. Here's what needs your attention today.`}
              </p>

              {/* Sparkline under greeting */}
              {scoreHistory.length >= 2 && (
                <div className="mt-3">
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-400">Readiness trend</p>
                  <Sparkline values={scoreHistory} />
                </div>
              )}

              {/* Module quick-nav pills — horizontal scroll on mobile */}
              <div className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
                {MOB_NAV.map(({ label, href, dot }) => (
                  <Link key={href} href={href}
                    className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:border-indigo-300 hover:bg-white hover:shadow-md active:scale-95 min-h-[36px]"
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right — Career Health Arc Gauge */}
            <div className="flex shrink-0 flex-row items-center gap-5 sm:flex-col sm:items-center sm:gap-1 sm:text-center">
              <ArcGauge score={careerHealthScore} size={130} />
              <div className="sm:text-center">
                <p className={cn('text-sm font-bold', scoreColor)}>{healthLabel}</p>
                <p className="text-[11px] text-slate-400">Career Health</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Zone B — Vital Stats (horizontal scroll on mobile) ─────────────── */}
        <motion.div variants={stagger} className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">

          {/* Jobs card */}
          <motion.div variants={fade} className="min-w-[260px] flex-1 sm:min-w-0">
            <Link href="/job-notifications"
              className={cn(
                'group block h-full rounded-2xl border-2 bg-white p-5 shadow-sm transition-all hover:shadow-md min-h-[120px]',
                worstModule === 'jobs' ? 'border-amber-300 ring-2 ring-amber-200 ring-offset-2' : 'border-slate-100 hover:border-blue-200'
              )}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-xl bg-blue-50 p-2.5">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <div className="text-right">
                  <span className="text-xs text-slate-400">week <span className="font-bold text-blue-600"><AnimNum n={j.appliedThisWeek} /></span></span>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-bold tabular-nums text-slate-900"><AnimNum n={j.savedCount} /></p>
                <TrendArrow current={j.appliedCount} prev={j.savedCount > 0 ? j.savedCount - 1 : null} />
              </div>
              <p className="mt-0.5 text-sm font-medium text-slate-500">Opportunities</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, j.savedCount === 0 ? 0 : (j.appliedCount / j.savedCount) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-600"><AnimNum n={j.appliedCount} /></span> applied
                {j.selectedCount > 0 && <> · <span className="font-semibold text-emerald-600"><AnimNum n={j.selectedCount} /></span> selected</>}
              </p>
            </Link>
          </motion.div>

          {/* Readiness card */}
          <motion.div variants={fade} className="min-w-[260px] flex-1 sm:min-w-0">
            <Link href="/placement-readiness"
              className={cn(
                'group block h-full rounded-2xl border-2 bg-white p-5 shadow-sm transition-all hover:shadow-md min-h-[120px]',
                worstModule === 'readiness' ? 'border-amber-300 ring-2 ring-amber-200 ring-offset-2' : 'border-slate-100 hover:border-emerald-200',
                r.score >= 75 && 'bg-gradient-to-br from-white to-emerald-50/40'
              )}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-xl bg-emerald-50 p-2.5">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </span>
                <span className="text-xs text-slate-400">PRP <span className={cn('font-bold', r.prpStepsCompleted >= r.prpStepsTotal ? 'text-emerald-600' : 'text-slate-600')}><AnimNum n={r.prpStepsCompleted} />/{r.prpStepsTotal}</span></span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <p className="text-3xl font-bold tabular-nums text-slate-900">
                  {r.score > 0 ? <><AnimNum n={r.score} /><span className="text-lg text-slate-400">%</span></> : '—'}
                </p>
                {scoreHistory.length >= 2 && <TrendArrow current={scoreHistory[scoreHistory.length - 1]} prev={scoreHistory[scoreHistory.length - 2]} />}
              </div>
              <p className="mt-0.5 text-sm font-medium text-slate-500">Placement Readiness</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div className={cn('h-full rounded-full', r.score >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : r.score >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-amber-500 to-orange-400')}
                  initial={{ width: 0 }} animate={{ width: `${r.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                {r.analysisCount > 0 ? <>{r.analysisCount} analyse{r.analysisCount !== 1 ? 's' : ''} · {r.interviewSessionsThisWeek} sessions this week</> : 'Paste a JD to get your score'}
              </p>
            </Link>
          </motion.div>

          {/* Resume card */}
          <motion.div variants={fade} className="min-w-[260px] flex-1 sm:min-w-0">
            <Link href="/resume-builder"
              className={cn(
                'group block h-full rounded-2xl border-2 bg-white p-5 shadow-sm transition-all hover:shadow-md min-h-[120px]',
                !res.hasResume ? 'border-amber-300 ring-2 ring-amber-200 ring-offset-2' : 'border-slate-100 hover:border-purple-200',
                res.hasResume && 'bg-gradient-to-br from-white to-purple-50/40'
              )}>
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="rounded-xl bg-purple-50 p-2.5">
                  <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </span>
                <span className="text-xs text-slate-400">
                  {res.versionCount > 0 ? <><span className="font-bold text-purple-600"><AnimNum n={res.versionCount} /></span> ver.</> : 'No resume'}
                </span>
              </div>
              <p className="truncate text-2xl font-bold text-slate-900">
                {res.activeResumeName ?? <span className="text-slate-300 text-xl">Not built yet</span>}
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-500">Active Resume</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }} animate={{ width: res.hasResume ? '100%' : '0%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">
                {res.daysSinceLastEdit !== null
                  ? res.daysSinceLastEdit === 0 ? 'Edited today' : `Edited ${res.daysSinceLastEdit}d ago`
                  : 'Build your first resume →'}
              </p>
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Zone C + D ─────────────────────────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">

          {/* ── Zone C Left ───────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Priority Actions */}
            <motion.section variants={fade} className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
              <div className="border-b-2 border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="font-serif text-base font-bold text-slate-900 sm:text-lg">What matters now</h2>
                <p className="text-xs text-slate-400">Ranked by impact · live from your activity</p>
              </div>
              <div className="divide-y divide-slate-50">
                {priorityActions.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="mb-2 text-4xl">🎯</div>
                    <p className="font-semibold text-slate-700">All caught up!</p>
                    <p className="mt-1 text-sm text-slate-400">No urgent actions right now.</p>
                  </div>
                ) : priorityActions.map((action, i) => (
                  <div key={i} className={cn('flex items-start gap-3 border-l-4 px-5 py-4 transition-colors hover:bg-slate-50/60 sm:gap-4 sm:px-6 sm:py-5', MOD_BORDER[action.module])}>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <UrgencyBadge urgency={action.urgency} />
                        <span className="text-sm font-semibold text-slate-900">{action.title}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500">{action.rationale}</p>
                    </div>
                    <Link href={action.href}
                      className={cn('shrink-0 rounded-xl border px-3 py-2 text-xs font-bold transition-all active:scale-95 min-h-[36px] flex items-center whitespace-nowrap', MOD_CTA[action.module].border, MOD_CTA[action.module].text, MOD_CTA[action.module].hover)}
                    >{action.cta}</Link>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Activity Feed */}
            <motion.section variants={fade} className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b-2 border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900 sm:text-lg">Recent activity</h2>
                  <p className="text-xs text-slate-400">Your latest actions across all modules</p>
                </div>
                <Link href="/analytics" className="shrink-0 text-xs font-semibold text-blue-600 hover:underline">All →</Link>
              </div>
              {recentActivity.length === 0 ? (
                <div className="flex flex-col items-center py-10 text-center px-4">
                  <div className="mb-2 text-3xl">📋</div>
                  <p className="font-semibold text-slate-700">No activity yet</p>
                  <p className="mt-1 text-sm text-slate-400">Your actions in Jobs, Readiness and Resume will appear here.</p>
                  <Link href="/job-notifications" className="mt-4 min-h-[40px] rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 flex items-center">
                    Explore Jobs →
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-slate-50">
                  {recentActivity.map((ev) => (
                    <li key={ev.id} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50/60 sm:px-6 sm:py-4 min-h-[52px]">
                      <ActivityIcon module={ev.module} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <ModuleTag module={ev.module} />
                          <span className="text-[11px] text-slate-400 tabular-nums">{relativeTime(ev.timestamp)}</span>
                        </div>
                        <p className="mt-0.5 text-sm font-medium text-slate-800 leading-snug">{ev.title}</p>
                        {ev.detail && <p className="text-xs text-slate-400">{ev.detail}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          </div>

          {/* ── Zone D Right ───────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Module Health — large rings */}
            <motion.section variants={fade} className="space-y-3">
              <h2 className="px-1 font-serif text-base font-bold text-slate-900 sm:text-lg">Module health</h2>

              {/* Jobs */}
              <Link href="/job-notifications" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md min-h-[88px]">
                <div className="relative shrink-0">
                  <LargeRing value={j.savedCount === 0 ? 0 : j.appliedCount} max={Math.max(j.savedCount, 1)} color="#3b82f6" track="#eff6ff" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-blue-600 tabular-nums">
                      {j.savedCount === 0 ? '—' : `${Math.round((j.appliedCount / j.savedCount) * 100)}%`}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">Job Notifications</p>
                  <p className="mt-0.5 text-xs text-slate-400 leading-snug">
                    {j.savedCount === 0 ? 'No jobs tracked yet' : `${j.savedCount} saved · ${j.appliedCount} applied`}
                    {j.selectedCount > 0 && ` · ${j.selectedCount} selected`}
                  </p>
                  {weeklyActivityDots.jobs.some(Boolean) && (
                    <div className="mt-2"><HeatDots dots={weeklyActivityDots.jobs} color="bg-blue-500" /></div>
                  )}
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>

              {/* Readiness */}
              <Link href="/placement-readiness" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md min-h-[88px]">
                <div className="relative shrink-0">
                  <LargeRing value={r.score} max={100} color="#10b981" track="#f0fdf4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-bold text-emerald-600 tabular-nums">{r.score > 0 ? `${r.score}%` : '—'}</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">Placement Readiness</p>
                  <p className="mt-0.5 text-xs text-slate-400 leading-snug">
                    {r.analysisCount === 0 ? 'Run a JD analysis to start' : `${r.prpStepsCompleted}/${r.prpStepsTotal} PRP steps done`}
                  </p>
                  {weeklyActivityDots.readiness.some(Boolean) && (
                    <div className="mt-2"><HeatDots dots={weeklyActivityDots.readiness} color="bg-emerald-500" /></div>
                  )}
                  {r.weakestSkillName && !weeklyActivityDots.readiness.some(Boolean) && (
                    <p className="mt-1 text-[11px] text-amber-600 font-medium">Focus: {r.weakestSkillName}</p>
                  )}
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>

              {/* Resume */}
              <Link href="/resume-builder" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-purple-200 hover:shadow-md min-h-[88px]">
                <div className="relative shrink-0">
                  <LargeRing value={res.hasResume ? 100 : 0} max={100} color="#a855f7" track="#faf5ff" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {res.hasResume
                      ? <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      : <span className="text-[11px] font-bold text-slate-400">—</span>}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">Resume Builder</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400 leading-snug">
                    {res.activeResumeName ?? 'No resume built yet'}
                  </p>
                  {res.versionCount > 0 && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {res.versionCount} version{res.versionCount !== 1 ? 's' : ''}{res.daysSinceLastEdit !== null ? ` · last edit ${res.daysSinceLastEdit === 0 ? 'today' : `${res.daysSinceLastEdit}d ago`}` : ''}
                    </p>
                  )}
                </div>
                <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.section>

            {/* Weekly Cadence with heatmap dots */}
            <motion.section variants={fade} className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="font-serif text-base font-bold text-slate-900">Weekly cadence</h2>
              <p className="mb-4 text-xs text-slate-400">Activity targets for this week</p>
              <div className="space-y-5">
                {[
                  { label: 'Applications sent', val: j.appliedThisWeek, target: 5, barCls: j.appliedThisWeek >= 5 ? 'bg-emerald-500' : 'bg-blue-500', dots: weeklyActivityDots.jobs, dotColor: 'bg-blue-400', delay: 0.2 },
                  { label: 'Practice sessions', val: r.interviewSessionsThisWeek, target: 3, barCls: r.interviewSessionsThisWeek >= 3 ? 'bg-emerald-500' : 'bg-emerald-400', dots: weeklyActivityDots.readiness, dotColor: 'bg-emerald-400', delay: 0.3 },
                  { label: 'PRP completion', val: r.prpStepsCompleted, target: r.prpStepsTotal, barCls: r.prpStepsCompleted >= r.prpStepsTotal ? 'bg-emerald-500' : r.prpStepsCompleted / r.prpStepsTotal > 0.5 ? 'bg-indigo-500' : 'bg-amber-400', dots: null, dotColor: '', delay: 0.4 },
                ].map(({ label, val, target, barCls, dots, dotColor, delay }) => (
                  <div key={label}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">{label}</span>
                      <span className="text-xs tabular-nums text-slate-400">{Math.min(val, target)}/{target}</span>
                    </div>
                    {dots && <div className="mb-2"><HeatDots dots={dots} color={dotColor} /></div>}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div className={cn('h-full rounded-full', barCls)}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((val / target) * 100, 100)}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut', delay }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* First-visit onboarding */}
            {isFirstVisit && (
              <motion.div variants={fade} className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-5 text-center">
                <p className="text-3xl">🚀</p>
                <p className="mt-2 font-serif font-bold text-slate-800">Start your journey</p>
                <p className="mt-1 text-xs text-slate-500">Three steps to unlock your Career Health Score.</p>
                <div className="mt-4 space-y-1 text-left">
                  {[
                    { step: '1', label: 'Build your resume',       href: '/resume-builder',      color: 'text-purple-600' },
                    { step: '2', label: 'Analyse a job description', href: '/placement-readiness', color: 'text-emerald-600' },
                    { step: '3', label: 'Save your first job',     href: '/job-notifications',   color: 'text-blue-600' },
                  ].map(({ step, label, href, color }) => (
                    <Link key={step} href={href}
                      className="flex min-h-[44px] items-center gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 active:scale-95">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{step}</span>
                      <span className={cn('text-sm font-semibold', color)}>{label} →</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>


    </>
  )
}
