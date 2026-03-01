'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  exportAllData,
  downloadDataAsJSON,
  importDataFromJSON,
  clearAllData,
  getStorageSize,
  formatBytes,
  autoBackup,
  getAutoBackups,
  restoreFromAutoBackup,
  ExportData,
} from '@/utils/export/dataExport';

interface DataBackupManagerProps {
  onImportSuccess?: () => void;
  className?: string;
}

/**
 * DataBackupManager - Manage export, import, and backup of application data
 */
export function DataBackupManager({ onImportSuccess, className }: DataBackupManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'auto'>('export');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [storageSize, setStorageSize] = useState(0);
  const [autoBackups, setAutoBackups] = useState<Array<{ key: string; date: Date; size: number }>>([]);
  const [dataCategories, setDataCategories] = useState<Array<[string, unknown]>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load storage data on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStorageSize(getStorageSize());
      setAutoBackups(getAutoBackups());
      const data = exportAllData();
      setDataCategories(Object.entries(data.data).filter(([, value]) => value !== undefined));
    }
  }, []);

  const handleExport = () => {
    downloadDataAsJSON();
    setImportStatus({ type: 'success', message: 'Data exported successfully!' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    importDataFromJSON(
      file,
      (data: ExportData) => {
        setImportStatus({
          type: 'success',
          message: `Data imported successfully! ${Object.keys(data.data).length} categories restored.`,
        });
        setTimeout(() => {
          setImportStatus(null);
          onImportSuccess?.();
          window.location.reload();
        }, 2000);
      },
      (error: string) => {
        setImportStatus({ type: 'error', message: error });
        setTimeout(() => setImportStatus(null), 5000);
      }
    );

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    setImportStatus({ type: 'success', message: 'All data cleared successfully!' });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleAutoBackup = () => {
    autoBackup();
    setAutoBackups(getAutoBackups());
    setStorageSize(getStorageSize());
    setImportStatus({ type: 'success', message: 'Auto-backup created successfully!' });
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleRestoreAutoBackup = (backupKey: string) => {
    const success = restoreFromAutoBackup(backupKey);
    if (success) {
      setImportStatus({ type: 'success', message: 'Backup restored successfully!' });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      setImportStatus({ type: 'error', message: 'Failed to restore backup' });
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

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
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
        Backup & Restore
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
              className="fixed left-1/2 top-1/2 z-[110] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-slate-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-200 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Data Backup & Restore</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Storage used: <span className="font-semibold text-purple-600">{formatBytes(storageSize)}</span>
                  </p>
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

              {/* Tabs */}
              <div className="flex border-b-2 border-slate-200">
                {(['export', 'import', 'auto'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 px-6 py-3 text-sm font-semibold transition-colors',
                      activeTab === tab
                        ? 'border-b-2 border-purple-500 text-purple-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {tab === 'export' && '📤 Export'}
                    {tab === 'import' && '📥 Import'}
                    {tab === 'auto' && '🔄 Auto-Backup'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Export Tab */}
                {activeTab === 'export' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Export Your Data</h3>
                      <p className="text-sm text-slate-600">
                        Download all your data as a JSON file. You can use this to backup or transfer your data.
                      </p>
                    </div>

                    {/* Data Categories */}
                    <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-700 mb-3">Data to be exported:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {dataCategories.map(([key]) => (
                          <div key={key} className="flex items-center gap-2">
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-slate-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleExport}
                      className="w-full rounded-lg bg-purple-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-600"
                    >
                      📥 Download Backup File
                    </button>
                  </div>
                )}

                {/* Import Tab */}
                {activeTab === 'import' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Import Data</h3>
                      <p className="text-sm text-slate-600">
                        Upload a previously exported JSON file to restore your data.
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-8 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="import-file"
                      />
                      <label
                        htmlFor="import-file"
                        className="flex cursor-pointer flex-col items-center gap-3"
                      >
                        <svg className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-purple-900">Click to select backup file</p>
                          <p className="mt-1 text-xs text-purple-700">JSON files only</p>
                        </div>
                      </label>
                    </div>

                    <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
                      <div className="flex gap-3">
                        <svg
                          className="h-5 w-5 flex-shrink-0 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-xs text-amber-900">
                          <strong>Warning:</strong> Importing will overwrite your current data. Page will reload after import.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-Backup Tab */}
                {activeTab === 'auto' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Auto-Backups</h3>
                      <p className="text-sm text-slate-600">
                        Automatic backups are stored locally. Last 3 backups are kept.
                      </p>
                    </div>

                    <button
                      onClick={handleAutoBackup}
                      className="w-full rounded-lg border-2 border-purple-300 bg-purple-50 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
                    >
                      ⚡ Create Auto-Backup Now
                    </button>

                    {/* Auto-Backup List */}
                    {autoBackups.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700">Available Backups:</p>
                        {autoBackups.map((backup) => (
                          <div
                            key={backup.key}
                            className="flex items-center justify-between rounded-lg border-2 border-slate-200 bg-white p-4"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {backup.date.toLocaleString()}
                              </p>
                              <p className="text-xs text-slate-600">{formatBytes(backup.size)}</p>
                            </div>
                            <button
                              onClick={() => handleRestoreAutoBackup(backup.key)}
                              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                            >
                              Restore
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-3 text-sm font-medium text-slate-600">No auto-backups yet</p>
                        <p className="mt-1 text-xs text-slate-500">Click the button above to create one</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t-2 border-slate-200 p-6">
                {!showClearConfirm ? (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full rounded-lg border-2 border-red-300 bg-red-50 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                  >
                    🗑️ Clear All Data
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm font-semibold text-red-900">
                      Are you sure? This cannot be undone!
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="rounded-lg border-2 border-slate-200 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleClearData}
                        className="rounded-lg bg-red-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        Yes, Clear All
                      </button>
                    </div>
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
