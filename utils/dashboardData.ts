/**
 * dashboardData.ts
 * Single source of truth for all live data powering the Command Center dashboard.
 * Reads from localStorage keys used by each module — never writes.
 * SSR-safe: all localStorage access is guarded by typeof window checks.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string
  module: 'jobs' | 'readiness' | 'resume'
  title: string
  detail: string
  timestamp: number
}

export interface PriorityAction {
  urgency: 'high' | 'medium' | 'low'
  module: 'jobs' | 'readiness' | 'resume'
  title: string
  rationale: string
  href: string
  cta: string
}

export interface ModuleSnapshot {
  jobs: {
    savedCount: number
    appliedCount: number
    rejectedCount: number
    selectedCount: number
    appliedThisWeek: number
    lastActivityDaysAgo: number | null
  }
  readiness: {
    score: number
    prpStepsCompleted: number
    prpStepsTotal: number
    weakestSkillName: string | null
    analysisCount: number
    interviewSessionsThisWeek: number
  }
  resume: {
    activeResumeName: string | null
    versionCount: number
    daysSinceLastEdit: number | null
    hasResume: boolean
  }
}

export interface DashboardData {
  careerHealthScore: number      // 0–100 composite
  healthLabel: string            // "On Track" | "Good" | "Needs Work"
  jobsModule: ModuleSnapshot['jobs']
  readinessModule: ModuleSnapshot['readiness']
  resumeModule: ModuleSnapshot['resume']
  priorityActions: PriorityAction[]
  recentActivity: ActivityEvent[]
  isFirstVisit: boolean          // true when all localStorage keys are empty
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    if (!v) return fallback
    return JSON.parse(v) as T
  } catch {
    return fallback
  }
}

function safeString(key: string): string | null {
  if (typeof window === 'undefined') return null
  try { return localStorage.getItem(key) } catch { return null }
}

function daysSince(ts: number | string | null | undefined): number | null {
  if (!ts) return null
  const d = typeof ts === 'string' ? new Date(ts).getTime() : ts
  if (isNaN(d)) return null
  return Math.floor((Date.now() - d) / 86_400_000)
}

function isWithinLastDays(ts: number, days: number): boolean {
  return Date.now() - ts < days * 86_400_000
}

// ─── Module readers ───────────────────────────────────────────────────────────

function readJobsModule(): ModuleSnapshot['jobs'] & { lastActivityTs: number | null } {
  const savedJobs = safeJSON<unknown[]>('savedJobs', [])
  const statusMap = safeJSON<Record<string, string>>('jobTrackerStatus', {})
  const history = safeJSON<{ jobId: string; status: string; timestamp: number }[]>('jobStatusHistory', [])

  const appliedCount = Object.values(statusMap).filter(s => s === 'Applied').length
  const rejectedCount = Object.values(statusMap).filter(s => s === 'Rejected').length
  const selectedCount = Object.values(statusMap).filter(s => s === 'Selected').length

  const appliedThisWeek = history.filter(
    h => h.status === 'Applied' && isWithinLastDays(h.timestamp, 7)
  ).length

  const lastActivityTs = history.length > 0 ? history[0].timestamp : null

  return {
    savedCount: savedJobs.length,
    appliedCount,
    rejectedCount,
    selectedCount,
    appliedThisWeek,
    lastActivityDaysAgo: daysSince(lastActivityTs),
    lastActivityTs,
  }
}

function readReadinessModule(): ModuleSnapshot['readiness'] {
  // Read latest readiness analysis
  const latest = safeJSON<Record<string, unknown> | null>('placement_readiness_latest_v1', null)
  const history = safeJSON<unknown[]>('placement_readiness_history_v1', [])

  let score = 0
  let weakestSkillName: string | null = null

  if (latest && typeof latest === 'object') {
    const raw = latest as Record<string, unknown>
    if (typeof raw.overallScore === 'number') score = raw.overallScore
    else if (typeof raw.score === 'number') score = raw.score
    else if (typeof raw.readinessScore === 'number') score = raw.readinessScore

    // Try to pull weakest skill from extractedSkills or skill breakdown
    const skills = raw.extractedSkills as Record<string, unknown> | undefined
    if (skills) {
      const allCategories = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing']
      let minLen = Infinity
      allCategories.forEach(cat => {
        const arr = Array.isArray(skills[cat]) ? (skills[cat] as unknown[]) : []
        if (arr.length < minLen) { minLen = arr.length; weakestSkillName = cat }
      })
    }
  }

  // PRP step completion
  const prpState = safeJSON<Record<string, boolean>>('prp_step_completion_v1', {})
  const prpStepsTotal = 8
  const prpStepsCompleted = Object.values(prpState).filter(Boolean).length

  // Interview sessions this week
  const sessions = safeJSON<{ startedAt?: string; createdAt?: string }[]>(
    'placement-readiness-interview-sessions', []
  )
  const interviewSessionsThisWeek = sessions.filter(s => {
    const ts = new Date(s.startedAt ?? s.createdAt ?? 0).getTime()
    return isWithinLastDays(ts, 7)
  }).length

  return {
    score,
    prpStepsCompleted,
    prpStepsTotal,
    weakestSkillName,
    analysisCount: history.length,
    interviewSessionsThisWeek,
  }
}

function readResumeModule(): ModuleSnapshot['resume'] {
  const collection = safeJSON<{ resumes: { id: string; name: string; isActive: boolean; updatedAt: string }[]; activeResumeId: string | null }>(
    'resumeCollection', { resumes: [], activeResumeId: null }
  )

  const active = collection.resumes.find(r => r.id === collection.activeResumeId)
    ?? collection.resumes[0]
    ?? null

  return {
    activeResumeName: active?.name ?? null,
    versionCount: collection.resumes.length,
    daysSinceLastEdit: active ? daysSince(active.updatedAt) : null,
    hasResume: collection.resumes.length > 0,
  }
}

// ─── Activity feed ────────────────────────────────────────────────────────────

function buildActivityFeed(
  jobs: ReturnType<typeof readJobsModule>,
  resume: ModuleSnapshot['resume']
): ActivityEvent[] {
  const events: ActivityEvent[] = []

  // Job status history events (last 4)
  const history = safeJSON<{ jobId: string; status: string; timestamp: number }[]>('jobStatusHistory', [])
  history.slice(0, 4).forEach((h, i) => {
    const statusEmoji =
      h.status === 'Applied' ? 'Applied to' :
      h.status === 'Selected' ? '🎉 Selected for' :
      h.status === 'Rejected' ? 'Rejected from' : 'Updated'
    events.push({
      id: `job-${i}`,
      module: 'jobs',
      title: `${statusEmoji} a job`,
      detail: `Status marked as "${h.status}"`,
      timestamp: h.timestamp,
    })
  })

  // Interview sessions
  const sessions = safeJSON<{ startedAt?: string; createdAt?: string; questionId?: string }[]>(
    'placement-readiness-interview-sessions', []
  )
  sessions.slice(0, 2).forEach((s, i) => {
    const ts = new Date(s.startedAt ?? s.createdAt ?? 0).getTime()
    events.push({
      id: `session-${i}`,
      module: 'readiness',
      title: 'Completed practice session',
      detail: 'Interview preparation',
      timestamp: ts,
    })
  })

  // Resume last edit
  if (resume.activeResumeName && resume.daysSinceLastEdit !== null) {
    events.push({
      id: 'resume-0',
      module: 'resume',
      title: `Resume edited`,
      detail: `"${resume.activeResumeName}" last updated`,
      timestamp: Date.now() - (resume.daysSinceLastEdit ?? 0) * 86_400_000,
    })
  }

  // Latest analysis
  const latest = safeJSON<{ createdAt?: string } | null>('placement_readiness_latest_v1', null)
  if (latest?.createdAt) {
    events.push({
      id: 'analysis-0',
      module: 'readiness',
      title: 'Placement analysis run',
      detail: 'Job description analysed',
      timestamp: new Date(latest.createdAt).getTime(),
    })
  }

  return events
    .filter(e => e.timestamp > 0)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)
}

// ─── Priority actions ─────────────────────────────────────────────────────────

function computePriorityActions(
  jobs: ModuleSnapshot['jobs'],
  readiness: ModuleSnapshot['readiness'],
  resume: ModuleSnapshot['resume'],
): PriorityAction[] {
  const actions: Array<PriorityAction & { weight: number }> = []

  // No resume yet
  if (!resume.hasResume) {
    actions.push({
      urgency: 'high', module: 'resume', weight: 100,
      title: 'Build your first resume',
      rationale: 'Recruiters need a resume before you can apply. Start with a template — takes 10 minutes.',
      href: '/resume-builder', cta: 'Build Resume →',
    })
  }

  // Resume stale (>14 days)
  if (resume.hasResume && (resume.daysSinceLastEdit ?? 0) > 14) {
    actions.push({
      urgency: 'medium', module: 'resume', weight: 70,
      title: `Resume hasn't been touched in ${resume.daysSinceLastEdit} days`,
      rationale: 'A stale resume loses relevance. Update your latest experience and skills.',
      href: '/resume-builder', cta: 'Update Resume →',
    })
  }

  // No readiness analysis yet
  if (readiness.analysisCount === 0) {
    actions.push({
      urgency: 'high', module: 'readiness', weight: 95,
      title: 'Run your first readiness analysis',
      rationale: 'Paste a target job description to instantly see your skill gap and a study plan.',
      href: '/placement-readiness', cta: 'Analyse Now →',
    })
  }

  // Low readiness score
  if (readiness.score > 0 && readiness.score < 60) {
    actions.push({
      urgency: 'high', module: 'readiness', weight: 90,
      title: `Readiness score is ${readiness.score}% — needs work`,
      rationale: `Your placement readiness is below 60%. Focus on ${readiness.weakestSkillName ?? 'weak areas'} to close the gap.`,
      href: '/placement-readiness/practice', cta: 'Practice Now →',
    })
  }

  // No practice this week
  if (readiness.interviewSessionsThisWeek === 0 && readiness.analysisCount > 0) {
    actions.push({
      urgency: 'medium', module: 'readiness', weight: 65,
      title: 'No interview practice this week',
      rationale: 'Consistency is key. 20 minutes of practice per day compounds dramatically over time.',
      href: '/placement-readiness/practice', cta: 'Practice →',
    })
  }

  // No jobs applied yet
  if (jobs.savedCount === 0) {
    actions.push({
      urgency: 'medium', module: 'jobs', weight: 80,
      title: 'Start tracking job opportunities',
      rationale: 'Save and track roles to measure your application pipeline and match rate.',
      href: '/job-notifications', cta: 'Browse Jobs →',
    })
  }

  // Applied to nothing despite saving jobs
  if (jobs.savedCount > 0 && jobs.appliedCount === 0) {
    actions.push({
      urgency: 'high', module: 'jobs', weight: 85,
      title: `${jobs.savedCount} saved jobs — zero applications`,
      rationale: 'Saving is not applying. Mark jobs as Applied to track your pipeline.',
      href: '/job-notifications', cta: 'Apply Now →',
    })
  }

  // Inactive in jobs (>7 days)
  if (jobs.savedCount > 0 && (jobs.lastActivityDaysAgo ?? 0) > 7) {
    actions.push({
      urgency: 'medium', module: 'jobs', weight: 60,
      title: `No job activity for ${jobs.lastActivityDaysAgo} days`,
      rationale: 'Consistent application cadence (3–5 /week) significantly improves callback rates.',
      href: '/job-notifications', cta: 'Browse Jobs →',
    })
  }

  // PRP behind
  if (readiness.prpStepsCompleted < readiness.prpStepsTotal && readiness.prpStepsCompleted > 0) {
    const remaining = readiness.prpStepsTotal - readiness.prpStepsCompleted
    actions.push({
      urgency: remaining > 4 ? 'high' : 'medium', module: 'readiness', weight: 55,
      title: `${remaining} PRP steps still incomplete`,
      rationale: 'Completing your Placement Readiness Program unlocks your verified placement proof.',
      href: '/placement-readiness/ship-gate', cta: 'Continue PRP →',
    })
  }

  return actions
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(({ weight: _w, ...rest }) => rest)
}

// ─── Health score ─────────────────────────────────────────────────────────────

function computeHealthScore(
  jobs: ModuleSnapshot['jobs'],
  readiness: ModuleSnapshot['readiness'],
  resume: ModuleSnapshot['resume'],
): number {
  // Readiness: 35%
  const readinessComponent = (readiness.score / 100) * 35

  // Resume: 25% — exists=10, completeness proxy via days-since: fresh=15
  const resumeComponent = resume.hasResume
    ? 10 + Math.max(0, 15 - ((resume.daysSinceLastEdit ?? 30) > 30 ? 15 : (resume.daysSinceLastEdit ?? 15)))
    : 0

  // Job activity: 25% — based on applied count & recency
  let jobComponent = 0
  if (jobs.savedCount > 0) jobComponent += 5
  if (jobs.appliedCount > 0) jobComponent += Math.min(15, jobs.appliedCount * 3)
  if ((jobs.lastActivityDaysAgo ?? 99) < 7) jobComponent += 5

  // Practice: 15% — sessions this week
  const practiceComponent = Math.min(15, readiness.interviewSessionsThisWeek * 5)

  return Math.min(100, Math.round(readinessComponent + resumeComponent + jobComponent + practiceComponent))
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function getDashboardData(): DashboardData {
  const jobsRaw = readJobsModule()
  const { lastActivityTs: _, ...jobs } = jobsRaw
  const readiness = readReadinessModule()
  const resume = readResumeModule()

  const isFirstVisit =
    jobs.savedCount === 0 &&
    readiness.analysisCount === 0 &&
    !resume.hasResume

  const careerHealthScore = isFirstVisit ? 0 : computeHealthScore(jobs, readiness, resume)
  const healthLabel =
    careerHealthScore >= 75 ? 'On Track' :
    careerHealthScore >= 50 ? 'Good' :
    careerHealthScore > 0 ? 'Needs Work' : 'Get Started'

  const priorityActions = computePriorityActions(jobs, readiness, resume)
  const recentActivity = buildActivityFeed(jobsRaw, resume)

  return {
    careerHealthScore,
    healthLabel,
    jobsModule: jobs,
    readinessModule: readiness,
    resumeModule: resume,
    priorityActions,
    recentActivity,
    isFirstVisit,
  }
}
