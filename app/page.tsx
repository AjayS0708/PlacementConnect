'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getDashboardData, DashboardData, ActivityEvent, PriorityAction } from '@/utils/dashboardData'
import { cn } from '@/utils/cn'

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

// ─── Arc Gauge ────────────────────────────────────────────────────────────────

function ArcGauge({ score, size = 140 }: { score: number; size?: number }) {
  const anim = useCountUp(score)
  const R = 52
  const cx = size / 2
  const cy = size / 2 + 10
  const startAngle = -210
  const totalArc = 240
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcPath = (from: number, to: number) => {
    const s = { x: cx + R * Math.cos(toRad(from)), y: cy + R * Math.sin(toRad(from)) }
    const e = { x: cx + R * Math.cos(toRad(to)), y: cy + R * Math.sin(toRad(to)) }
    const large = to - from > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`
  }
  const fillAngle = startAngle + (score / 100) * totalArc
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#3652ff' : score > 0 ? '#f59e0b' : '#cbd5e1'

  return (
    <svg width={size} height={size - 10} viewBox={`0 0 ${size} ${size}`} aria-label={`Career health score: ${score} out of 100`}>
      <path d={arcPath(startAngle, startAngle + totalArc)} fill="none" stroke="#e2e8f0" strokeWidth={10} strokeLinecap="round" />
      {score > 0 && (
        <motion.path
          d={arcPath(startAngle, fillAngle)}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize={score === 0 ? 20 : 28} fontWeight="700" fill={score === 0 ? '#94a3b8' : color} fontFamily="Fraunces, serif">
        {score === 0 ? '—' : anim}
      </text>
      {score > 0 && (
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize={11} fill="#94a3b8" fontFamily="Sora, sans-serif">/ 100</text>
      )}
    </svg>
  )
}

// ─── Urgency badge ────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency }: { urgency: PriorityAction['urgency'] }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
      urgency === 'high' ? 'bg-red-100 text-red-700' :
      urgency === 'medium' ? 'bg-amber-100 text-amber-700' :
      'bg-slate-100 text-slate-600'
    )}>
      {urgency}
    </span>
  )
}

// ─── Module tag ───────────────────────────────────────────────────────────────

function ModuleTag({ module }: { module: ActivityEvent['module'] }) {
  const cfg = {
    jobs:      { label: 'Jobs',      cls: 'bg-blue-100 text-blue-700' },
    readiness: { label: 'Readiness', cls: 'bg-emerald-100 text-emerald-700' },
    resume:    { label: 'Resume',    cls: 'bg-purple-100 text-purple-700' },
  }[module]
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cfg.cls)}>
      {cfg.label}
    </span>
  )
}

// ─── Module dot ───────────────────────────────────────────────────────────────

function ModuleDot({ module }: { module: ActivityEvent['module'] }) {
  const cls = {
    jobs:      'bg-blue-500',
    readiness: 'bg-emerald-500',
    resume:    'bg-purple-500',
  }[module]
  return <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', cls)} />
}

// ─── Slim ring for module cards ───────────────────────────────────────────────

function MiniRing({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const R = 18
  const circ = 2 * Math.PI * R
  const pct = Math.min(value / max, 1)
  return (
    <svg width={44} height={44} className="-rotate-90">
      <circle cx={22} cy={22} r={R} fill="none" stroke="#e2e8f0" strokeWidth={4} />
      <motion.circle
        cx={22} cy={22} r={R}
        fill="none" stroke={color} strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - pct) }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ─── Animated number ─────────────────────────────────────────────────────────

function AnimNum({ n }: { n: number }) {
  const v = useCountUp(n, 900)
  return <>{v}</>
}

// ─── Animation variants ───────────────────────────────────────────────────────

const fade = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.07 } } }

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    setData(getDashboardData())
  }, [])

  if (!data) {
    return (
      <div className="space-y-6 px-1 py-2 animate-pulse">
        <div className="h-40 rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-200" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
          <div className="h-96 rounded-2xl bg-slate-200" />
          <div className="h-96 rounded-2xl bg-slate-200" />
        </div>
      </div>
    )
  }

  const { careerHealthScore, healthLabel, jobsModule: j, readinessModule: r, resumeModule: res,
          priorityActions, recentActivity, isFirstVisit } = data

  const scoreColor = careerHealthScore >= 75 ? 'text-emerald-600' : careerHealthScore >= 50 ? 'text-blue-600' : careerHealthScore > 0 ? 'text-amber-600' : 'text-slate-400'
  const scoreBg    = careerHealthScore >= 75 ? 'bg-emerald-50 border-emerald-200' : careerHealthScore >= 50 ? 'bg-blue-50 border-blue-200' : careerHealthScore > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'

  return (
    <motion.div
      className="space-y-5 px-1 py-1"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Zone A — Command Header ─────────────────────────────────────────── */}
      <motion.section
        variants={fade}
        className="relative overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm"
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #3652ff 0%, transparent 65%), radial-gradient(circle at 10% 80%, #10b981 0%, transparent 55%)' }} />

        <div className="relative flex flex-col items-start justify-between gap-6 px-8 py-7 sm:flex-row sm:items-center">
          {/* Left — greeting */}
          <div>
            <p className="mb-1 text-sm font-medium text-slate-400 tracking-wide">{formatDate()}</p>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              {getGreeting()} 👋
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              {isFirstVisit
                ? 'Welcome to PlacementConnect. Set up your modules below to track your career readiness in one place.'
                : `Career health is ${healthLabel.toLowerCase()}. Here's what needs your attention today.`}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { label: 'Job Notifications', href: '/job-notifications', color: 'bg-blue-500' },
                { label: 'Placement Readiness', href: '/placement-readiness', color: 'bg-emerald-500' },
                { label: 'Resume Builder', href: '/resume-builder', color: 'bg-purple-500' },
                { label: 'Analytics', href: '/analytics', color: 'bg-amber-500' },
              ].map(({ label, href, color }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-95"
                >
                  <span className={cn('h-2 w-2 rounded-full', color)} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right — Career Health Score */}
          <div className={cn('flex shrink-0 flex-col items-center rounded-2xl border-2 px-7 py-5 text-center', scoreBg)}>
            <ArcGauge score={careerHealthScore} />
            <p className={cn('mt-1 text-sm font-bold', scoreColor)}>{healthLabel}</p>
            <p className="mt-0.5 text-xs text-slate-400">Career Health Score</p>
          </div>
        </div>
      </motion.section>

      {/* ── Zone B — Vital Stats Strip ──────────────────────────────────────── */}
      <motion.div variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Stat 1 — Jobs */}
        <motion.div variants={fade}>
          <Link href="/job-notifications" className="group block h-full rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-xl bg-blue-50 p-2.5">
                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span className="text-xs font-medium text-slate-400">this week: <span className="font-bold text-blue-600"><AnimNum n={j.appliedThisWeek} /></span></span>
            </div>
            <p className="text-3xl font-bold tabular-nums text-slate-900"><AnimNum n={j.savedCount} /></p>
            <p className="mt-0.5 text-sm font-medium text-slate-500">Opportunities Tracked</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: j.savedCount === 0 ? '0%' : `${Math.min(100, (j.appliedCount / Math.max(j.savedCount, 1)) * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-600"><AnimNum n={j.appliedCount} /></span> applied
              {j.selectedCount > 0 && <> · <span className="font-semibold text-emerald-600"><AnimNum n={j.selectedCount} /></span> selected</>}
            </p>
          </Link>
        </motion.div>

        {/* Stat 2 — Readiness */}
        <motion.div variants={fade}>
          <Link href="/placement-readiness" className="group block h-full rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-xl bg-emerald-50 p-2.5">
                <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </span>
              <span className="text-xs font-medium text-slate-400">PRP: <span className="font-bold text-emerald-600"><AnimNum n={r.prpStepsCompleted} /><span className="text-slate-400">/{r.prpStepsTotal}</span></span></span>
            </div>
            <p className="text-3xl font-bold tabular-nums text-slate-900">
              {r.score > 0 ? <><AnimNum n={r.score} /><span className="text-lg text-slate-400">%</span></> : '—'}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-500">Placement Readiness</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={cn('h-full rounded-full', r.score >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : r.score >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-amber-500 to-orange-400')}
                initial={{ width: 0 }}
                animate={{ width: `${r.score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {r.analysisCount > 0
                ? <><span className="font-semibold text-slate-600">{r.analysisCount}</span> analyse{r.analysisCount === 1 ? 'd' : 's'} · {r.interviewSessionsThisWeek} sessions this week</>
                : 'No analysis yet — paste a job description to start'}
            </p>
          </Link>
        </motion.div>

        {/* Stat 3 — Resume */}
        <motion.div variants={fade}>
          <Link href="/resume-builder" className="group block h-full rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-xl bg-purple-50 p-2.5">
                <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
              <span className="text-xs font-medium text-slate-400">
                {res.versionCount > 0 ? <><span className="font-bold text-purple-600"><AnimNum n={res.versionCount} /></span> version{res.versionCount !== 1 ? 's' : ''}</> : 'No resume'}
              </span>
            </div>
            <p className="truncate text-2xl font-bold text-slate-900">
              {res.activeResumeName ?? <span className="text-slate-300">—</span>}
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-500">Active Resume</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: res.hasResume ? '100%' : '0%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {res.daysSinceLastEdit !== null
                ? res.daysSinceLastEdit === 0 ? 'Edited today' : `Edited ${res.daysSinceLastEdit}d ago`
                : 'Build your first resume →'}
            </p>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Zone C + D — Two-column main ────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">

        {/* ── Zone C — Left ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Priority Actions */}
          <motion.section variants={fade} className="rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
            <div className="border-b-2 border-slate-100 px-6 py-4">
              <h2 className="font-serif text-lg font-bold text-slate-900">What matters now</h2>
              <p className="text-xs text-slate-400">Ranked by impact — smartly computed from your activity</p>
            </div>
            <div className="divide-y divide-slate-50">
              {priorityActions.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <div className="mb-3 text-4xl">🎯</div>
                  <p className="font-semibold text-slate-700">You&apos;re all caught up!</p>
                  <p className="mt-1 text-sm text-slate-400">No urgent actions right now. Keep up the momentum.</p>
                </div>
              ) : priorityActions.map((action, i) => {
                const icons: Record<string, React.ReactNode> = {
                  jobs:      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                  readiness: <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                  resume:    <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                }
                return (
                  <div key={i} className="flex items-start gap-4 px-6 py-5">
                    <div className="mt-0.5 shrink-0 rounded-xl bg-slate-50 p-2">
                      {icons[action.module]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <UrgencyBadge urgency={action.urgency} />
                        <span className="text-sm font-semibold text-slate-900">{action.title}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-500">{action.rationale}</p>
                    </div>
                    <Link
                      href={action.href}
                      className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-slate-700 active:scale-95"
                    >
                      {action.cta}
                    </Link>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* Activity Feed */}
          <motion.section variants={fade} className="rounded-2xl border-2 border-slate-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-slate-100 px-6 py-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-slate-900">Recent activity</h2>
                <p className="text-xs text-slate-400">Your latest actions across all modules</p>
              </div>
              <Link href="/analytics" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>
            </div>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-3 text-4xl">📋</div>
                <p className="font-semibold text-slate-700">No activity yet</p>
                <p className="mt-1 text-sm text-slate-400">Your actions in Jobs, Readiness and Resume will appear here.</p>
                <Link href="/job-notifications" className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
                  Explore Jobs →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {recentActivity.map((ev) => (
                  <li key={ev.id} className="flex items-start gap-3 px-6 py-4">
                    <ModuleDot module={ev.module} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ModuleTag module={ev.module} />
                        <span className="text-sm font-medium text-slate-800">{ev.title}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{ev.detail}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-400 tabular-nums">{relativeTime(ev.timestamp)}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        </div>

        {/* ── Zone D — Right ─────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Module Health */}
          <motion.section variants={fade} className="space-y-3">
            <h2 className="px-1 font-serif text-lg font-bold text-slate-900">Module health</h2>

            {/* Jobs */}
            <Link href="/job-notifications" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
              <div className="relative shrink-0">
                <MiniRing value={j.savedCount === 0 ? 0 : j.appliedCount} max={Math.max(j.savedCount, 1)} color="#3b82f6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-600 tabular-nums">{j.savedCount === 0 ? '—' : `${Math.round((j.appliedCount / j.savedCount) * 100)}%`}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Job Notifications</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {j.savedCount === 0 ? 'No jobs tracked yet' : `${j.savedCount} saved · ${j.appliedCount} applied`}
                  {j.selectedCount > 0 && ` · ${j.selectedCount} selected`}
                </p>
                {j.lastActivityDaysAgo !== null && (
                  <p className="mt-1 text-[11px] text-slate-400">Last activity {j.lastActivityDaysAgo === 0 ? 'today' : `${j.lastActivityDaysAgo}d ago`}</p>
                )}
              </div>
              <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Readiness */}
            <Link href="/placement-readiness" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md">
              <div className="relative shrink-0">
                <MiniRing value={r.score} max={100} color="#10b981" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-emerald-600 tabular-nums">{r.score > 0 ? `${r.score}%` : '—'}</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Placement Readiness</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {r.analysisCount === 0 ? 'Run a JD analysis to see your score' : `${r.prpStepsCompleted}/${r.prpStepsTotal} PRP steps done`}
                </p>
                {r.weakestSkillName && (
                  <p className="mt-1 text-[11px] text-amber-600">Focus area: {r.weakestSkillName}</p>
                )}
              </div>
              <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Resume */}
            <Link href="/resume-builder" className="group flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-purple-200 hover:shadow-md">
              <div className="relative shrink-0">
                <MiniRing value={res.hasResume ? 100 : 0} max={100} color="#a855f7" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {res.hasResume
                    ? <svg className="h-3.5 w-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <span className="text-[10px] font-bold text-slate-400">—</span>}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">Resume Builder</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {res.activeResumeName ?? 'No resume built yet'}
                </p>
                {res.versionCount > 0 && (
                  <p className="mt-1 text-[11px] text-slate-400">{res.versionCount} version{res.versionCount !== 1 ? 's' : ''}{res.daysSinceLastEdit !== null ? ` · last edit ${res.daysSinceLastEdit === 0 ? 'today' : `${res.daysSinceLastEdit}d ago`}` : ''}</p>
                )}
              </div>
              <svg className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.section>

          {/* Weekly Cadence */}
          <motion.section variants={fade} className="rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-base font-bold text-slate-900">Weekly cadence</h2>
            <p className="mb-4 text-xs text-slate-400">Activity targets for this week</p>
            <div className="space-y-4">
              {[
                { label: 'Applications sent', val: j.appliedThisWeek, target: 5, cls: j.appliedThisWeek >= 5 ? 'bg-emerald-500' : 'bg-blue-500', delay: 0.2 },
                { label: 'Practice sessions', val: r.interviewSessionsThisWeek, target: 3, cls: r.interviewSessionsThisWeek >= 3 ? 'bg-emerald-500' : 'bg-emerald-400', delay: 0.3 },
                { label: 'PRP completion', val: r.prpStepsCompleted, target: r.prpStepsTotal, cls: r.prpStepsCompleted >= r.prpStepsTotal ? 'bg-emerald-500' : r.prpStepsCompleted / r.prpStepsTotal > 0.5 ? 'bg-indigo-500' : 'bg-amber-400', delay: 0.4 },
              ].map(({ label, val, target, cls, delay }) => (
                <div key={label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                    <span className="text-xs tabular-nums text-slate-400">{Math.min(val, target)}/{target}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      className={cn('h-full rounded-full', cls)}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((val / target) * 100, 100)}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* First-visit onboarding */}
          {isFirstVisit && (
            <motion.div variants={fade} className="rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center">
              <p className="text-2xl">🚀</p>
              <p className="mt-2 font-serif font-bold text-slate-800">Start your placement journey</p>
              <p className="mt-1 text-xs text-slate-500">Complete these three steps to unlock your career health score.</p>
              <div className="mt-4 space-y-2 text-left">
                {[
                  { step: '1', label: 'Build your resume', href: '/resume-builder', color: 'text-purple-600' },
                  { step: '2', label: 'Analyse a job description', href: '/placement-readiness', color: 'text-emerald-600' },
                  { step: '3', label: 'Save your first job', href: '/job-notifications', color: 'text-blue-600' },
                ].map(({ step, label, href, color }) => (
                  <Link key={step} href={href} className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-slate-50">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">{step}</span>
                    <span className={cn('text-sm font-semibold', color)}>{label} →</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
