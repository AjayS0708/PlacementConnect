'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jobs, Job } from '@/features/job-notification/data/jobs'
import JobCard from '@/features/job-notification/components/JobCard'
import JobModal from '@/features/job-notification/components/JobModal'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import Toast from '@/components/Toast'
import { SkeletonJobCard, SkeletonStatCard } from '@/components/Skeleton'
import { FilterEmptyState } from '@/components/EmptyState'
import { calculateMatchScore, getPreferencesFromStorage, JobPreferences } from '@/features/job-notification/utils/matchScore'
import { JobStatus, getJobStatus } from '@/features/job-notification/utils/statusTracker'

type JobWithScore = Job & { matchScore: number }

interface ToastData {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export default function DashboardPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [preferences, setPreferences] = useState<JobPreferences | null>(null)
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('all')
  const [mode, setMode] = useState('all')
  const [experience, setExperience] = useState('all')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('matchScore')
  const [showOnlyMatches, setShowOnlyMatches] = useState(false)
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Simulate initial loading and load data from localStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      const saved = localStorage.getItem('savedJobs')
      if (saved) {
        setSavedJobs(JSON.parse(saved))
      }

      const prefs = getPreferencesFromStorage()
      setPreferences(prefs)
      
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId]
    
    setSavedJobs(newSavedJobs)
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs))
  }

  // Get unique values for filters
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(jobs.map(j => j.location)))
    return ['all', ...uniqueLocations.sort()]
  }, [])

  // Calculate match scores and filter/sort jobs
  const jobsWithScores = useMemo<JobWithScore[]>(() => {
    return jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job, preferences)
    }))
  }, [preferences])

  const filteredJobs = useMemo(() => {
    let filtered = jobsWithScores

    // Filter by keyword (AND logic with other filters)
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(lowerKeyword) ||
        job.company.toLowerCase().includes(lowerKeyword) ||
        job.description.toLowerCase().includes(lowerKeyword)
      )
    }

    // Filter by location (AND)
    if (location !== 'all') {
      filtered = filtered.filter(job => job.location === location)
    }

    // Filter by mode (AND)
    if (mode !== 'all') {
      filtered = filtered.filter(job => job.mode === mode)
    }

    // Filter by experience (AND)
    if (experience !== 'all') {
      filtered = filtered.filter(job => job.experience === experience)
    }

    // Filter by source (AND)
    if (source !== 'all') {
      filtered = filtered.filter(job => job.source === source)
    }

    // Filter by status (AND)
    if (status !== 'all') {
      filtered = filtered.filter(job => getJobStatus(job.id) === status)
    }

    // Filter by match threshold (AND)
    if (showOnlyMatches && preferences) {
      filtered = filtered.filter(job => job.matchScore >= preferences.minMatchScore)
    }

    // Sort
    if (sortBy === 'latest') {
      filtered = [...filtered].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
    } else if (sortBy === 'matchScore') {
      filtered = [...filtered].sort((a, b) => b.matchScore - a.matchScore)
    } else if (sortBy === 'salary') {
      filtered = [...filtered].sort((a, b) => {
        // Extract numeric values from salary strings for simple comparison
        const extractNumber = (str: string) => {
          const digits = str.replace(/[^0-9]/g, '')
          return digits ? parseInt(digits, 10) : 0
        }
        return extractNumber(b.salaryRange) - extractNumber(a.salaryRange)
      })
    }

    return filtered
  }, [jobsWithScores, keyword, location, mode, experience, source, status, sortBy, showOnlyMatches, preferences])

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Header Section with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 shadow-elevation-3"
      >
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-2.5">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Job Notifications
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {filteredJobs.length}
              </span>
              <span className="text-sm font-medium text-slate-600">
                jobs found
              </span>
            </div>
            
            {preferences && filteredJobs.length > 0 && (
              <>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Avg Match:</span>
                  <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-sm font-semibold text-white">
                    {Math.round(filteredJobs.reduce((sum, j) => sum + j.matchScore, 0) / filteredJobs.length)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">Best:</span>
                  <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white">
                    {Math.max(...filteredJobs.map(j => j.matchScore))}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Banner if preferences not set */}
      <AnimatePresence>
        {!preferences && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-elevation-2">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-gradient-to-br from-amber-500 to-orange-500 p-2.5 text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-900">
                    Set your preferences to activate intelligent matching
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    Visit Settings to configure your job preferences and enable smart match scoring.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card padding="lg" className="shadow-elevation-2">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by title, company, or description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                fullWidth
                className="pl-12"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
              </select>

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Sources</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Indeed">Indeed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="latest">Latest First</option>
                <option value="matchScore">Match Score</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="Not Applied">Not Applied</option>
                <option value="Applied">Applied</option>
                <option value="Rejected">Rejected</option>
                <option value="Selected">Selected</option>
              </select>
            </div>

            {/* Show only matches toggle */}
            {preferences && (
              <div className="rounded-xl border-t-2 border-slate-200 pt-4">
                <Checkbox
                  checked={showOnlyMatches}
                  onChange={setShowOnlyMatches}
                  label={
                    <span className="text-sm font-medium text-slate-700">
                      Show only jobs above my threshold (
                      <span className="font-bold text-blue-600">{preferences.minMatchScore}%</span>
                      )
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Jobs Grid */}
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <SkeletonJobCard />
            </motion.div>
          ))}
        </motion.div>
      ) : filteredJobs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <JobCard
                job={job}
                matchScore={job.matchScore}
                showMatchScore={preferences !== null}
                onView={() => setSelectedJob(job)}
                onSave={() => handleSaveJob(job.id)}
                isSaved={savedJobs.includes(job.id)}
                onStatusChange={(status) => showToast(`Status updated: ${status}`, 'success')}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card padding="lg" className="shadow-elevation-2">
          <FilterEmptyState />
        </Card>
      )}

      {/* Job Modal */}
      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onSave={() => selectedJob && handleSaveJob(selectedJob.id)}
        isSaved={selectedJob ? savedJobs.includes(selectedJob.id) : false}
      />

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

