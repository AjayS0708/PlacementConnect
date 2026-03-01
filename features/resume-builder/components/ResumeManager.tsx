'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  getResumeCollection,
  createNewResume,
  setActiveResume,
  duplicateResume,
  deleteResume,
  renameResume,
  exportResumeToJSON,
  importResumeFromJSON,
  ResumeVersion,
  migrateLegacyResume,
} from '@/features/resume-builder/lib/resumeManager';

interface ResumeManagerProps {
  onResumeChange?: (resume: ResumeVersion) => void;
  className?: string;
}

/**
 * ResumeManager - Manage multiple resumes with version history
 */
export function ResumeManager({ onResumeChange, className }: ResumeManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load resumes on mount
  useEffect(() => {
    // Migrate legacy data if needed
    migrateLegacyResume();
    
    const collection = getResumeCollection();
    setResumes(collection.resumes);
    setActiveResumeId(collection.activeResumeId);
  }, []);

  // Reload resumes when modal opens
  useEffect(() => {
    if (isOpen) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      setActiveResumeId(collection.activeResumeId);
    }
  }, [isOpen]);

  const handleCreateNew = () => {
    const newResume = createNewResume('Untitled Resume');
    const collection = getResumeCollection();
    setResumes(collection.resumes);
    setActiveResumeId(collection.activeResumeId);
    showSuccessMessage('New resume created');
  };

  const handleSetActive = (resumeId: string) => {
    if (setActiveResume(resumeId)) {
      setActiveResumeId(resumeId);
      const collection = getResumeCollection();
      const resume = collection.resumes.find((r) => r.id === resumeId);
      if (resume && onResumeChange) {
        onResumeChange(resume);
      }
      showSuccessMessage('Resume activated');
      setIsOpen(false);
    }
  };

  const handleDuplicate = (resumeId: string) => {
    const duplicated = duplicateResume(resumeId);
    if (duplicated) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      showSuccessMessage('Resume duplicated');
    }
  };

  const handleDelete = (resumeId: string) => {
    if (deleteResume(resumeId)) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      setActiveResumeId(collection.activeResumeId);
      setShowDeleteConfirm(null);
      showSuccessMessage('Resume deleted');
    }
  };

  const handleStartRename = (resume: ResumeVersion) => {
    setEditingId(resume.id);
    setEditingName(resume.name);
  };

  const handleSaveRename = (resumeId: string) => {
    if (editingName.trim() && renameResume(resumeId, editingName.trim())) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      setEditingId(null);
      showSuccessMessage('Resume renamed');
    }
  };

  const handleExport = (resumeId: string) => {
    try {
      exportResumeToJSON(resumeId);
      showSuccessMessage('Resume exported');
    } catch (error) {
      showErrorMessage('Failed to export resume');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importResumeFromJSON(
      file,
      (resume) => {
        const collection = getResumeCollection();
        setResumes(collection.resumes);
        showSuccessMessage(`Resume "${resume.name}" imported successfully`);
      },
      (error) => {
        showErrorMessage(error);
      }
    );

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showSuccessMessage = (message: string) => {
    setImportStatus({ type: 'success', message });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const showErrorMessage = (message: string) => {
    setImportStatus({ type: 'error', message });
    setTimeout(() => setImportStatus(null), 5000);
  };

  const activeResume = resumes.find((r) => r.id === activeResumeId);

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        My Resumes ({resumes.length})
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-[110] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-slate-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">My Resumes</h2>
                  <p className="mt-1 text-sm text-slate-600">Manage your resume versions</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {importStatus && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'border-b-2 p-4',
                      importStatus.type === 'success'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {importStatus.type === 'success' ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-medium">{importStatus.message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions Bar */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 p-4">
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Resume
                </button>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-resume"
                  />
                  <label
                    htmlFor="import-resume"
                    className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Import
                  </label>
                </div>
              </div>

              {/* Resume List */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {resumes.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                    <svg
                      className="mx-auto h-16 w-16 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-4 text-sm font-medium text-slate-600">No resumes yet</p>
                    <p className="mt-1 text-xs text-slate-500">Click "New Resume" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {resumes.map((resume) => (
                      <motion.div
                        key={resume.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'group rounded-lg border-2 bg-white p-4 transition-all',
                          resume.isActive
                            ? 'border-purple-300 bg-purple-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {editingId === resume.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(resume.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                  className="flex-1 rounded border-2 border-purple-300 px-2 py-1 text-sm font-semibold focus:border-purple-500 focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveRename(resume.id)}
                                  className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="rounded bg-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-slate-900">{resume.name}</h3>
                                {resume.isActive && (
                                  <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-semibold text-white">
                                    Active
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                              <span>Template: {resume.template}</span>
                              <span>•</span>
                              <span>Updated: {resume.updatedAt.toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Created: {resume.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!resume.isActive && (
                              <button
                                onClick={() => handleSetActive(resume.id)}
                                className="rounded p-2 text-slate-600 transition-colors hover:bg-purple-100 hover:text-purple-700"
                                title="Set as active"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleStartRename(resume)}
                              className="rounded p-2 text-slate-600 transition-colors hover:bg-blue-100 hover:text-blue-700"
                              title="Rename"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDuplicate(resume.id)}
                              className="rounded p-2 text-slate-600 transition-colors hover:bg-green-100 hover:text-green-700"
                              title="Duplicate"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleExport(resume.id)}
                              className="rounded p-2 text-slate-600 transition-colors hover:bg-amber-100 hover:text-amber-700"
                              title="Export"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                            {resumes.length > 1 && (
                              <>
                                {showDeleteConfirm === resume.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleDelete(resume.id)}
                                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      className="rounded bg-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-400"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setShowDeleteConfirm(resume.id)}
                                    className="rounded p-2 text-slate-600 transition-colors hover:bg-red-100 hover:text-red-700"
                                    title="Delete"
                                  >
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
