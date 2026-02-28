import { AnalysisEntry } from '@/features/placement-readiness/types/analysis';
import { getSelectedAnalysisId, getSelectedOrLatestAnalysis } from './storage';

export type AssessmentStatus = 'pending' | 'scheduled' | 'completed';

export interface AssessmentItem {
  id: string;
  title: string;
  focus: string;
  durationMins: number;
  status: AssessmentStatus;
  scheduledDate: string;
  score: string;
  notes: string;
}

interface AssessmentsEnvelope {
  analysisId: string;
  items: AssessmentItem[];
}

const ASSESSMENTS_KEY = 'placement_prp_assessments_v1';

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function getWeakSkills(entry: AnalysisEntry | null): string[] {
  if (!entry) return [];

  return Object.entries(entry.skillConfidenceMap)
    .filter(([, level]) => level === 'practice')
    .map(([skill]) => skill)
    .slice(0, 4);
}

function toAssessmentItems(entry: AnalysisEntry | null): AssessmentItem[] {
  const weakSkills = getWeakSkills(entry);
  const generated = weakSkills.map((skill) => ({
    id: createId('skill'),
    title: `${skill} Skill Check`,
    focus: `Practice and validate interview-ready depth in ${skill}.`,
    durationMins: 45,
    status: 'pending' as const,
    scheduledDate: '',
    score: '',
    notes: '',
  }));

  const fallback = [
    {
      id: createId('dsa'),
      title: 'Timed DSA Mock',
      focus: '2 easy + 2 medium problems under 60 minutes.',
      durationMins: 60,
      status: 'pending' as const,
      scheduledDate: '',
      score: '',
      notes: '',
    },
    {
      id: createId('core'),
      title: 'Core CS Oral Round',
      focus: 'Revise OS/DBMS/CN and explain with practical examples.',
      durationMins: 40,
      status: 'pending' as const,
      scheduledDate: '',
      score: '',
      notes: '',
    },
    {
      id: createId('hr'),
      title: 'HR + Behavioral Simulation',
      focus: 'Answer motivation, teamwork, and conflict questions in STAR format.',
      durationMins: 30,
      status: 'pending' as const,
      scheduledDate: '',
      score: '',
      notes: '',
    },
  ];

  return [...generated, ...fallback].slice(0, 7);
}

function normalizeStatus(value: unknown): AssessmentStatus {
  if (value === 'scheduled' || value === 'completed') return value;
  return 'pending';
}

function normalizeItem(raw: unknown): AssessmentItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;

  const id = typeof item.id === 'string' ? item.id : createId('assessment');
  const title = typeof item.title === 'string' ? item.title : '';
  if (!title) return null;

  return {
    id,
    title,
    focus: typeof item.focus === 'string' ? item.focus : '',
    durationMins: typeof item.durationMins === 'number' ? item.durationMins : 45,
    status: normalizeStatus(item.status),
    scheduledDate: typeof item.scheduledDate === 'string' ? item.scheduledDate : '',
    score: typeof item.score === 'string' ? item.score : '',
    notes: typeof item.notes === 'string' ? item.notes : '',
  };
}

function getCurrentAnalysisId(): string {
  return getSelectedAnalysisId() || getSelectedOrLatestAnalysis()?.id || 'no-analysis';
}

export function loadAssessments(): AssessmentsEnvelope {
  const active = getSelectedOrLatestAnalysis();
  const activeId = getCurrentAnalysisId();

  if (typeof window === 'undefined') {
    return { analysisId: activeId, items: toAssessmentItems(active) };
  }

  const raw = localStorage.getItem(ASSESSMENTS_KEY);
  if (!raw) {
    return { analysisId: activeId, items: toAssessmentItems(active) };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AssessmentsEnvelope>;
    const savedId = typeof parsed.analysisId === 'string' ? parsed.analysisId : 'no-analysis';
    const parsedItems = Array.isArray(parsed.items)
      ? parsed.items.map(normalizeItem).filter((item): item is AssessmentItem => item !== null)
      : [];

    if (savedId !== activeId || parsedItems.length === 0) {
      return { analysisId: activeId, items: toAssessmentItems(active) };
    }

    return { analysisId: savedId, items: parsedItems };
  } catch {
    return { analysisId: activeId, items: toAssessmentItems(active) };
  }
}

export function saveAssessments(envelope: AssessmentsEnvelope): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(envelope));
}

export function summarizeAssessments(items: AssessmentItem[]): {
  completed: number;
  scheduled: number;
  pending: number;
} {
  const completed = items.filter((item) => item.status === 'completed').length;
  const scheduled = items.filter((item) => item.status === 'scheduled').length;
  const pending = items.filter((item) => item.status === 'pending').length;

  return { completed, scheduled, pending };
}
