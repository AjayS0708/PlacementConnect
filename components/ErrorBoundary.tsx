'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service (e.g., Sentry)
    if (typeof window !== 'undefined') {
      // Store error in localStorage for debugging
      try {
        const errorLog = {
          timestamp: new Date().toISOString(),
          error: {
            message: error.message,
            stack: error.stack,
          },
          componentStack: errorInfo.componentStack,
          userAgent: navigator.userAgent,
        };
        
        const existingErrors = JSON.parse(
          localStorage.getItem('error-logs') || '[]'
        );
        existingErrors.push(errorLog);
        
        // Keep only last 10 errors
        if (existingErrors.length > 10) {
          existingErrors.shift();
        }
        
        localStorage.setItem('error-logs', JSON.stringify(existingErrors));
      } catch (e) {
        console.error('Failed to log error:', e);
      }
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-red-200 bg-white shadow-elevation-3"
            >
              {/* Header */}
              <div className="border-b-2 border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg">
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
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900">
                      Something Went Wrong
                    </h1>
                    <p className="mt-2 text-slate-600">
                      We encountered an unexpected error. Don&apos;t worry, your data is safe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Details */}
              <div className="space-y-6 p-8">
                {/* Error Message */}
                {this.state.error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-900">
                      Error Message:
                    </p>
                    <p className="mt-1 font-mono text-sm text-red-700">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                {/* Quick Tips */}
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="font-semibold text-blue-900">
                    What you can try:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Click &quot;Try Again&quot; to reset this section</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Refresh the page if the issue persists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>Clear your browser cache and cookies</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={this.handleReset}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Try Again</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                  
                  <button
                    onClick={this.handleReload}
                    className="rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
                  >
                    Reload Page
                  </button>
                  
                  <a
                    href="/"
                    className="rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
                  >
                    Go to Dashboard
                  </a>
                </div>

                {/* Developer Info (only in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="rounded-xl border border-slate-200 bg-slate-50">
                    <summary className="cursor-pointer p-4 font-semibold text-slate-700 hover:bg-slate-100">
                      Developer Info (click to expand)
                    </summary>
                    <div className="border-t border-slate-200 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        Stack Trace:
                      </p>
                      <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">
                        {this.state.error.stack}
                      </pre>
                      {this.state.errorInfo && (
                        <>
                          <p className="mb-2 mt-4 text-sm font-semibold text-slate-700">
                            Component Stack:
                          </p>
                          <pre className="overflow-x-auto rounded bg-slate-900 p-4 text-xs text-slate-100">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for specific sections
export function FeatureErrorBoundary({ 
  children, 
  featureName 
}: { 
  children: ReactNode; 
  featureName: string;
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 shrink-0 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">
                Error loading {featureName}
              </h3>
              <p className="mt-1 text-sm text-red-700">
                This section encountered an error. Other features should work normally.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
