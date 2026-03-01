'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  getActivityLog,
  getActivitiesByType,
  clearActivityLog,
  type ActivityLogEntry,
} from '@/utils/analytics';

interface ActivityTimelineProps {
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
  job_applied: 'from-blue-500 to-indigo-500',
  job_saved: 'from-green-500 to-emerald-500',
  resume_updated: 'from-purple-500 to-pink-500',
  skill_assessed: 'from-amber-500 to-orange-500',
  question_practiced: 'from-pink-500 to-rose-500',
  analysis_completed: 'from-teal-500 to-cyan-500',
};

const ACTIVITY_LABELS: Record<ActivityLogEntry['type'], string> = {
  job_applied: 'Job Application',
  job_saved: 'Job Saved',
  resume_updated: 'Resume Updated',
  skill_assessed: 'Skill Assessment',
  question_practiced: 'Question Practice',
  analysis_completed: 'Analysis Completed',
};

export function ActivityTimeline({ className }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLogEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<ActivityLogEntry['type'] | 'all'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(getActivitiesByType(selectedFilter));
    }
  }, [selectedFilter, activities]);

  const loadActivities = () => {
    const log = getActivityLog();
    setActivities(log);
    setFilteredActivities(log);
  };

  const handleClearAll = () => {
    clearActivityLog();
    setActivities([]);
    setFilteredActivities([]);
    setShowClearConfirm(false);
  };

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityLogEntry[]>);

  const sortedDates = Object.keys(groupedActivities).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Filters */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-elevation-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Activity Timeline</h2>
            <p className="mt-1 text-sm text-slate-600">
              {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'}
            </p>
          </div>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={activities.length === 0}
            className="flex items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-semibold transition-all',
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            )}
          >
            All ({activities.length})
          </button>
          {(['job_applied', 'job_saved', 'resume_updated', 'skill_assessed', 'question_practiced', 'analysis_completed'] as const).map(
            (type) => {
              const count = activities.filter((a) => a.type === type).length;
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedFilter(type)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all',
                    selectedFilter === type
                      ? 'bg-gradient-to-r text-white shadow-md ' + ACTIVITY_COLORS[type]
                      : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  )}
                >
                  <span>{ACTIVITY_ICONS[type]}</span>
                  <span>{ACTIVITY_LABELS[type]}</span>
                  <span className="ml-1 text-xs">({count})</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowClearConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-[60] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900">Clear Activity Log?</h3>
              <p className="mt-2 text-sm text-slate-600">
                This will permanently delete all {activities.length} activities from your log. This action
                cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleClearAll}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Timeline */}
      {filteredActivities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center"
        >
          <div className="text-6xl opacity-50">📊</div>
          <p className="mt-4 text-sm font-medium text-slate-600">No activities yet</p>
          <p className="mt-1 text-xs text-slate-500">
            {selectedFilter === 'all'
              ? 'Start using the app to see your activity timeline'
              : `No ${ACTIVITY_LABELS[selectedFilter]} activities found`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date, dateIdx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIdx * 0.05 }}
            >
              {/* Date Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 px-3 py-1.5 text-sm font-bold text-white shadow-md">
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
              </div>

              {/* Activities for this date */}
              <div className="relative space-y-4 pl-8">
                {/* Timeline line */}
                <div className="absolute left-2 top-0 h-full w-0.5 bg-gradient-to-b from-purple-200 via-pink-200 to-transparent" />

                {groupedActivities[date].map((activity, activityIdx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: activityIdx * 0.03 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        'absolute -left-6 top-3 h-5 w-5 rounded-full bg-gradient-to-br shadow-md',
                        ACTIVITY_COLORS[activity.type]
                      )}
                    />

                    {/* Activity Card */}
                    <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xl shadow-md',
                            ACTIVITY_COLORS[activity.type]
                          )}
                        >
                          {ACTIVITY_ICONS[activity.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-900">{activity.title}</p>
                              <p className="mt-0.5 text-sm text-slate-600">{activity.description}</p>
                            </div>
                            <span className="flex-shrink-0 text-xs text-slate-500">
                              {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
