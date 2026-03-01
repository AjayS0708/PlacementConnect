'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useState, useEffect } from 'react';

const stats = [
  { 
    label: 'Target Roles', 
    value: 18, 
    meta: 'Active filters',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    icon: '🎯'
  },
  { 
    label: 'Readiness Score', 
    value: 82, 
    suffix: '%',
    meta: 'Up 6% this month',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    icon: '📊'
  },
  { 
    label: 'Resume Iterations', 
    value: 5, 
    meta: 'Newest saved today',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    icon: '📄'
  },
];

const quickLinks = [
  {
    title: 'Job Notifications',
    description: 'Daily matched roles, organized by priority and fit.',
    href: '/job-notifications',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'from-blue-500/5 to-indigo-500/5',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Placement Readiness',
    description: 'Track progress across prep tracks and resources.',
    href: '/placement-readiness',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-500/5 to-teal-500/5',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Resume Builder',
    description: 'Polish profiles with instant preview + export.',
    href: '/resume-builder',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'from-purple-500/5 to-pink-500/5',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Analytics & Reports',
    description: 'Track progress and export insights from your activities.',
    href: '/analytics',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/5 to-orange-500/5',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const weeklyTasks = [
  { 
    text: 'Complete two mock interviews and log feedback.', 
    status: 'completed',
    color: 'emerald'
  },
  { 
    text: 'Update resume with the latest project impact metrics.', 
    status: 'in-progress',
    color: 'amber'
  },
  { 
    text: 'Review 5 high-signal job alerts and shortlist top picks.', 
    status: 'pending',
    color: 'indigo'
  },
];

const recentActivity = [
  { action: 'Applied to Senior Developer role at TechCorp', time: '2 hours ago', type: 'job' },
  { action: 'Completed System Design Practice', time: '5 hours ago', type: 'practice' },
  { action: 'Updated resume - Version 5', time: '1 day ago', type: 'resume' },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-elevation-3 lg:p-12"
      >
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl" />
        
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Dashboard Overview</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl"
          >
            Build momentum across every placement milestone.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
          >
            Placement Connect brings job discovery, readiness tracking, and resume crafting into one
            fluid workspace. Everything you need is now orchestrated in a single, focused view.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/job-notifications"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10">Review Jobs</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:animate-shimmer group-hover:opacity-100" />
            </Link>
            <Link
              href="/placement-readiness"
              className="group rounded-xl border-2 border-slate-300 bg-white px-8 py-4 font-semibold text-slate-700 transition-all hover:scale-105 hover:border-slate-400 hover:shadow-lg"
            >
              Check Readiness
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2 transition-all hover:scale-105 hover:shadow-elevation-3"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-5`} />
            
            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-slate-600">{stat.label}</p>
                  <div className={`mt-3 bg-gradient-to-br ${stat.color} bg-clip-text text-5xl font-bold text-transparent`}>
                    {mounted && <CountUp end={stat.value} duration={2} />}
                    {stat.suffix}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{stat.meta}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Quick Links */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Quick Access</h2>
          <div className="grid gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="group relative block overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all hover:scale-[1.02] hover:border-slate-300 hover:shadow-elevation-3"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.bgColor} opacity-0 transition-opacity group-hover:opacity-100`} />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`rounded-xl bg-gradient-to-br ${link.color} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}>
                      {link.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900">{link.title}</h3>
                        <svg className="h-6 w-6 text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{link.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Weekly Focus & Recent Activity */}
        <div className="space-y-6">
          {/* Weekly Focus */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
            className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-elevation-2"
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Weekly Focus</h3>
                <span className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 text-xs font-semibold text-white">
                  Week 3
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {weeklyTasks.map((task, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-1 h-5 w-5 shrink-0 rounded-full ${
                      task.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                      task.status === 'in-progress' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                      'bg-gradient-to-br from-indigo-500 to-purple-500'
                    } flex items-center justify-center`}>
                      {task.status === 'completed' && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm leading-relaxed text-slate-700">{task.text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.5 }}
            className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-elevation-2"
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    className="flex gap-3 border-l-2 border-slate-200 pl-4 transition-all hover:border-blue-500"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
