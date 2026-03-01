'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ResumeManager } from '@/features/resume-builder/components/ResumeManager';

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-12 shadow-elevation-3 lg:p-16"
      >
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2"
          >
            <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-700">Resume Builder</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900 via-purple-700 to-pink-700 bg-clip-text text-5xl font-bold text-transparent md:text-6xl lg:text-7xl"
          >
            Build a Resume That Gets Read
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            Premium structure-first workflow for drafting your resume with clarity. Create, preview, and export in minutes.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/resume-builder/builder"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <span>Start Building</span>
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <ResumeManager />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            ),
            title: 'Structure-First',
            description: 'Build your resume following proven ATS-friendly formats.',
            color: 'from-blue-500 to-indigo-500',
            bgColor: 'from-blue-500/5 to-indigo-500/5',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ),
            title: 'Live Preview',
            description: 'See real-time changes as you build your resume.',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'from-emerald-500/5 to-teal-500/5',
          },
          {
            icon: (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            ),
            title: 'Quick Export',
            description: 'Download your polished resume instantly as PDF.',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-500/5 to-pink-500/5',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2 transition-all hover:scale-105 hover:shadow-elevation-3"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 transition-opacity group-hover:opacity-100`} />
            
            <div className="relative">
              <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {[
          { label: 'Templates', value: '5+', icon: '📄' },
          { label: 'Sections', value: '10+', icon: '📋' },
          { label: 'Export Formats', value: 'PDF', icon: '📥' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="rounded-2xl border-2 border-slate-200 bg-white p-6 text-center shadow-elevation-2"
          >
            <div className="text-4xl">{stat.icon}</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

