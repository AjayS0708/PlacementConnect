'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="overflow-hidden rounded-3xl border-2 border-red-200 bg-white shadow-elevation-3">
          {/* Header */}
          <div className="border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-8">
            <div className="flex items-start gap-4">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </motion.div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900">
                  Oops! Something Went Wrong
                </h1>
                <p className="mt-2 text-slate-600">
                  We encountered an unexpected error. Our team has been notified.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-8">
            {/* Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-red-200 bg-red-50 p-4"
              >
                <p className="text-sm font-semibold text-red-900">
                  Error Message:
                </p>
                <p className="mt-1 font-mono text-sm text-red-700">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-red-600">
                    Error ID: {error.digest}
                  </p>
                )}
              </motion.div>
            )}

            {/* What Happened */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-blue-200 bg-blue-50 p-4"
            >
              <p className="font-semibold text-blue-900">
                What happened?
              </p>
              <p className="mt-2 text-sm text-blue-800">
                An unexpected error occurred while processing your request. This might be due to:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>A temporary server issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Network connectivity problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Invalid data in your request</span>
                </li>
              </ul>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={reset}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Try Again
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>

              <a
                href="/"
                className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
              >
                Go to Dashboard
              </a>

              <button
                onClick={() => window.location.reload()}
                className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
              >
                Reload Page
              </button>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-700">
                Still having issues?
              </p>
              <p className="mt-2 text-sm text-slate-600">
                If the problem persists, try clearing your browser cache or contact support with the error ID above.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
