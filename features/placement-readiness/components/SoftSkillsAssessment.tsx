'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  getAssessmentQuestions,
  calculateAssessmentResult,
  saveAssessmentResult,
  getRecommendations,
  getAllSoftSkills,
  AssessmentAnswer,
  AssessmentResult,
} from '@/features/placement-readiness/lib/softSkills';

interface SoftSkillsAssessmentProps {
  className?: string;
}

const CATEGORY_INFO = {
  communication: { name: 'Communication', color: '#3b82f6', icon: '💬' },
  leadership: { name: 'Leadership', color: '#8b5cf6', icon: '👑' },
  teamwork: { name: 'Teamwork', color: '#10b981', icon: '🤝' },
  problemSolving: { name: 'Problem Solving', color: '#f59e0b', icon: '🧩' },
  adaptability: { name: 'Adaptability', color: '#ec4899', icon: '🔄' },
  timeManagement: { name: 'Time Management', color: '#14b8a6', icon: '⏰' },
};

export function SoftSkillsAssessment({ className }: SoftSkillsAssessmentProps) {
  const questions = getAssessmentQuestions();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      skillId: currentQuestion.skillId,
      value,
    };

    const newAnswers = [...answers.filter((a) => a.questionId !== currentQuestion.id), newAnswer];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete assessment
      const assessmentResult = calculateAssessmentResult(newAnswers);
      saveAssessmentResult(assessmentResult);
      setResult(assessmentResult);
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
    setIsComplete(false);
  };

  const getCurrentAnswer = () => {
    return answers.find((a) => a.questionId === currentQuestion?.id);
  };

  if (isComplete && result) {
    return (
      <ResultsView result={result} onRestart={handleRestart} className={className} />
    );
  }

  return (
    <div className={cn('mx-auto max-w-3xl space-y-6', className)}>
      {/* Progress Bar */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">
            Question {currentStep + 1} of {questions.length}
          </p>
          <p className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</p>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-elevation-3"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = getCurrentAnswer()?.value === option.value;
              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.value)}
                  className={cn(
                    'w-full rounded-xl border-2 p-4 text-left font-semibold transition-all',
                    isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <span className="text-sm text-slate-500">{option.value}/5</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors',
                currentStep === 0
                  ? 'cursor-not-allowed text-slate-400'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <p className="text-sm text-slate-600">
              {getCurrentAnswer() ? 'Click an option to change your answer' : 'Select an option to continue'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface ResultsViewProps {
  result: AssessmentResult;
  onRestart: () => void;
  className?: string;
}

function ResultsView({ result, onRestart, className }: ResultsViewProps) {
  const recommendations = getRecommendations(result);
  const skills = getAllSoftSkills();

  return (
    <div className={cn('mx-auto max-w-5xl space-y-6', className)}>
      {/* Header */}
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center shadow-elevation-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-4xl"
        >
          🎉
        </motion.div>
        <h1 className="text-3xl font-bold text-slate-900">Assessment Complete!</h1>
        <p className="mt-2 text-slate-600">Here's your soft skills profile</p>
      </div>

      {/* Category Scores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(result.categoryScores).map(([category, score]) => {
          const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
          const percentage = (score / 5) * 100;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{info.icon}</span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{info.name}</h3>
                    <p className="text-2xl font-bold" style={{ color: info.color }}>
                      {score.toFixed(1)}/5
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: info.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-elevation-3">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Skills Radar</h2>
        <RadarChart categoryScores={result.categoryScores} />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 shadow-elevation-2">
          <h2 className="mb-4 text-xl font-bold text-amber-900">💡 Recommendations</h2>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-sm text-amber-900"
              >
                <svg className="h-5 w-5 flex-shrink-0 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 rounded-lg border-2 border-purple-300 bg-purple-50 px-6 py-3 font-semibold text-purple-700 transition-colors hover:bg-purple-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

interface RadarChartProps {
  categoryScores: Record<string, number>;
}

function RadarChart({ categoryScores }: RadarChartProps) {
  const size = 400;
  const center = size / 2;
  const maxRadius = size / 2 - 60;
  const levels = 5;

  const categories = Object.keys(CATEGORY_INFO);
  const angleStep = (Math.PI * 2) / categories.length;

  // Calculate points for the data polygon
  const dataPoints = categories.map((category, index) => {
    const score = categoryScores[category] || 0;
    const radius = (score / 5) * maxRadius;
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background levels */}
        {Array.from({ length: levels }).map((_, i) => {
          const radius = ((i + 1) / levels) * maxRadius;
          const points = categories.map((_, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${x},${y}`;
          });
          return (
            <polygon
              key={i}
              points={points.join(' ')}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {categories.map((_, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const x = center + maxRadius * Math.cos(angle);
          const y = center + maxRadius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#cbd5e1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          d={dataPath}
          fill="url(#gradient)"
          stroke="#8b5cf6"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Data points */}
        {dataPoints.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="6"
            fill="#8b5cf6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          />
        ))}

        {/* Labels */}
        {categories.map((category, index) => {
          const info = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];
          const angle = angleStep * index - Math.PI / 2;
          const labelRadius = maxRadius + 30;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          return (
            <text
              key={category}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold fill-slate-700"
            >
              {info.icon} {info.name}
            </text>
          );
        })}

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
