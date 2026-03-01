'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/utils/cn';
import { getTimeSeriesData, collectAnalyticsData, type TimeSeriesData } from '@/utils/analytics';

interface ProgressChartsProps {
  className?: string;
}

const COLORS = {
  jobsApplied: '#3b82f6',
  resumeUpdates: '#8b5cf6',
  assessmentsCompleted: '#f59e0b',
  questionsPracticed: '#ec4899',
};

export function ProgressCharts({ className }: ProgressChartsProps) {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    const data = getTimeSeriesData(selectedPeriod);
    setTimeSeriesData(data);
  }, [selectedPeriod]);

  const analytics = collectAnalyticsData();

  // Calculate category breakdown for pie chart
  const categoryData = [
    { name: 'Jobs Applied', value: analytics.jobs.applied, color: COLORS.jobsApplied },
    { name: 'Skills Assessed', value: analytics.skills.assessed, color: COLORS.assessmentsCompleted },
    { name: 'Questions Practiced', value: analytics.interviews.practiced, color: COLORS.questionsPracticed },
    { name: 'Resumes Created', value: analytics.resume.totalResumes, color: COLORS.resumeUpdates },
  ].filter((item) => item.value > 0);

  // Calculate weekly aggregate
  const weeklyData = [];
  for (let i = 0; i < timeSeriesData.length; i += 7) {
    const week = timeSeriesData.slice(i, i + 7);
    if (week.length > 0) {
      weeklyData.push({
        week: `Week ${Math.floor(i / 7) + 1}`,
        jobsApplied: week.reduce((sum, d) => sum + d.jobsApplied, 0),
        resumeUpdates: week.reduce((sum, d) => sum + d.resumeUpdates, 0),
        assessmentsCompleted: week.reduce((sum, d) => sum + d.assessmentsCompleted, 0),
        questionsPracticed: week.reduce((sum, d) => sum + d.questionsPracticed, 0),
      });
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Period Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Progress Charts</h2>
          <p className="mt-1 text-sm text-slate-600">Visual insights into your preparation journey</p>
        </div>
        <div className="flex gap-2">
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-all',
                selectedPeriod === days
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'border-2 border-slate-200 bg-white text-slate-700 hover:border-purple-300'
              )}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Activity Over Time - Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
      >
        <h3 className="mb-4 text-lg font-bold text-slate-900">Daily Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="jobsApplied"
              stroke={COLORS.jobsApplied}
              strokeWidth={2}
              name="Jobs Applied"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="resumeUpdates"
              stroke={COLORS.resumeUpdates}
              strokeWidth={2}
              name="Resume Updates"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="assessmentsCompleted"
              stroke={COLORS.assessmentsCompleted}
              strokeWidth={2}
              name="Assessments"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="questionsPracticed"
              stroke={COLORS.questionsPracticed}
              strokeWidth={2}
              name="Questions"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Summary - Bar Chart */}
      {weeklyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-900">Weekly Activity Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="jobsApplied" fill={COLORS.jobsApplied} name="Jobs Applied" />
              <Bar dataKey="resumeUpdates" fill={COLORS.resumeUpdates} name="Resume Updates" />
              <Bar dataKey="assessmentsCompleted" fill={COLORS.assessmentsCompleted} name="Assessments" />
              <Bar dataKey="questionsPracticed" fill={COLORS.questionsPracticed} name="Questions" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Category Distribution - Pie Chart */}
      {categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-900">Activity Distribution</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-3">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
