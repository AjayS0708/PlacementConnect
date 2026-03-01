'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  collectAnalyticsData,
  getRecentActivities,
  type AnalyticsData,
  type ActivityLogEntry,
} from '@/utils/analytics';

interface AnalyticsDashboardProps {
  className?: string;
}

const ACTIVITY_ICONS: Record<ActivityLogEntry['type'], string> = {
  job_applied: '📝',
  job_saved: '💾',
  resume_updated: '📄',
  skill_assessed: '🎯',
  question_practiced: '💬',
  analysis_completed: '✅',
};

const ACTIVITY_COLORS: Record<ActivityLogEntry['type'], string> = {
  job_applied: 'bg-blue-100 text-blue-700 border-blue-300',
  job_saved: 'bg-green-100 text-green-700 border-green-300',
  resume_updated: 'bg-purple-100 text-purple-700 border-purple-300',
  skill_assessed: 'bg-amber-100 text-amber-700 border-amber-300',
  question_practiced: 'bg-pink-100 text-pink-700 border-pink-300',
  analysis_completed: 'bg-teal-100 text-teal-700 border-teal-300',
};

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    const data = collectAnalyticsData();
    const activities = getRecentActivities(10);
    setAnalytics(data);
    setRecentActivities(activities);
  }, []);

  if (!analytics) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 text-center shadow-elevation-2">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500" />
          <p className="mt-4 text-sm text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const jobsProgress = analytics.jobs.applied > 0
    ? (analytics.jobs.applied / Math.max(analytics.jobs.total, 1)) * 100
    : 0;

  const interviewProgress = (analytics.interviews.practiced / analytics.interviews.totalQuestions) * 100;

  const skillsProgress = analytics.skills.assessed > 0
    ? (analytics.skills.averageScore / 5) * 100
    : 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-elevation-3">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-3xl shadow-lg">
            📊
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Track your placement preparation progress across all modules
            </p>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="💼"
          label="Job Applications"
          value={analytics.jobs.applied.toString()}
          total={analytics.jobs.total}
          progress={jobsProgress}
          color="blue"
        />
        <StatCard
          icon="📄"
          label="Resume Versions"
          value={analytics.resume.totalResumes.toString()}
          subtitle="Active resumes"
          color="purple"
        />
        <StatCard
          icon="🎯"
          label="Skills Assessed"
          value={`${analytics.skills.averageScore.toFixed(1)}/5`}
          progress={skillsProgress}
          color="amber"
        />
        <StatCard
          icon="💬"
          label="Interview Prep"
          value={`${analytics.interviews.practiced}/${analytics.interviews.totalQuestions}`}
          progress={interviewProgress}
          color="pink"
        />
      </div>

      {/* Activity Streak */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-elevation-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Activity Streak
              </p>
              <p className="mt-2 text-4xl font-bold text-indigo-700">
                {analytics.activity.streakDays}
              </p>
              <p className="mt-1 text-sm text-slate-600">consecutive days</p>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{analytics.activity.activeDays} active days total</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-elevation-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                Match Score
              </p>
              <p className="mt-2 text-4xl font-bold text-emerald-700">
                {analytics.jobs.averageMatchScore.toFixed(0)}%
              </p>
              <p className="mt-1 text-sm text-slate-600">average across {analytics.jobs.matched} jobs</p>
            </div>
            <div className="text-6xl">🎯</div>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
              style={{ width: `${analytics.jobs.averageMatchScore}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* Skills Overview */}
      {analytics.skills.topSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
        >
          <h2 className="text-xl font-bold text-slate-900">Skills Overview</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-600">
                💪 Top Skills
              </h3>
              <div className="space-y-2">
                {analytics.skills.topSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-bold text-green-600">{skill.score.toFixed(1)}/5</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-600">
                📈 Areas to Improve
              </h3>
              <div className="space-y-2">
                {analytics.skills.weakSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-bold text-amber-600">{skill.score.toFixed(1)}/5</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
      >
        <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
        {recentActivities.length === 0 ? (
          <div className="mt-6 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">No recent activity</p>
            <p className="mt-1 text-xs text-slate-500">Start using the app to see your activity here</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentActivities.map((activity, idx) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 rounded-lg border-2 border-slate-100 bg-slate-50 p-3 transition-all hover:border-slate-200 hover:shadow-sm"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 text-xl',
                    ACTIVITY_COLORS[activity.type]
                  )}
                >
                  {ACTIVITY_ICONS[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{activity.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle?: string;
  total?: number;
  progress?: number;
  color: 'blue' | 'purple' | 'amber' | 'pink';
}

function StatCard({ icon, label, value, subtitle, total, progress, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 text-blue-700',
    purple: 'from-purple-50 to-pink-50 text-purple-700',
    amber: 'from-amber-50 to-orange-50 text-amber-700',
    pink: 'from-pink-50 to-rose-50 text-pink-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'rounded-2xl border-2 border-slate-200 bg-gradient-to-br p-5 shadow-elevation-2',
        colorClasses[color]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-600">{subtitle}</p>}
          {total !== undefined && (
            <p className="mt-1 text-xs text-slate-600">of {total} total</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-2 w-full rounded-full bg-white/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-slate-600 to-slate-800"
          />
        </div>
      )}
    </motion.div>
  );
}
