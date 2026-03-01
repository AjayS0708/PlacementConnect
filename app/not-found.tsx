'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl text-center"
      >
        {/* 404 Illustration */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative mx-auto mb-8 h-64 w-full"
        >
          {/* Large 404 Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-9xl font-bold text-transparent">
              404
            </h1>
          </div>
          
          {/* Decorative Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-1/4 top-1/4 h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-1/4 right-1/4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-elevation-3"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Page Not Found
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            {/* Suggestions */}
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 text-left">
              <p className="font-semibold text-blue-900">
                What you can try:
              </p>
              <ul className="mt-3 space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Check the URL for typos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Use the navigation menu to find what you need</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Go back to the homepage and start fresh</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>

              <button
                onClick={() => window.history.back()}
                className="rounded-xl border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t-2 border-slate-100 bg-gradient-to-r from-slate-50 to-white p-6">
            <p className="mb-4 text-sm font-semibold text-slate-700">
              Quick Links:
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Link
                href="/job-notifications"
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                Job Notifications
              </Link>
              <Link
                href="/placement-readiness"
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Placement Readiness
              </Link>
              <Link
                href="/resume-builder"
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
              >
                Resume Builder
              </Link>
              <Link
                href="/analytics"
                className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-all hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
              >
                Analytics
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
