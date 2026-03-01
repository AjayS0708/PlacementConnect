'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Section - Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg md:flex">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Placement Connect
              </p>
              <h1 className="text-lg font-bold text-slate-900 md:text-xl">
                Unified Dashboard
              </h1>
            </div>
          </div>
        </motion.div>
        
        {/* Right Section - Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {/* Status Badge */}
          <div className="hidden items-center gap-2 rounded-full border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 shadow-sm md:flex">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
            />
            <span className="text-xs font-semibold text-emerald-700">
              All systems normal
            </span>
          </div>
          
          {/* CTA Button */}
          <Link
            href="/resume-builder"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Build Resume</span>
              <span className="sm:hidden">Resume</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer group-hover:opacity-100" />
          </Link>
          
          {/* User Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white shadow-sm transition-all hover:border-slate-400 hover:shadow-md"
          >
            <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
}
