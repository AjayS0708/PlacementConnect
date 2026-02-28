'use client';

import { useMemo, useState } from 'react';
import {
  loadAssessments,
  saveAssessments,
  summarizeAssessments,
  type AssessmentItem,
  type AssessmentStatus,
} from '@/features/placement-readiness/lib/assessments';
import { getSelectedOrLatestAnalysis } from '@/features/placement-readiness/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/placement-readiness/components/ui/card';

type AssessmentsState = {
  analysisId: string;
  items: AssessmentItem[];
};

function statusClass(status: AssessmentStatus): string {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-700';
  if (status === 'scheduled') return 'bg-indigo-100 text-indigo-700';
  return 'bg-amber-100 text-amber-800';
}

export function AssessmentsPage() {
  const [state, setState] = useState<AssessmentsState>(() => loadAssessments());
  const active = getSelectedOrLatestAnalysis();

  const summary = useMemo(() => summarizeAssessments(state.items), [state.items]);

  const updateItem = (id: string, patch: Partial<AssessmentItem>) => {
    const nextItems = state.items.map((item) => (item.id === id ? { ...item, ...patch } : item));
    const next = { ...state, items: nextItems };
    setState(next);
    saveAssessments(next);
  };

  const resetForCurrentAnalysis = () => {
    const next = loadAssessments();
    setState(next);
    saveAssessments(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>
            Personalized mock assessments for {active?.company || 'your target company'} {active?.role ? `| ${active.role}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest Score</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{active?.finalScore ?? '--'}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Completed</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{summary.completed}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scheduled</p>
            <p className="mt-2 text-2xl font-bold text-indigo-700">{summary.scheduled}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{summary.pending}</p>
          </div>

          <div className="md:col-span-4">
            <button
              type="button"
              onClick={resetForCurrentAnalysis}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Regenerate assessment plan
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Planner</CardTitle>
          <CardDescription>Set schedule, status, and outcomes. Data persists after refresh.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {state.items.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.focus}</p>
                    <p className="mt-1 text-xs text-slate-500">Suggested duration: {item.durationMins} mins</p>
                  </div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(item.id, { status: e.target.value as AssessmentStatus })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Schedule
                    <input
                      type="datetime-local"
                      value={item.scheduledDate}
                      onChange={(e) => updateItem(item.id, { scheduledDate: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Score (optional)
                    <input
                      value={item.score}
                      onChange={(e) => updateItem(item.id, { score: e.target.value })}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                      placeholder="e.g. 7/10"
                    />
                  </label>
                </div>

                <label className="mt-3 flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes
                  <textarea
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                    className="min-h-[80px] rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                    placeholder="What went well, where to improve, next action..."
                  />
                </label>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
