export type FinalSubmissionState = {
  lovableProjectLink: string;
  githubRepositoryLink: string;
  deployedUrl: string;
  checklist: boolean[];
};

export const FINAL_SUBMISSION_KEY = 'rb_final_submission';

export const CHECKLIST_ITEMS: string[] = [
  'All form sections save to localStorage',
  'Live preview updates in real-time',
  'Template switching preserves data',
  'Color theme persists after refresh',
  'ATS score calculates correctly',
  'Score updates live on edit',
  'Export buttons work (copy/download)',
  'Empty states handled gracefully',
  'Mobile responsive layout works',
  'No console errors on any page'
];

export const emptyFinalSubmission = (): FinalSubmissionState => ({
  lovableProjectLink: '',
  githubRepositoryLink: '',
  deployedUrl: '',
  checklist: CHECKLIST_ITEMS.map(() => false)
});

export const isValidHttpUrl = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const loadFinalSubmission = (): FinalSubmissionState => {
  const raw = localStorage.getItem(FINAL_SUBMISSION_KEY);
  if (!raw) {
    return emptyFinalSubmission();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FinalSubmissionState>;
    const base = emptyFinalSubmission();
    const parsedChecklist = Array.isArray(parsed.checklist)
      ? parsed.checklist.map(Boolean)
      : base.checklist;
    const checklist = CHECKLIST_ITEMS.map((_, index) => parsedChecklist[index] ?? false);

    return {
      lovableProjectLink: String(parsed.lovableProjectLink ?? ''),
      githubRepositoryLink: String(parsed.githubRepositoryLink ?? ''),
      deployedUrl: String(parsed.deployedUrl ?? ''),
      checklist
    };
  } catch {
    return emptyFinalSubmission();
  }
};
