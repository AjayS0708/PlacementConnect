'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from './ToastProvider';
import { GlobalLoadingProvider } from './GlobalLoading';
import { ErrorLogViewer } from './ErrorLogViewer';
import { SkipToContent } from './SkipToContent';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <GlobalLoadingProvider>
          <SkipToContent />
          {children}
          {/* Only show error log viewer in development */}
          {process.env.NODE_ENV === 'development' && <ErrorLogViewer />}
        </GlobalLoadingProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
