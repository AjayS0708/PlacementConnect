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
 * Redesigned with modern UI/UX principles
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
  const [hoveredResume, setHoveredResume] = useState<string | null>(null);
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCreateNew = () => {
    const newResume = createNewResume('Untitled Resume');
    const collection = getResumeCollection();
    setResumes(collection.resumes);
    setActiveResumeId(collection.activeResumeId);
    showSuccessMessage('✨ New resume created successfully');
  };

  const handleSetActive = (resumeId: string) => {
    if (setActiveResume(resumeId)) {
      setActiveResumeId(resumeId);
      const collection = getResumeCollection();
      const resume = collection.resumes.find((r) => r.id === resumeId);
      if (resume && onResumeChange) {
        onResumeChange(resume);
      }
      showSuccessMessage('✓  Resume activated');
      setTimeout(() => setIsOpen(false), 800);
    }
  };

  const handleDuplicate = (resumeId: string) => {
    const duplicated = duplicateResume(resumeId);
    if (duplicated) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      showSuccessMessage('📄 Resume duplicated successfully');
    }
  };

  const handleDelete = (resumeId: string) => {
    if (deleteResume(resumeId)) {
      const collection = getResumeCollection();
      setResumes(collection.resumes);
      setActiveResumeId(collection.activeResumeId);
      setShowDeleteConfirm(null);
      showSuccessMessage('🗑️ Resume deleted');
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
      showSuccessMessage('✏️ Resume renamed');
    }
  };

  const handleExport = (resumeId: string) => {
    try {
      exportResumeToJSON(resumeId);
      showSuccessMessage('⬇️ Resume exported successfully');
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
        showSuccessMessage(`⬆️ Resume "${resume.name}" imported successfully`);
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

  const getTemplateIcon = (template: string) => {
    const icons = {
      classic: '📄',
      modern: '✨',
      minimal: '⚡',
      professional: '💼',
      creative: '🎨',
    };
    return icons[template as keyof typeof icons] || '📄';
  };

  const getTemplateColor = (template: string) => {
    const colors = {
      classic: 'from-blue-500 to-blue-600',
      modern: 'from-purple-500 to-purple-600',
      minimal: 'from-slate-500 to-slate-600',
      professional: 'from-indigo-500 to-indigo-600',
      creative: 'from-pink-500 to-pink-600',
    };
    return colors[template as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button - Enhanced */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative overflow-hidden flex items-center gap-3 rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 px-5 py-3 text-sm font-bold text-purple-700 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-200"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity group-hover:opacity-100" />
        
        <div className="relative flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-sm font-bold">My Resumes</div>
            <div className="text-xs text-purple-600">{resumes.length} {resumes.length === 1 ? 'version' : 'versions'}</div>
          </div>
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}d="M9 5l7 7-7 7" />
          </svg>
        </div>
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
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content - Redesigned */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-[110] flex max-h-[85vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border-2 border-slate-300 bg-gradient-to-br from-white via-slate-50 to-purple-50 shadow-2xl"
            >
              {/* Header - Redesigned */}
              <div className="relative flex-shrink-0 overflow-hidden border-b-2 border-slate-200 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-6 py-4">
                {/* Decorative background patterns */}
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/10 blur-xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white drop-shadow-lg">Resume Library</h2>
                        <p className="mt-0.5 text-xs font-medium text-purple-100">Manage and organize your resume collection</p>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Stats Bar */}
                <div className="relative mt-4 flex gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-bold text-white">{resumes.length} Resumes</span>
                  </div>
                  {activeResume && (
                    <div className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-bold text-white">Active: {activeResume.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {importStatus && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex-shrink-0"
                  >
                    <div className={cn(
                      'flex items-center gap-3 px-6 py-3',
                      importStatus.type === 'success'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-b-2 border-green-200'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-b-2 border-red-200'
                    )}>
                      <div className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full',
                        importStatus.type === 'success' ? 'bg-green-200' : 'bg-red-200'
                      )}>
                        {importStatus.type === 'success' ? (
                          <svg className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-semibold">{importStatus.message}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions Bar - Redesigned */}
              <div className="flex-shrink-0 border-b-2 border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCreateNew}
                    className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg shadow-purple-300 transition-all hover:shadow-xl hover:shadow-purple-400"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Resume</span>
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                      id="import-resume"
                    />
                    <motion.label
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      htmlFor="import-resume"
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border-2 border-indigo-300 bg-indigo-50 px-5 py-3 font-bold text-indigo-700 transition-all hover:border-indigo-400 hover:bg-indigo-100"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Import</span>
                    </motion.label>
                  </div>
                </div>
              </div>

              {/* Resume List - Completely Redesigned */}
              <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
                {resumes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-purple-50 p-16 text-center"
                  >
                    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100">
                      <svg
                        className="h-12 w-12 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">No resumes yet</h3>
                    <p className="mt-2 text-sm text-slate-600">Create your first resume to get started on your career journey</p>
                    <motion.button
                      onClick={handleCreateNew}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Create First Resume
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume, index) => (
                      <motion.div
                        key={resume.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onHoverStart={() => setHoveredResume(resume.id)}
                        onHoverEnd={() => setHoveredResume(null)}
                        className={cn(
                          'group relative overflow-hidden rounded-2xl border-2 transition-all',
                          resume.isActive
                            ? 'border-purple-400 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg shadow-purple-200'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
                        )}
                      >
                        {/* Active Badge/Ribbon */}
                        {resume.isActive && (
                          <div className="absolute right-0 top-0 z-10">
                            <div className="flex items-center gap-1 rounded-bl-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              ACTIVE
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          {/* Header */}
                          <div className="mb-4">
                            {editingId === resume.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(resume.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                  className="w-full rounded-lg border-2 border-purple-400 px-3 py-2 text-base font-bold outline-none focus:border-purple-600"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveRename(resume.id)}
                                    className="flex-1 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-purple-700"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="flex-1 rounded-lg bg-slate-300 px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h3 className="text-lg font-black text-slate-900 line-clamp-2 min-h-[3.5rem]">
                                  {resume.name}
                                </h3>
                              </div>
                            )}
                          </div>

                          {/* Template Badge */}
                          <div className="mb-4">
                            <div className={cn(
                              'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-3 py-2 text-white shadow-md',
                              getTemplateColor(resume.template)
                            )}>
                              <span className="text-base">{getTemplateIcon(resume.template)}</span>
                              <span className="text-sm font-bold capitalize">{resume.template}</span>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="mb-5 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-600">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Updated: {resume.updatedAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Created: {resume.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            {/* Primary Action */}
                            {!resume.isActive ? (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSetActive(resume.id)}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white shadow-md hover:shadow-lg"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Set as Active
                              </motion.button>
                            ) : (
                              <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 font-bold text-white shadow-md">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Current Resume
                              </div>
                            )}

                            {/* Secondary Actions */}
                            <div className="grid grid-cols-4 gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleStartRename(resume)}
                                className="flex aspect-square items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200"
                                title="Rename"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDuplicate(resume.id)}
                                className="flex aspect-square items-center justify-center rounded-xl bg-green-100 text-green-700 transition-colors hover:bg-green-200"
                                title="Duplicate"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleExport(resume.id)}
                                className="flex aspect-square items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-colors hover:bg-amber-200"
                                title="Export"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </motion.button>

                              {resumes.length > 1 && (
                                <>
                                  {showDeleteConfirm === resume.id ? (
                                    <motion.button
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1 }}
                                      onClick={() => handleDelete(resume.id)}
                                      className="flex aspect-square items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-700"
                                      title="Confirm Delete"
                                    >
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </motion.button>
                                  ) : (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => setShowDeleteConfirm(resume.id)}
                                      className="flex aspect-square items-center justify-center rounded-xl bg-red-100 text-red-700 transition-colors hover:bg-red-200"
                                      title="Delete"
                                    >
                                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </motion.button>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Delete Confirmation */}
                            {showDeleteConfirm === resume.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="rounded-lg bg-red-50 border-2 border-red-200 p-3 text-center"
                              >
                                <p className="text-sm font-bold text-red-800 mb-2">Delete this resume?</p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDelete(resume.id)}
                                    className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white hover:bg-red-700"
                                  >
                                    Yes, Delete
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 rounded-lg bg-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Hover Effect */}
                        {hoveredResume === resume.id && !resume.isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none"
                          />
                        )}
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
