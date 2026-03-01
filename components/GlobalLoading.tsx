'use client';

import { motion } from 'framer-motion';
import { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalLoadingContextValue {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | undefined>(undefined);

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const setLoading = (loading: boolean, message?: string) => {
    setIsLoading(loading);
    if (message) {
      setLoadingMessage(message);
    }
  };

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, loadingMessage, setLoading }}>
      {children}
      {isLoading && <GlobalLoadingOverlay message={loadingMessage} />}
    </GlobalLoadingContext.Provider>
  );
}

function GlobalLoadingOverlay({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-elevation-3"
      >
        <div className="flex items-center gap-4 p-8">
          {/* Spinner */}
          <div className="relative h-12 w-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {message}
            </p>
            <p className="text-sm text-slate-600">
              Please wait a moment...
            </p>
          </div>
        </div>

        {/* Progress bar animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 0.3, 0.6, 0.8, 0.3, 0.6, 0.8] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="h-1 origin-left bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
      </motion.div>
    </motion.div>
  );
}

// Standalone component that can be used without provider
export function GlobalLoadingIndicator({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="flex items-center gap-3 rounded-xl border-2 border-blue-200 bg-white px-4 py-3 shadow-elevation-2"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-5 w-5 rounded-full border-2 border-blue-200 border-t-blue-500"
        />
        <span className="text-sm font-medium text-slate-700">{message}</span>
      </motion.div>
    </div>
  );
}
