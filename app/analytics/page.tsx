'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { ProgressCharts } from '@/components/ProgressCharts';
import { ActivityTimeline } from '@/components/ActivityTimeline';
import { ReportExport } from '@/components/ReportExport';
import { cn } from '@/utils/cn';

type TabType = 'overview' | 'charts' | 'timeline' | 'export';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'timeline', label: 'Timeline', icon: '⏰' },
    { id: 'export', label: 'Export', icon: '📥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-3"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-4xl shadow-lg">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
              <p className="mt-1 text-slate-600">
                Comprehensive insights into your placement preparation journey
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-purple-300'
                )}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <AnalyticsDashboard />}
          {activeTab === 'charts' && <ProgressCharts />}
          {activeTab === 'timeline' && <ActivityTimeline />}
          {activeTab === 'export' && <ReportExport />}
        </motion.div>
      </div>
    </div>
  );
}
