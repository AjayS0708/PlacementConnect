'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/features/placement-readiness/components/ui/card';
import { getHistoryWithStatus, setSelectedAnalysisId } from '@/features/placement-readiness/lib/storage';
import { InterviewQuestionsBank } from '@/features/placement-readiness/components/InterviewQuestionsBank';

export function ResourcesPage() {
  const router = useRouter();
  const { entries: history, hadCorrupted } = useMemo(() => getHistoryWithStatus(), []);

  const openResult = (id: string) => {
    setSelectedAnalysisId(id);
    router.push(`/placement-readiness/results?id=${id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview Questions Bank</CardTitle>
          <CardDescription>
            Practice common interview questions with sample answers, tips, and track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewQuestionsBank />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>Saved analyses persist in localStorage and are available after refresh.</CardDescription>
        </CardHeader>
      <CardContent>
        {hadCorrupted && (
          <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            One saved entry couldn&apos;t be loaded. Create a new analysis.
          </p>
        )}

        {history.length === 0 ? (
          <p className="text-sm text-slate-600">No history yet. Analyze a JD from Practice to populate this list.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => openResult(entry.id)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {entry.company || 'Unknown Company'} | {entry.role || 'Unknown Role'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      Score {entry.finalScore}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
    </div>
  );
}


