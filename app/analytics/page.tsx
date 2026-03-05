'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { getDashboardData, DashboardData } from '@/utils/dashboardData'
import { cn } from '@/utils/cn'

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightLevel = 'win' | 'warn' | 'info' | 'muted'
interface Insight { level: InsightLevel; headline: string; body: string }

// ─── Smart Insight Engine ────────────────────────────────────────────────────

function deriveInsights(d: DashboardData): Insight[] {
  const out: Insight[] = []
  const { jobsModule: j, readinessModule: r, resumeModule: res, scoreHistory, weeklyActivityDots } = d

  // Apply-rate insight
  if (j.savedCount > 0) {
    const rate = Math.round((j.appliedCount / j.savedCount) * 100)
    if (rate === 0)
      out.push({ level: 'warn', headline: `${j.savedCount} saved jobs, 0 applications`, body: `Saving is not applying. You need to mark jobs as Applied to build a pipeline. The industry benchmark is 40%+ conversion.` })
    else if (rate < 30)
      out.push({ level: 'warn', headline: `Apply rate is ${rate}% — below benchmark`, body: `Industry average is ~40%. You saved ${j.savedCount} jobs but only applied to ${j.appliedCount}. Prioritise and act on strong matches faster.` })
    else
      out.push({ level: 'win', headline: `Solid apply rate — ${rate}% of saved jobs`, body: `You're converting saved opportunities into applications at a healthy rate. ${j.appliedCount} applications logged so far.` })
  } else {
    out.push({ level: 'muted', headline: 'No jobs tracked yet', body: `Start saving and tracking jobs in the Jobs module to see your application funnel analytics here.` })
  }

  // Readiness trend
  if (scoreHistory.length >= 2) {
    const delta = scoreHistory[scoreHistory.length - 1] - scoreHistory[scoreHistory.length - 2]
    const span  = scoreHistory[scoreHistory.length - 1] - scoreHistory[0]
    if (span > 10)
      out.push({ level: 'win', headline: `Readiness up ${span} pts overall`, body: `Your score rose from ${scoreHistory[0]}% to ${scoreHistory[scoreHistory.length - 1]}% across ${scoreHistory.length} analyses. Consistent upward trajectory.` })
    else if (delta < -5)
      out.push({ level: 'warn', headline: `Score dropped ${Math.abs(delta)}% since last analysis`, body: `Recent decline may reflect a harder job description or knowledge gaps. Focus on your weakest area: ${r.weakestSkillName ?? 'core CS'}.` })
    else
      out.push({ level: 'info', headline: `Readiness holding at ${r.score}%`, body: `Scores are relatively flat — try analysing different job descriptions to expose new skill gaps and keep improving.` })
  } else if (r.score > 0) {
    out.push({ level: 'info', headline: 'Run more analyses to see your trend', body: `You've completed ${r.analysisCount} analysis. Run at least 2 to compare scores over time.` })
  }

  // Consistency
  const activeDays = weeklyActivityDots.jobs.map((j, i) => j || weeklyActivityDots.readiness[i]).filter(Boolean).length
  if (activeDays >= 5)
    out.push({ level: 'win', headline: `${activeDays}/7-day active streak this week`, body: `High consistency. Daily habits — even 20 minutes — compound far more than weekend cramming sessions.` })
  else if (activeDays === 0 && !d.isFirstVisit)
    out.push({ level: 'warn', headline: `No activity logged this week`, body: `Your stats show progress in the past but nothing this week. Re-engage: apply to one job, run one practice session.` })
  else if (activeDays <= 2 && !d.isFirstVisit)
    out.push({ level: 'warn', headline: `Only ${activeDays}/7 days active this week`, body: `Low consistency lowers your placement odds. Aim for at least 4–5 active days per week across jobs and readiness practice.` })

  // Resume freshness
  if (res.hasResume && (res.daysSinceLastEdit ?? 0) > 21)
    out.push({ level: 'warn', headline: `Resume untouched for ${res.daysSinceLastEdit} days`, body: `Recruiters value timely and tailored resumes. Update your latest experience and skills before the next batch of applications.` })
  else if (!res.hasResume)
    out.push({ level: 'warn', headline: 'No resume on file', body: `All your job and readiness work means nothing without a resume. Build one in the Resume Builder — you can start from a template in minutes.` })

  // PRP progress
  if (r.prpStepsCompleted > 0 && r.prpStepsCompleted < r.prpStepsTotal) {
    const rem = r.prpStepsTotal - r.prpStepsCompleted
    out.push({ level: 'info', headline: `${rem} PRP steps remaining`, body: `You completed ${r.prpStepsCompleted}/${r.prpStepsTotal} Placement Readiness Program steps. Finishing earns you the Ship Gate verification badge.` })
  }

  return out.slice(0, 5)
}

// ─── Funnel ───────────────────────────────────────────────────────────────────

function FunnelChart({
  stages,
}: {
  stages: { label: string; count: number; color: string; bg: string }[]
}) {
  const max = stages[0]?.count || 1
  return (
    <div className="space-y-2">
      {stages.map((s, i) => {
        const pct = max > 0 && s.count > 0 ? Math.max(18, Math.round((s.count / max) * 100)) : 0
        const conv = i > 0 && stages[i - 1].count > 0
          ? Math.round((s.count / stages[i - 1].count) * 100) : null
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                  {s.label}
                  {conv !== null && (
                    <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase',
                      conv >= 40 ? 'bg-emerald-100 text-emerald-700' : conv > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600')}>
                      {conv}% conv
                    </span>
                  )}
                </span>
                <span className={cn('font-bold tabular-nums text-sm', s.color)}>{s.count}</span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded-lg bg-slate-100">
                <motion.div
                  className={cn('h-6 rounded-lg flex items-center pl-2', s.bg)}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.12 }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Module Meter ─────────────────────────────────────────────────────────────

function ModuleMeter({ label, score, color, trackColor, detail }: {
  label: string; score: number; color: string; trackColor: string; detail: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <span className="text-sm font-bold text-slate-800">{label}</span>
        <span className={cn('font-mono text-2xl font-bold tabular-nums leading-none', color)}>{score}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className={cn('h-3 rounded-full', trackColor)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] text-slate-400">{detail}</p>
    </div>
  )
}

// ─── Sparkline with analysis ──────────────────────────────────────────────────

function TrendAnalysis({ values }: { values: number[] }) {
  if (values.length < 2) return (
    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
      Run 2+ analyses in Readiness to see your score trend
    </div>
  )

  const W = 320, H = 72
  const mn = Math.min(...values) - 5, mx = Math.max(...values) + 5
  const range = (mx - mn) || 1

  const pts = values.map((v, i) => {
    const x = 12 + (i / (values.length - 1)) * (W - 24)
    const y = 8 + (1 - (v - mn) / range) * (H - 20)
    return [x, y] as [number, number]
  })

  const polyline = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${pts[0][0]},${H} ` + pts.map(([x, y]) => `${x},${y}`).join(' ') + ` ${pts[pts.length - 1][0]},${H}`

  const best = Math.max(...values)
  const avg  = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  const last  = values[values.length - 1]
  const trend = last - values[values.length - 2]

  return (
    <div className="space-y-3">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible" style={{ height: 72 }}>
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#tg)" />
        <polyline points={polyline} fill="none" stroke="#6366f1" strokeWidth={2.5}
          strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => {
          const isLast = i === pts.length - 1
          return <circle key={i} cx={x} cy={y} r={isLast ? 5 : 3}
            fill={isLast ? (trend >= 0 ? '#10b981' : '#f59e0b') : '#818cf8'}
            opacity={isLast ? 1 : 0.55} />
        })}
        <text x={pts[0][0]} y={H} textAnchor="middle" fontSize={8} fill="#94a3b8">{values[0]}%</text>
        <text x={pts[pts.length - 1][0]} y={H} textAnchor="middle" fontSize={8} fill="#94a3b8">{last}%</text>
      </svg>
      <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50">
        {[
          { label: 'Latest', val: `${last}%`, sub: trend >= 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`, subColor: trend >= 0 ? 'text-emerald-500' : 'text-amber-500' },
          { label: 'Best',   val: `${best}%`, sub: `peak`, subColor: 'text-indigo-500' },
          { label: 'Avg',    val: `${avg}%`,  sub: `${values.length} runs`, subColor: 'text-slate-400' },
        ].map(c => (
          <div key={c.label} className="flex flex-col items-center py-2.5 px-1">
            <span className="font-mono text-lg font-bold text-slate-800">{c.val}</span>
            <span className="text-[10px] font-semibold text-slate-500">{c.label}</span>
            <span className={cn('text-[9px]', c.subColor)}>{c.sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 14-Day Grid ─────────────────────────────────────────────────────────────

function ActivityGrid({ dots }: { dots: { jobs: boolean[]; readiness: boolean[] } }) {
  // Show last 14 days = current week + previous week (approximate from 7-day data with repetition)
  // weeklyActivityDots only gives 7 days; display them clearly
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))

  const labels = DAYS.map((_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d.getDate().toString()
  })

  return (
    <div className="space-y-3">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1.5 px-0.5">
        {DAYS.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium text-slate-400">{d[0]}</span>
            <span className="text-[9px] text-slate-300">{labels[i]}</span>
          </div>
        ))}
      </div>
      {/* Jobs row */}
      <div>
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Jobs</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {dots.jobs.map((active, i) => (
            <motion.div key={i}
              className={cn('h-7 rounded-md', active ? 'bg-blue-400' : 'bg-slate-100')}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              title={active ? 'Active' : 'No activity'}
            />
          ))}
        </div>
      </div>
      {/* Readiness row */}
      <div>
        <div className="mb-1 flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Readiness</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {dots.readiness.map((active, i) => (
            <motion.div key={i}
              className={cn('h-7 rounded-md', active ? 'bg-emerald-400' : 'bg-slate-100')}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.28 + i * 0.04 }}
              title={active ? 'Active' : 'No activity'}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] text-slate-400">
        {[
          { color: 'bg-blue-400',    label: 'Job activity' },
          { color: 'bg-emerald-400', label: 'Practice session' },
          { color: 'bg-slate-100 border border-slate-200', label: 'No activity' },
        ].map(l => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className={cn('inline-block h-3 w-3 rounded-sm', l.color)} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

const INSIGHT_STYLE: Record<InsightLevel, { bar: string; bg: string; icon: string; text: string; sub: string }> = {
  win:  { bar: 'bg-emerald-500', bg: 'bg-emerald-50',  icon: '✓', text: 'text-emerald-800', sub: 'text-emerald-600' },
  warn: { bar: 'bg-amber-500',   bg: 'bg-amber-50',    icon: '!', text: 'text-amber-900',   sub: 'text-amber-700'  },
  info: { bar: 'bg-indigo-400',  bg: 'bg-indigo-50/60', icon: 'i', text: 'text-indigo-900',  sub: 'text-indigo-700' },
  muted:{ bar: 'bg-slate-300',   bg: 'bg-slate-50',    icon: '·', text: 'text-slate-700',   sub: 'text-slate-500'  },
}

function InsightCard({ insight, delay = 0 }: { insight: Insight; delay?: number }) {
  const s = INSIGHT_STYLE[insight.level]
  return (
    <motion.div
      className={cn('overflow-hidden rounded-xl border border-slate-100 shadow-sm flex', s.bg)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className={cn('w-1 shrink-0', s.bar)} />
      <div className="flex gap-3 px-4 py-3.5">
        <div className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white', s.bar)}>
          {s.icon}
        </div>
        <div>
          <p className={cn('text-xs font-bold leading-snug', s.text)}>{insight.headline}</p>
          <p className={cn('mt-0.5 text-[11px] leading-relaxed', s.sub)}>{insight.body}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-16 rounded-xl bg-slate-800" />
      <div className="grid grid-cols-3 gap-3">
        {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-slate-200" />)}
      </div>
      <div className="h-48 rounded-xl bg-slate-200" />
      <div className="h-36 rounded-xl bg-slate-200" />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => { setData(getDashboardData()) }, [])

  const insights = useMemo(() => data ? deriveInsights(data) : [], [data])

  if (!data) return <Skeleton />

  const { jobsModule: j, readinessModule: r, resumeModule: res, scoreHistory, weeklyActivityDots } = data

  // Module scores (different formula from health score — isolated per module)
  const jobScore = Math.min(100,
    j.savedCount === 0 ? 0 :
    Math.round((j.appliedCount / Math.max(j.savedCount, 1)) * 60 + (j.selectedCount * 10) + Math.min(30, j.appliedThisWeek * 6))
  )
  const readinessScore = r.score
  const resumeScore = !res.hasResume ? 0 :
    (res.daysSinceLastEdit ?? 99) <= 7   ? 100 :
    (res.daysSinceLastEdit ?? 99) <= 14  ? 80  :
    (res.daysSinceLastEdit ?? 99) <= 30  ? 50  : 20

  const activeDays = weeklyActivityDots.jobs.map((jd, i) => jd || weeklyActivityDots.readiness[i]).filter(Boolean).length

  return (
    <div className="space-y-5 pb-2">

      {/* ── Slim dark header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-5 py-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#312e81_0%,_transparent_60%)] opacity-60" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Placement Intelligence</p>
            <h1 className="mt-0.5 font-mono text-lg font-bold text-white sm:text-xl">Data Report</h1>
            <p className="mt-0.5 text-[10px] text-slate-400">
              Live · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3 text-right">
            <div>
              <p className="font-mono text-2xl font-bold text-white tabular-nums">{data.careerHealthScore}</p>
              <p className="text-[10px] text-slate-400">health score</p>
            </div>
            <div className="flex flex-col justify-center gap-1">
              <div className={cn('h-2.5 w-2.5 rounded-full', data.careerHealthScore >= 75 ? 'bg-emerald-400' : data.careerHealthScore >= 50 ? 'bg-amber-400' : data.careerHealthScore > 0 ? 'bg-red-400' : 'bg-slate-600')} />
            </div>
          </div>
        </div>
        {/* activation bar */}
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-slate-700">
          <motion.div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-400 to-emerald-400"
            initial={{ width: 0 }} animate={{ width: `${data.careerHealthScore}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }} />
        </div>
        <div className="relative mt-1 flex justify-between text-[9px] text-slate-500">
          <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
        </div>
      </div>

      {/* ── Insights ─────────────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Smart Insights · {insights.length} findings</p>
        <div className="space-y-2.5">
          {insights.map((ins, i) => (
            <InsightCard key={i} insight={ins} delay={i * 0.08} />
          ))}
        </div>
      </div>

      {/* ── Module Strength vs Application Funnel ─────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Module Scores */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Module Strength</p>
          <p className="mb-4 text-xs text-slate-500">How each area is performing independently</p>
          <div className="space-y-5">
            <ModuleMeter label="💼 Jobs Pipeline" score={jobScore} color="text-blue-600"
              trackColor="bg-blue-400"
              detail={`${j.appliedCount} applied · ${j.selectedCount} selected · ${j.appliedThisWeek} this week`} />
            <ModuleMeter label="🎯 Placement Readiness" score={readinessScore} color="text-emerald-600"
              trackColor="bg-emerald-400"
              detail={`${r.analysisCount} analyses · ${r.interviewSessionsThisWeek} sessions this week`} />
            <ModuleMeter label="📄 Resume Freshness" score={resumeScore} color="text-purple-600"
              trackColor="bg-purple-400"
              detail={res.hasResume
                ? `v${res.versionCount} · last edited ${res.daysSinceLastEdit === 0 ? 'today' : `${res.daysSinceLastEdit}d ago`}`
                : 'No resume built yet'} />
          </div>
        </div>

        {/* Application Funnel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Application Funnel</p>
          <p className="mb-4 text-xs text-slate-500">How opportunities convert through your pipeline</p>
          <FunnelChart stages={[
            { label: 'Saved',    count: j.savedCount,    color: 'text-slate-600',   bg: 'bg-slate-400' },
            { label: 'Applied',  count: j.appliedCount,  color: 'text-blue-700',    bg: 'bg-blue-400' },
            { label: 'Selected', count: j.selectedCount, color: 'text-emerald-700', bg: 'bg-emerald-400' },
            { label: 'Rejected', count: j.rejectedCount, color: 'text-red-600',     bg: 'bg-red-300' },
          ]} />
          {j.savedCount === 0 && (
            <p className="mt-4 text-center text-[10px] text-slate-400">Start tracking jobs to see funnel data</p>
          )}
        </div>
      </div>

      {/* ── Score Trend Analysis ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Readiness Score Trend</p>
        <p className="mb-4 text-xs text-slate-500">
          Each point = one Placement Readiness analysis · highest is your target ceiling
        </p>
        <TrendAnalysis values={scoreHistory} />
        {scoreHistory.length >= 2 && r.weakestSkillName && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs">
            <span className="mt-0.5 text-amber-500">⚠</span>
            <p className="text-amber-800">
              Weakest skill area detected: <strong className="capitalize">{r.weakestSkillName}</strong>.
              Focus practice here to raise your ceiling.
            </p>
          </div>
        )}
      </div>

      {/* ── Weekly Activity Grid ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity Grid · This Week</p>
            <p className="mt-0.5 text-xs text-slate-500">Coloured = you did something that day</p>
          </div>
          <div className="text-right">
            <span className={cn('font-mono text-xl font-bold tabular-nums',
              activeDays >= 5 ? 'text-emerald-600' : activeDays >= 3 ? 'text-amber-600' : 'text-red-500')}>
              {activeDays}<span className="text-sm font-medium text-slate-400">/7</span>
            </span>
            <p className="text-[10px] text-slate-400">active days</p>
          </div>
        </div>
        <div className="mt-3">
          <ActivityGrid dots={weeklyActivityDots} />
        </div>
      </div>

      {/* ── Data summary bar ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: 'Total Jobs Saved',   val: j.savedCount,              suffix: '',    color: 'text-slate-800' },
          { label: 'Analyses Run',       val: r.analysisCount,            suffix: '',    color: 'text-indigo-700' },
          { label: 'Practice Sessions',  val: r.interviewSessionsThisWeek,suffix: ' wk', color: 'text-emerald-700' },
          { label: 'Resume Versions',    val: res.versionCount,           suffix: '',    color: 'text-purple-700' },
        ].map(stat => (
          <div key={stat.label}
            className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3.5 text-center">
            <p className={cn('font-mono text-2xl font-bold tabular-nums', stat.color)}>
              {stat.val}{stat.suffix}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
