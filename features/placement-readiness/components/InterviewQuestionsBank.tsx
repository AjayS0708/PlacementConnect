'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import {
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  searchQuestions,
  generatePracticeSession,
  getQuestionProgress,
  saveQuestionProgress,
  getProgressStats,
  getAllTags,
  type InterviewQuestion,
  type QuestionCategory,
  type DifficultyLevel,
  type QuestionProgress,
} from '@/features/placement-readiness/lib/interviewQuestions';

interface InterviewQuestionsBankProps {
  className?: string;
}

const CATEGORY_INFO: Record<QuestionCategory, { name: string; icon: string; color: string }> = {
  behavioral: { name: 'Behavioral', icon: '🎭', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  technical: { name: 'Technical', icon: '💻', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  situational: { name: 'Situational', icon: '🎯', color: 'bg-green-100 text-green-700 border-green-300' },
  'company-research': { name: 'Company', icon: '🏢', color: 'bg-amber-100 text-amber-700 border-amber-300' },
  'career-goals': { name: 'Career Goals', icon: '🚀', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  'problem-solving': { name: 'Problem Solving', icon: '🧩', color: 'bg-teal-100 text-teal-700 border-teal-300' },
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: 'text-green-600',
  medium: 'text-amber-600',
  hard: 'text-red-600',
};

export function InterviewQuestionsBank({ className }: InterviewQuestionsBankProps) {
  const [view, setView] = useState<'browse' | 'practice'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceQuestions, setPracticeQuestions] = useState<InterviewQuestion[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);

  const allQuestions = getAllQuestions();
  const stats = getProgressStats();

  const filteredQuestions = useMemo(() => {
    let questions = allQuestions;

    if (searchQuery) {
      questions = searchQuestions(searchQuery);
    } else {
      if (selectedCategory !== 'all') {
        questions = questions.filter((q) => q.category === selectedCategory);
      }
      if (selectedDifficulty !== 'all') {
        questions = questions.filter((q) => q.difficulty === selectedDifficulty);
      }
    }

    return questions;
  }, [allQuestions, selectedCategory, selectedDifficulty, searchQuery]);

  const handleStartPractice = (count: number) => {
    const filters: any = {};
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;

    const questions = generatePracticeSession(count, filters);
    setPracticeQuestions(questions);
    setCurrentPracticeIndex(0);
    setView('practice');
  };

  const handleEndPractice = () => {
    setView('browse');
    setPracticeQuestions([]);
    setCurrentPracticeIndex(0);
  };

  if (view === 'practice' && practiceQuestions.length > 0) {
    return (
      <PracticeView
        questions={practiceQuestions}
        currentIndex={currentPracticeIndex}
        onNext={() => setCurrentPracticeIndex((i) => Math.min(i + 1, practiceQuestions.length - 1))}
        onPrevious={() => setCurrentPracticeIndex((i) => Math.max(i - 1, 0))}
        onEnd={handleEndPractice}
        className={className}
      />
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
          <p className="text-sm font-semibold text-slate-600">Total Questions</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalQuestions}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
          <p className="text-sm font-semibold text-slate-600">Practiced</p>
          <p className="mt-2 text-3xl font-bold text-purple-600">{stats.practicedQuestions}</p>
          <p className="text-xs text-slate-500">{stats.practicedPercentage.toFixed(1)}% complete</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
          <p className="text-sm font-semibold text-slate-600">Avg Confidence</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.averageConfidence > 0 ? stats.averageConfidence.toFixed(1) : '--'}/5
          </p>
        </div>
        <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-elevation-2">
          <p className="text-sm font-semibold text-purple-700">Practice Session</p>
          <button
            onClick={() => handleStartPractice(5)}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Start (5 questions)
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search questions, tags, tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-2 border-slate-200 py-2 pl-10 pr-4 font-medium text-slate-900 placeholder-slate-400 focus:border-purple-400 focus:outline-none"
            />
          </div>

          {/* Category & Difficulty Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as QuestionCategory | 'all')}
                className="rounded-lg border-2 border-slate-200 px-3 py-1.5 text-sm font-medium"
              >
                <option value="all">All</option>
                {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Difficulty:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
                className="rounded-lg border-2 border-slate-200 px-3 py-1.5 text-sm font-medium"
              >
                <option value="all">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {(searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}
                className="text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                Clear filters
              </button>
            )}
          </div>

          <p className="text-sm text-slate-600">
            Showing {filteredQuestions.length} of {allQuestions.length} questions
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}

        {filteredQuestions.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-600">No questions found</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: InterviewQuestion;
}

function QuestionCard({ question }: QuestionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const progress = getQuestionProgress(question.id);
  const categoryInfo = CATEGORY_INFO[question.category];

  const handleMarkPracticed = (confidence: 1 | 2 | 3 | 4 | 5, notes: string) => {
    saveQuestionProgress({
      questionId: question.id,
      practiced: true,
      confidence,
      notes,
    });
    setShowProgress(false);
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-elevation-2">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className={cn('rounded-lg border-2 px-3 py-1 text-xs font-bold', categoryInfo.color)}>
                {categoryInfo.icon} {categoryInfo.name}
              </span>
              <span className={cn('text-xs font-bold uppercase', DIFFICULTY_COLORS[question.difficulty])}>
                {question.difficulty}
              </span>
              {progress?.practiced && (
                <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                  ✓ Practiced
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{question.question}</h3>
          </div>

          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex-shrink-0 rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
          >
            {isFlipped ? 'Hide' : 'Show'} Tips
          </button>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              #{tag}
            </span>
          ))}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 border-t-2 border-slate-100 pt-4">
                {/* Sample Answer */}
                {question.sampleAnswer && (
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-slate-700">📝 Sample Answer:</h4>
                    <p className="text-sm leading-relaxed text-slate-600">{question.sampleAnswer}</p>
                  </div>
                )}

                {/* Tips */}
                <div>
                  <h4 className="mb-2 text-sm font-bold text-slate-700">💡 Tips:</h4>
                  <ul className="space-y-1">
                    {question.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-purple-500">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                {question.commonMistakes && question.commonMistakes.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-slate-700">⚠️ Common Mistakes:</h4>
                    <ul className="space-y-1">
                      {question.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-red-500">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mark as Practiced */}
                <div className="flex items-center justify-between border-t-2 border-slate-100 pt-4">
                  <button
                    onClick={() => setShowProgress(!showProgress)}
                    className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
                  >
                    {progress?.practiced ? 'Update Progress' : 'Mark as Practiced'}
                  </button>
                  {progress && (
                    <div className="text-sm text-slate-600">
                      Confidence: <span className="font-bold text-purple-600">{progress.confidence}/5</span>
                    </div>
                  )}
                </div>

                {/* Progress Form */}
                <AnimatePresence>
                  {showProgress && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <ProgressForm onSave={handleMarkPracticed} onCancel={() => setShowProgress(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ProgressFormProps {
  onSave: (confidence: 1 | 2 | 3 | 4 | 5, notes: string) => void;
  onCancel: () => void;
}

function ProgressForm({ onSave, onCancel }: ProgressFormProps) {
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  return (
    <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
      <div className="mb-3">
        <label className="mb-2 block text-sm font-bold text-slate-700">How confident are you?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => setConfidence(level as 1 | 2 | 3 | 4 | 5)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg border-2 font-bold transition-all',
                confidence === level
                  ? 'border-purple-500 bg-purple-500 text-white'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-purple-300'
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-2 block text-sm font-bold text-slate-700">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key points to remember, areas to improve..."
          className="w-full rounded-lg border-2 border-slate-200 p-2 text-sm"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSave(confidence, notes)}
          className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="rounded-lg border-2 border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface PracticeViewProps {
  questions: InterviewQuestion[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onEnd: () => void;
  className?: string;
}

function PracticeView({ questions, currentIndex, onNext, onPrevious, onEnd, className }: PracticeViewProps) {
  const currentQuestion = questions[currentIndex];
  const [showAnswer, setShowAnswer] = useState(false);
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className={cn('mx-auto max-w-3xl space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Practice Session</h2>
        <button
          onClick={onEnd}
          className="rounded-lg border-2 border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          End Session
        </button>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-elevation-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</p>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-8 shadow-elevation-3">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'rounded-lg border-2 px-3 py-1 text-xs font-bold',
              CATEGORY_INFO[currentQuestion.category].color
            )}
          >
            {CATEGORY_INFO[currentQuestion.category].icon} {CATEGORY_INFO[currentQuestion.category].name}
          </span>
          <span className={cn('text-xs font-bold uppercase', DIFFICULTY_COLORS[currentQuestion.difficulty])}>
            {currentQuestion.difficulty}
          </span>
        </div>

        <h3 className="mb-6 text-2xl font-bold text-slate-900">{currentQuestion.question}</h3>

        {!showAnswer ? (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAnswer(true)}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white transition-transform hover:scale-105"
            >
              Show Tips & Sample Answer
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {currentQuestion.sampleAnswer && (
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="mb-2 font-bold text-purple-900">📝 Sample Answer:</h4>
                <p className="text-sm leading-relaxed text-purple-800">{currentQuestion.sampleAnswer}</p>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-bold text-blue-900">💡 Tips:</h4>
              <ul className="space-y-1">
                {currentQuestion.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 font-semibold transition-colors',
              currentIndex === 0
                ? 'cursor-not-allowed text-slate-400'
                : 'text-slate-700 hover:bg-slate-100'
            )}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => {
                setShowAnswer(false);
                onNext();
              }}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700"
            >
              Next
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onEnd}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
            >
              Complete Session
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
