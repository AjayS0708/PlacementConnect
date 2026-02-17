'use client'

import { useState, useEffect, useMemo } from 'react'
import { jobs, Job } from '@/data/jobs'
import JobCard from '@/components/JobCard'
import JobModal from '@/components/JobModal'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import Toast from '@/components/Toast'
import { calculateMatchScore, getPreferencesFromStorage, JobPreferences } from '@/utils/matchScore'
import { JobStatus, getJobStatus } from '@/utils/statusTracker'

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

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Load saved jobs and preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs')
    if (saved) {
      setSavedJobs(JSON.parse(saved))
    }

    const prefs = getPreferencesFromStorage()
    setPreferences(prefs)
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
          const match = str.match(/₹([\d,]+)/)
          return match ? parseInt(match[1].replace(/,/g, '')) : 0
        }
        return extractNumber(b.salaryRange) - extractNumber(a.salaryRange)
      })
    }

    return filtered
  }, [jobsWithScores, keyword, location, mode, experience, source, status, sortBy, showOnlyMatches, preferences])

  return (
    <div className="max-w-[1400px] mx-auto space-y-40">
      <div className="space-y-24">
        <h1 className="font-serif text-[56px] font-bold text-primary leading-tight">
          Dashboard
        </h1>
        <div className="flex items-center gap-24">
          <p className="font-sans text-[18px] text-[#666666]">
            {filteredJobs.length} jobs found
          </p>
          {preferences && filteredJobs.length > 0 && (
            <div className="flex items-center gap-16">
              <span className="text-[#CCCCCC]">•</span>
              <div className="flex items-center gap-16">
                <div className="font-sans text-[15px] text-[#999999]">
                  Avg Match: <span className="font-semibold text-primary">{Math.round(filteredJobs.reduce((sum, j) => sum + j.matchScore, 0) / filteredJobs.length)}%</span>
                </div>
                <span className="text-[#CCCCCC]">•</span>
                <div className="font-sans text-[15px] text-[#999999]">
                  Best: <span className="font-semibold text-primary">{Math.max(...filteredJobs.map(j => j.matchScore))}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Banner if preferences not set */}
      {!preferences && (
        <Card padding="md" className="bg-[#FFF8E1] border-[#FFA726] rounded-lg">
          <div className="flex items-start gap-16">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F57C00" strokeWidth="2" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-sans text-[16px] text-primary font-semibold">
                Set your preferences to activate intelligent matching.
              </p>
              <p className="font-sans text-[14px] text-[#666666] mt-4">
                Visit Settings to configure your job preferences and enable smart match scoring.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card padding="lg">
        <div className="space-y-24">
          <Input
            placeholder="Search by title, company, or description..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            fullWidth
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
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
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
            >
              <option value="all">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
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
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Naukri">Naukri</option>
              <option value="Indeed">Indeed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="matchScore">Match Score</option>
              <option value="salary">Salary</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-16 py-16 border border-[#E5E7EB] bg-white font-sans text-body-base text-primary transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20 rounded-lg shadow-sm cursor-pointer"
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
            <div className="pt-16 border-t border-border">
              <Checkbox
                checked={showOnlyMatches}
                onChange={setShowOnlyMatches}
                label={
                  <span className="font-sans text-body-base">
                    Show only jobs above my threshold ({preferences.minMatchScore}%)
                  </span>
                }
              />
            </div>
          )}
        </div>
      </Card>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={job.matchScore}
              showMatchScore={preferences !== null}
              onView={() => setSelectedJob(job)}
              onSave={() => handleSaveJob(job.id)}
              isSaved={savedJobs.includes(job.id)}
              onStatusChange={(status) => showToast(`Status updated: ${status}`, 'success')}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-16">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" className="mx-auto">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <div className="space-y-8">
                <p className="font-sans text-body-lg font-medium text-primary">
                  No roles match your criteria
                </p>
                <p className="font-sans text-body-base text-[#666666]">
                  Adjust filters or lower threshold to see more results.
                </p>
              </div>
            </div>
          </div>
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
