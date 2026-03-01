'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { getAnalyticsSummary, collectAnalyticsData } from '@/utils/analytics';

interface ReportExportProps {
  className?: string;
}

export function ReportExport({ className }: ReportExportProps) {
  const [exportFormat, setExportFormat] = useState<'txt' | 'json' | 'csv'>('txt');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExportText = () => {
    const summary = getAnalyticsSummary();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-connect-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccessMessage();
  };

  const handleExportJSON = () => {
    const data = collectAnalyticsData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-connect-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccessMessage();
  };

  const handleExportCSV = () => {
    const data = collectAnalyticsData();
    
    const csvLines = [
      'Category,Metric,Value',
      `Jobs,Total Tracked,${data.jobs.total}`,
      `Jobs,Applications Submitted,${data.jobs.applied}`,
      `Jobs,Jobs Saved,${data.jobs.saved}`,
      `Jobs,Average Match Score,${data.jobs.averageMatchScore.toFixed(1)}%`,
      `Resume,Total Resumes,${data.resume.totalResumes}`,
      `Resume,Completion Rate,${data.resume.completionRate}%`,
      `Skills,Assessments Taken,${data.skills.assessed}`,
      `Skills,Average Score,${data.skills.averageScore.toFixed(2)}/5`,
      `Interviews,Questions Practiced,${data.interviews.practiced}/${data.interviews.totalQuestions}`,
      `Interviews,Average Confidence,${data.interviews.averageConfidence.toFixed(1)}/5`,
      `Activity,Total Activities,${data.activity.totalActivities}`,
      `Activity,Active Days,${data.activity.activeDays}`,
      `Activity,Current Streak,${data.activity.streakDays} days`,
    ];

    const csv = csvLines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-connect-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleExport = () => {
    switch (exportFormat) {
      case 'txt':
        handleExportText();
        break;
      case 'json':
        handleExportJSON();
        break;
      case 'csv':
        handleExportCSV();
        break;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-elevation-3">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-3xl shadow-lg">
            📥
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Export Reports</h2>
            <p className="mt-1 text-sm text-slate-600">
              Download your analytics and progress data in various formats
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border-2 border-green-200 bg-green-50 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-900">Export Successful!</p>
              <p className="text-sm text-green-700">Your report has been downloaded</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <ExportFormatCard
          icon="📄"
          title="Text Report"
          description="Human-readable summary report"
          format="txt"
          isSelected={exportFormat === 'txt'}
          onSelect={() => setExportFormat('txt')}
          color="blue"
        />
        <ExportFormatCard
          icon="📊"
          title="JSON Data"
          description="Structured data for analysis"
          format="json"
          isSelected={exportFormat === 'json'}
          onSelect={() => setExportFormat('json')}
          color="purple"
        />
        <ExportFormatCard
          icon="📈"
          title="CSV Metrics"
          description="Spreadsheet-compatible format"
          format="csv"
          isSelected={exportFormat === 'csv'}
          onSelect={() => setExportFormat('csv')}
          color="green"
        />
      </div>

      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExport}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Download {exportFormat.toUpperCase()} Report
      </motion.button>

      {/* Info Card */}
      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-blue-900">What&apos;s included in reports?</p>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Job search progress and application statistics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Resume creation and update history</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Soft skills assessment scores and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Interview question practice progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Activity timeline and engagement metrics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ExportFormatCardProps {
  icon: string;
  title: string;
  description: string;
  format: string;
  isSelected: boolean;
  onSelect: () => void;
  color: 'blue' | 'purple' | 'green';
}

function ExportFormatCard({
  icon,
  title,
  description,
  format,
  isSelected,
  onSelect,
  color,
}: ExportFormatCardProps) {
  const colorClasses = {
    blue: {
      border: 'border-blue-300',
      bg: 'from-blue-50 to-indigo-50',
      selected: 'border-blue-500 shadow-md',
      text: 'text-blue-700',
    },
    purple: {
      border: 'border-purple-300',
      bg: 'from-purple-50 to-pink-50',
      selected: 'border-purple-500 shadow-md',
      text: 'text-purple-700',
    },
    green: {
      border: 'border-green-300',
      bg: 'from-green-50 to-emerald-50',
      selected: 'border-green-500 shadow-md',
      text: 'text-green-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'relative rounded-xl border-2 bg-gradient-to-br p-5 text-left transition-all',
        colors.bg,
        isSelected ? colors.selected : colors.border
      )}
    >
      {isSelected && (
        <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="text-4xl">{icon}</div>
      <h3 className={cn('mt-3 font-bold', colors.text)}>{title}</h3>
      <p className="mt-1 text-xs text-slate-600">{description}</p>
      <div className="mt-3 rounded-md bg-white/50 px-2 py-1 text-center text-xs font-mono font-semibold uppercase">
        .{format}
      </div>
    </motion.button>
  );
}
