'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchBreakdown } from '@/features/job-notification/utils/advancedMatching';
import { cn } from '@/utils/cn';

interface MatchScoreBreakdownProps {
  breakdown: MatchBreakdown;
  className?: string;
}

/**
 * MatchScoreBreakdown - Visual breakdown of match score components
 */
export function MatchScoreBreakdown({ breakdown, className }: MatchScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const breakdownItems = [
    {
      label: 'Title Keywords',
      score: breakdown.titleKeywordScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 25 : 0,
      details: breakdown.titleKeywordMatches.length > 0
        ? `Matched: ${breakdown.titleKeywordMatches.join(', ')}`
        : 'No matches',
      icon: '🎯',
    },
    {
      label: 'Description Keywords',
      score: breakdown.descriptionKeywordScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 15 : 0,
      details: breakdown.descriptionKeywordMatches.length > 0
        ? `Matched: ${breakdown.descriptionKeywordMatches.join(', ')}`
        : 'No matches',
      icon: '📝',
    },
    {
      label: 'Location',
      score: breakdown.locationScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 15 : 0,
      details: breakdown.locationMatch ? 'Preferred location' : 'Not in preferred locations',
      icon: '📍',
    },
    {
      label: 'Work Mode',
      score: breakdown.modeScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 10 : 0,
      details: breakdown.modeMatch ? 'Preferred mode' : 'Not in preferred modes',
      icon: '💼',
    },
    {
      label: 'Experience Level',
      score: breakdown.experienceScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 10 : 0,
      details: breakdown.experienceMatch ? 'Matches experience' : 'Different experience level',
      icon: '⭐',
    },
    {
      label: 'Skills',
      score: breakdown.skillsScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 15 : 0,
      details: breakdown.matchingSkills.length > 0
        ? `Matched: ${breakdown.matchingSkills.join(', ')}`
        : 'No skill matches',
      icon: '🛠️',
    },
    {
      label: 'Recency',
      score: breakdown.recencyScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 5 : 0,
      details: breakdown.recencyScore > 0 ? 'Recently posted' : 'Older posting',
      icon: '⏰',
    },
    {
      label: 'Source Quality',
      score: breakdown.sourceScore,
      maxScore: breakdown.maxPossibleScore > 0 ? 5 : 0,
      details: breakdown.sourceScore > 3 ? 'Premium source' : 'Standard source',
      icon: '🔗',
    },
  ];

  return (
    <div className={cn('', className)}>
      {/* Collapsed View - Just the overall score */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg border-2 border-slate-200 bg-white px-4 py-3 transition-all hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white',
              breakdown.normalizedScore >= 80 && 'bg-green-500',
              breakdown.normalizedScore >= 60 && breakdown.normalizedScore < 80 && 'bg-orange-500',
              breakdown.normalizedScore >= 40 && breakdown.normalizedScore < 60 && 'bg-blue-500',
              breakdown.normalizedScore < 40 && 'bg-slate-400'
            )}
          >
            {breakdown.normalizedScore}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Match Score</p>
            <p className="text-xs text-slate-600">
              {breakdown.totalScore} / {breakdown.maxPossibleScore} points
            </p>
          </div>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-5 w-5 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Expanded View - Detailed breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 overflow-hidden rounded-lg border-2 border-slate-200 bg-white"
          >
            <div className="p-4 space-y-3">
              <div className="border-b border-slate-200 pb-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Score Breakdown
                </p>
              </div>
              
              {breakdownItems.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium text-slate-900">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.score} / {item.maxScore}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: item.maxScore > 0 ? `${(item.score / item.maxScore) * 100}%` : '0%',
                      }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={cn(
                        'h-full rounded-full',
                        item.score >= item.maxScore * 0.8 && 'bg-green-500',
                        item.score >= item.maxScore * 0.5 && item.score < item.maxScore * 0.8 && 'bg-orange-500',
                        item.score < item.maxScore * 0.5 && 'bg-slate-400'
                      )}
                    />
                  </div>
                  
                  <p className="text-xs text-slate-600">{item.details}</p>
                </div>
              ))}
              
              {/* Overall summary */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3 border-t-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Overall Match</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-32 rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${breakdown.normalizedScore}%` }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className={cn(
                          'h-full rounded-full',
                          breakdown.normalizedScore >= 80 && 'bg-green-500',
                          breakdown.normalizedScore >= 60 && breakdown.normalizedScore < 80 && 'bg-orange-500',
                          breakdown.normalizedScore >= 40 && breakdown.normalizedScore < 60 && 'bg-blue-500',
                          breakdown.normalizedScore < 40 && 'bg-slate-400'
                        )}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {breakdown.normalizedScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
