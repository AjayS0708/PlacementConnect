'use client';

import { motion } from 'framer-motion';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        {/* Offline Icon Animation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-slate-500 text-white shadow-elevation-3"
        >
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </motion.div>

        <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-elevation-3">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-slate-900">
              You&apos;re Offline
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              It looks like you&apos;ve lost your internet connection.
            </p>

            {/* Status Check */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="h-3 w-3 rounded-full bg-red-500"
                />
                <p className="font-semibold text-slate-700">
                  Waiting for connection...
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                This page will automatically refresh when you&apos;re back online
              </p>
            </div>

            {/* Tips */}
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-left">
              <p className="font-semibold text-blue-900">
                While you wait:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Check your WiFi or mobile data connection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Try turning airplane mode off and on</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Make sure you&apos;re not using a VPN that&apos;s blocking access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Your work will be saved locally and synced when you reconnect</span>
                </li>
              </ul>
            </div>

            {/* Manual Retry */}
            <div className="mt-8">
              <button
                onClick={() => window.location.reload()}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-500 to-slate-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
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
                  Try Reconnecting
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
