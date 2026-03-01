'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  errorLogger,
  ErrorLog,
  ErrorSeverity,
  ErrorCategory,
} from '@/utils/errorLogger';

export function ErrorLogViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filter, setFilter] = useState<'all' | ErrorSeverity | ErrorCategory>('all');
  const [stats, setStats] = useState(errorLogger.getErrorStats());

  useEffect(() => {
    loadErrors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadErrors = () => {
    const allErrors = errorLogger.getStoredErrors();
    
    let filteredErrors = allErrors;
    if (filter !== 'all') {
      filteredErrors = allErrors.filter(
        error => error.severity === filter || error.category === filter
      );
    }
    
    setErrors(filteredErrors);
    setStats(errorLogger.getErrorStats());
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all error logs?')) {
      errorLogger.clearStoredErrors();
      loadErrors();
    }
  };

  const handleExport = (format: 'json' | 'csv') => {
    const data = format === 'json' 
      ? errorLogger.exportErrorsAsJSON()
      : errorLogger.exportErrorsAsCSV();
    
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: ErrorSeverity) => {
    const colors = {
      [ErrorSeverity.LOW]: 'bg-blue-100 text-blue-700 border-blue-300',
      [ErrorSeverity.MEDIUM]: 'bg-amber-100 text-amber-700 border-amber-300',
      [ErrorSeverity.HIGH]: 'bg-orange-100 text-orange-700 border-orange-300',
      [ErrorSeverity.CRITICAL]: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[severity];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 rounded-full bg-gradient-to-r from-red-500 to-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        title="View Error Logs"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {stats.total > 0 && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-red-600">
            {stats.total > 9 ? '9+' : stats.total}
          </div>
        )}
      </button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-elevation-3"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Error Logs</h2>
                <p className="text-sm text-slate-600">
                  {stats.total} errors logged
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="border-b border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div
                  key={severity}
                  className={`rounded-lg border-2 p-3 ${getSeverityColor(severity as ErrorSeverity)}`}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs font-medium uppercase">{severity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white p-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | ErrorSeverity | ErrorCategory)}
              className="rounded-lg border-2 border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Errors</option>
              <optgroup label="By Severity">
                <option value={ErrorSeverity.LOW}>Low</option>
                <option value={ErrorSeverity.MEDIUM}>Medium</option>
                <option value={ErrorSeverity.HIGH}>High</option>
                <option value={ErrorSeverity.CRITICAL}>Critical</option>
              </optgroup>
              <optgroup label="By Category">
                <option value={ErrorCategory.NETWORK}>Network</option>
                <option value={ErrorCategory.VALIDATION}>Validation</option>
                <option value={ErrorCategory.RUNTIME}>Runtime</option>
                <option value={ErrorCategory.UI}>UI</option>
                <option value={ErrorCategory.DATA}>Data</option>
              </optgroup>
            </select>

            <button
              onClick={() => handleExport('json')}
              className="rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100"
            >
              Export JSON
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100"
            >
              Export CSV
            </button>

            <button
              onClick={handleClear}
              className="ml-auto rounded-lg border-2 border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all hover:bg-red-100"
            >
              Clear All
            </button>
          </div>

          {/* Error List */}
          <div className="h-[calc(90vh-300px)] overflow-y-auto p-4">
            {errors.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white">
                    <svg className="h-full w-full" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">No errors found</p>
                  <p className="text-sm text-slate-600">The application is running smoothly!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {errors.map((error) => (
                  <details
                    key={error.id}
                    className="group overflow-hidden rounded-xl border-2 border-slate-200 bg-white transition-all hover:shadow-lg"
                  >
                    <summary className="flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-slate-50">
                      <div className={`mt-1 rounded-lg border px-2 py-1 text-xs font-bold uppercase ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
                            {error.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 font-medium text-slate-900">{error.message}</p>
                      </div>
                    </summary>
                    <div className="border-t border-slate-200 bg-slate-50 p-4">
                      {error.stack && (
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-semibold text-slate-700">Stack Trace:</p>
                          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                      {error.context && (
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-semibold text-slate-700">Context:</p>
                          <pre className="overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
                            {JSON.stringify(error.context, null, 2)}
                          </pre>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        {error.url && <span>URL: {error.url}</span>}
                        {error.userAgent && <span className="truncate">UA: {error.userAgent}</span>}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
