'use client';

import { useEffect, useMemo, useState } from 'react';
import { RB_STEPS } from '@/features/resume-builder/config/rbSteps';
import { rbArtifacts } from '@/features/resume-builder/state/rbArtifacts';
import {
  CHECKLIST_ITEMS,
  FINAL_SUBMISSION_KEY,
  emptyFinalSubmission,
  isValidHttpUrl,
  loadFinalSubmission,
  type FinalSubmissionState
} from '@/features/resume-builder/lib/proofSubmission';

type ResumeProofWorkflowProps = {
  routeLabel: string;
};

export default function ResumeProofWorkflow({ routeLabel }: ResumeProofWorkflowProps) {
  const [submission, setSubmission] = useState<FinalSubmissionState>(() => {
    if (typeof window === 'undefined') {
      return emptyFinalSubmission();
    }
    return loadFinalSubmission();
  });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(FINAL_SUBMISSION_KEY, JSON.stringify(submission));
  }, [submission]);

  const stepStatuses = useMemo(
    () =>
      RB_STEPS.map((step) => ({
        ...step,
        complete: rbArtifacts.has(step.index)
      })),
    [submission]
  );

  const allStepsCompleted = stepStatuses.every((step) => step.complete);
  const allChecklistPassed = submission.checklist.every(Boolean);
  const lovableValid =
    submission.lovableProjectLink.trim().length === 0 || isValidHttpUrl(submission.lovableProjectLink);
  const requiredLinksValid =
    isValidHttpUrl(submission.githubRepositoryLink) &&
    isValidHttpUrl(submission.deployedUrl);

  const isShipped = allStepsCompleted && allChecklistPassed && requiredLinksValid && lovableValid;

  const updateChecklist = (index: number, next: boolean) => {
    const checklist = submission.checklist.map((value, i) => (i === index ? next : value));
    setSubmission({ ...submission, checklist });
  };

  const onCopyFinalSubmission = async () => {
    const lines = [
      '------------------------------------------',
      'AI Resume Builder - Final Submission',
      '',
      `Lovable Project: ${submission.lovableProjectLink || 'N/A'}`,
      `GitHub Repository: ${submission.githubRepositoryLink || 'N/A'}`,
      `Live Deployment: ${submission.deployedUrl || 'N/A'}`,
      '',
      'Core Capabilities:',
      '- Structured resume builder',
      '- Deterministic ATS scoring',
      '- Template switching',
      '- PDF export with clean formatting',
      '- Persistence + validation checklist',
      '------------------------------------------'
    ];

    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <main className="rb-page">
      <header className="rb-top-bar">
        <div className="rb-top-left">AI Resume Builder</div>
        <div className="rb-top-center">Project 3 - Proof</div>
        <div className="rb-status-badge">{isShipped ? 'Shipped' : 'In Progress'}</div>
      </header>

      <section className="rb-context-header">
        <h1>Proof</h1>
        <p>{routeLabel}</p>
      </section>

      <section className="rb-proof-inputs">
        <h2>Step Completion Overview</h2>
        <ul className="rb-proof-list">
          {stepStatuses.map((step) => (
            <li key={step.route}>
              Step {step.index}: {step.title} - {step.complete ? 'Completed' : 'Pending'}
            </li>
          ))}
        </ul>
      </section>

      <section className="rb-proof-inputs">
        <h2>Artifact Collection</h2>
        <label htmlFor="lovable-link">Lovable Project Link (Optional)</label>
        <input
          id="lovable-link"
          type="url"
          inputMode="url"
          value={submission.lovableProjectLink}
          onChange={(event) => setSubmission({ ...submission, lovableProjectLink: event.target.value })}
          placeholder="https://..."
          aria-invalid={submission.lovableProjectLink.trim().length > 0 && !isValidHttpUrl(submission.lovableProjectLink)}
        />
        {submission.lovableProjectLink.trim().length > 0 && !isValidHttpUrl(submission.lovableProjectLink) && (
          <p className="rb-proof-hint">Enter a valid URL (http/https).</p>
        )}

        <label htmlFor="github-link">GitHub Repository Link</label>
        <input
          id="github-link"
          type="url"
          inputMode="url"
          value={submission.githubRepositoryLink}
          onChange={(event) => setSubmission({ ...submission, githubRepositoryLink: event.target.value })}
          placeholder="https://..."
          aria-invalid={submission.githubRepositoryLink.trim().length > 0 && !isValidHttpUrl(submission.githubRepositoryLink)}
        />
        {submission.githubRepositoryLink.trim().length > 0 && !isValidHttpUrl(submission.githubRepositoryLink) && (
          <p className="rb-proof-hint">Enter a valid URL (http/https).</p>
        )}

        <label htmlFor="deployed-link">Deployed URL</label>
        <input
          id="deployed-link"
          type="url"
          inputMode="url"
          value={submission.deployedUrl}
          onChange={(event) => setSubmission({ ...submission, deployedUrl: event.target.value })}
          placeholder="https://..."
          aria-invalid={submission.deployedUrl.trim().length > 0 && !isValidHttpUrl(submission.deployedUrl)}
        />
        {submission.deployedUrl.trim().length > 0 && !isValidHttpUrl(submission.deployedUrl) && (
          <p className="rb-proof-hint">Enter a valid URL (http/https).</p>
        )}
      </section>

      <section className="rb-proof-inputs">
        <h2>Checklist Validation</h2>
        <ul className="rb-proof-checklist">
          {CHECKLIST_ITEMS.map((item, index) => (
            <li key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={submission.checklist[index] ?? false}
                  onChange={(event) => updateChecklist(index, event.target.checked)}
                />
                <span>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rb-proof-inputs">
        <button type="button" onClick={onCopyFinalSubmission}>
          {copied ? 'Copied Final Submission' : 'Copy Final Submission'}
        </button>
        {isShipped ? (
          <p className="rb-proof-success">Project 3 Shipped Successfully.</p>
        ) : (
          <p className="rb-proof-hint">
            Status remains In Progress until all steps, checklist items, and required links are complete.
          </p>
        )}
      </section>
    </main>
  );
}
