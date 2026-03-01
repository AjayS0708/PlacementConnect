'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/features/placement-readiness/components/ui/card';
import { getSelectedOrLatestAnalysis } from '@/features/placement-readiness/lib/storage';

const skillData = [
  { skill: 'DSA', score: 75 },
  { skill: 'System Design', score: 60 },
  { skill: 'Communication', score: 80 },
  { skill: 'Resume', score: 85 },
  { skill: 'Aptitude', score: 70 },
];

const weeklyActivity = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: false },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: true },
];

const assessments = [
  { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', time: 'Wednesday, 2:00 PM' },
  { title: 'HR Interview Prep', time: 'Friday, 11:00 AM' },
];

export function DashboardPage() {
  const activeAnalysis = getSelectedOrLatestAnalysis();
  const readinessScore = activeAnalysis?.finalScore ?? 72;
  const [chartReady, setChartReady] = useState(false);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    setChartReady(true);
    const timer = setTimeout(() => setShowScore(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Determine status based on score
  const getStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (score >= 60) return { label: 'Good Progress', color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    return { label: 'Needs Focus', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
  };

  const status = getStatus(readinessScore);

  // Skill breakdown percentages
  const skills = [
    { name: 'Technical Skills', score: 75, color: 'bg-primary' },
    { name: 'Communication', score: 80, color: 'bg-blue-500' },
    { name: 'Resume Quality', score: 85, color: 'bg-emerald-500' },
    { name: 'Problem Solving', score: 60, color: 'bg-purple-500' },
  ];

  const dpCompleted = 3;
  const dpTotal = 10;
  const dpProgress = (dpCompleted / dpTotal) * 100;
  const isPracticeComplete = dpCompleted >= dpTotal;

  const problemsSolved = 12;
  const weeklyTarget = 20;
  const weeklyProgress = (problemsSolved / weeklyTarget) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* Modern Readiness Score Card */}
      <Card className="relative overflow-hidden xl:col-span-2">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${status.color} opacity-5`} />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Overall Readiness</CardTitle>
              <CardDescription>Your current placement preparation benchmark</CardDescription>
            </div>
            <div className={`rounded-full border ${status.border} ${status.bg} px-4 py-2`}>
              <span className={`text-sm font-semibold ${status.text}`}>{status.label}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Score Display */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                {/* Decorative rings */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${status.color} opacity-20 blur-2xl`} />
                
                <div className="relative rounded-full bg-gradient-to-br from-slate-50 to-slate-100 p-12 shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className={`bg-gradient-to-br ${status.color} bg-clip-text text-7xl font-bold text-transparent`}>
                      {showScore && <CountUp end={readinessScore} duration={2} />}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-400">/100</div>
                  </div>
                </div>
              </motion.div>

              <p className="text-center text-sm text-slate-600">
                {readinessScore >= 80 && "You're well prepared! Keep up the momentum."}
                {readinessScore >= 60 && readinessScore < 80 && "Good progress! Focus on weak areas."}
                {readinessScore < 60 && "Time to intensify your preparation."}
              </p>
            </div>

            {/* Skills Breakdown */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-slate-900">Preparation Areas</h4>
              
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{skill.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{skill.score}%</span>
                  </div>
                  
                  <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: 'easeOut' }}
                      className={`h-full ${skill.color} relative`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`mt-4 w-full rounded-lg bg-gradient-to-r ${status.color} px-6 py-3 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl`}
              >
                View Detailed Analysis
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown - Redesigned */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <CardTitle>Skill Breakdown</CardTitle>
              <CardDescription>Radar view of current strengths and weak spots</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="w-full overflow-x-auto">
            <div className="mx-auto h-64 min-w-[320px] sm:h-72">
              {chartReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={skillData}
                    cx="50%"
                    cy="52%"
                    outerRadius="62%"
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                  >
                    <defs>
                      <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }} />
                    <Radar
                      dataKey="score"
                      stroke="#a855f7"
                      fill="url(#radarGradient)"
                      fillOpacity={0.6}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Practice - Redesigned */}
      <Card className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isPracticeComplete ? 'bg-gradient-to-br from-emerald-500/5 to-teal-500/5' : 'bg-gradient-to-br from-blue-500/5 to-cyan-500/5'}`} />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg ${isPracticeComplete ? 'bg-gradient-to-br from-emerald-500 to-teal-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'} p-2`}>
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <CardTitle>Continue Practice</CardTitle>
              <CardDescription>
                {isPracticeComplete ? 'Great work. Keep your skills sharp with a quick review.' : 'Pick up where you left off.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-600">Last topic</p>
            <p className="mt-1 text-xl font-bold text-slate-900">Dynamic Programming</p>
          </div>

          {isPracticeComplete ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5"
            >
              <div className="flex items-start gap-3">
                <svg className="h-6 w-6 shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-emerald-900">All topics complete!</p>
                  <p className="mt-1 text-sm text-emerald-700">You can review solved topics to reinforce key patterns.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">Progress</span>
                <span className="font-semibold text-slate-900">{dpCompleted}/{dpTotal} completed</span>
              </div>
              
              <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dpProgress}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{Math.round(dpProgress)}% complete</span>
                <span className="font-medium text-blue-600">{dpTotal - dpCompleted} remaining</span>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-xl ${isPracticeComplete ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} px-6 py-3.5 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl`}
          >
            {isPracticeComplete ? 'Review Topics' : 'Continue Learning'}
          </motion.button>
        </CardContent>
      </Card>

      {/* Weekly Goals - Redesigned */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <CardTitle>Weekly Goals</CardTitle>
              <CardDescription>
                <span className="font-semibold text-indigo-600">{problemsSolved}/{weeklyTarget}</span> problems solved this week
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{Math.round(weeklyProgress)}%</div>
              <div className="text-xs text-slate-500">Complete</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative space-y-5">
          <div className="relative h-4 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weeklyProgress}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-slate-600">This Week's Activity</p>
            <div className="flex items-center justify-between gap-2">
              {weeklyActivity.map((entry, index) => (
                <motion.div
                  key={entry.day}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`relative h-10 w-10 rounded-xl border-2 transition-all ${
                      entry.active
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {entry.active && (
                      <svg className="h-full w-full p-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${entry.active ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {entry.day}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments - Redesigned */}
      <Card className="relative overflow-hidden xl:col-span-2">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-orange-500 to-red-500 p-2">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <CardTitle>Upcoming Assessments</CardTitle>
              <CardDescription>Your scheduled sessions for this week</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid gap-4 sm:grid-cols-3">
            {assessments.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-orange-300 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-transform group-hover:scale-150" />
                
                <div className="relative">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="rounded-lg bg-gradient-to-br from-orange-100 to-red-100 p-2">
                      <svg className="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="mb-2 font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h4>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.time}</span>
                  </div>
                  
                  <button className="mt-4 w-full rounded-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 text-sm font-semibold text-orange-700 transition-all hover:border-orange-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100">
                    Set Reminder
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


