'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jobs, Job } from '@/features/job-notification/data/jobs'
import JobCard from '@/features/job-notification/components/JobCard'
import JobModal from '@/features/job-notification/components/JobModal'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Checkbox from '@/components/Checkbox'
import { SkeletonJobCard, SkeletonStatCard } from '@/components/Skeleton'
import { FilterEmptyState } from '@/components/EmptyState'
import { calculateMatchScore, getPreferencesFromStorage, JobPreferences } from '@/features/job-notification/utils/matchScore'
import { JobStatus, getJobStatus } from '@/features/job-notification/utils/statusTracker'
import { SmartSearchBar } from '@/features/job-notification/components/SmartSearchBar'
import { FilterPillGroup, MultiSelectFilter } from '@/features/job-notification/components/FilterPillGroup'
import { FilterPresets } from '@/features/job-notification/components/FilterPresets'
import { PaginationControls } from '@/features/job-notification/components/PaginationControls'
import { SortingControls } from '@/features/job-notification/components/SortingControls'
import { calculateMatchScoreWithBreakdown, getCustomWeights } from '@/features/job-notification/utils/advancedMatching'
import { paginateItems, sortJobs, JobSortOption, getSortPreference, saveSortPreference, getPaginationSettings, savePaginationSettings, JobWithScore as JobWithScoreType } from '@/features/job-notification/utils/jobFiltering'

type JobWithScore = Job & { matchScore: number }

export default function DashboardPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [preferences, setPreferences] = useState<JobPreferences | null>(null)
  const [keyword, setKeyword] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [location, setLocation] = useState('all')
  const [mode, setMode] = useState('all')
  const [experience, setExperience] = useState('all')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [sortOption, setSortOption] = useState<JobSortOption>('match-desc')
  const [showOnlyMatches, setShowOnlyMatches] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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
      
      // Load sort preference
      const savedSortOption = getSortPreference()
      setSortOption(savedSortOption)
      
      // Load pagination settings
      const paginationSettings = getPaginationSettings()
      setItemsPerPage(paginationSettings.itemsPerPage)
      
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

  // Pagination and sorting handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1) // Reset to first page
    savePaginationSettings(items)
  }

  const handleSortChange = (newSortOption: JobSortOption) => {
    setSortOption(newSortOption)
    saveSortPreference(newSortOption)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, selectedLocations, location, mode, experience, selectedSources, source, status, showOnlyMatches])

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

    // Filter by multi-select locations
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(job => selectedLocations.includes(job.location))
    }

    // Filter by location (AND) - keep for backward compatibility
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

    // Filter by multi-select sources
    if (selectedSources.length > 0) {
      filtered = filtered.filter(job => selectedSources.includes(job.source))
    }

    // Filter by source (AND) - keep for backward compatibility
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

    // Sort using new advanced sorting
    const sorted = sortJobs(filtered as JobWithScoreType[], sortOption)

    return sorted
  }, [jobsWithScores, keyword, selectedLocations, location, mode, experience, selectedSources, source, status, sortOption, showOnlyMatches, preferences])

  // Paginated jobs
  const paginatedResult = useMemo(() => {
    return paginateItems(filteredJobs, currentPage, itemsPerPage)
  }, [filteredJobs, currentPage, itemsPerPage])

  // Get active filter pills
  const activeFilterPills = useMemo(() => {
    const pills: Array<{ id: string; label: string; value: string; category: string }> = []
    
    selectedLocations.forEach((loc) => {
      pills.push({ id: `location-${loc}`, label: loc, value: loc, category: 'Location' })
    })
    
    selectedSources.forEach((src) => {
      pills.push({ id: `source-${src}`, label: src, value: src, category: 'Source' })
    })
    
    if (mode !== 'all') pills.push({ id: 'mode', label: mode, value: mode, category: 'Mode' })
    if (experience !== 'all') pills.push({ id: 'experience', label: experience, value: experience, category: 'Experience' })
    if (status !== 'all') pills.push({ id: 'status', label: status, value: status, category: 'Status' })
    
    return pills
  }, [selectedLocations, selectedSources, mode, experience, status])

  const handleRemoveFilter = (filterId: string) => {
    if (filterId.startsWith('location-')) {
      const loc = filterId.replace('location-', '')
      setSelectedLocations(selectedLocations.filter((l) => l !== loc))
    } else if (filterId.startsWith('source-')) {
      const src = filterId.replace('source-', '')
      setSelectedSources(selectedSources.filter((s) => s !== src))
    } else if (filterId === 'mode') {
      setMode('all')
    } else if (filterId === 'experience') {
      setExperience('all')
    } else if (filterId === 'status') {
      setStatus('all')
    }
  }

  const handleClearAllFilters = () => {
    setSelectedLocations([])
    setSelectedSources([])
    setLocation('all')
    setMode('all')
    setExperience('all')
    setSource('all')
    setStatus('all')
    setShowOnlyMatches(false)
  }

  // Generate search suggestions
  const searchSuggestions = useMemo(() => {
    if (!keyword || keyword.length < 2) return []
    
    const suggestions: Array<{ id: string; text: string; category: 'job' | 'company' | 'location' }> = []
    const lowerKeyword = keyword.toLowerCase()
    
    // Job title suggestions
    jobs.forEach((job) => {
      if (job.title.toLowerCase().includes(lowerKeyword) && 
          !suggestions.some(s => s.text === job.title)) {
        suggestions.push({ id: `job-${job.id}`, text: job.title, category: 'job' })
      }
    })
    
    // Company suggestions
    jobs.forEach((job) => {
      if (job.company.toLowerCase().includes(lowerKeyword) && 
          !suggestions.some(s => s.text === job.company)) {
        suggestions.push({ id: `company-${job.company}`, text: job.company, category: 'company' })
      }
    })
    
    // Location suggestions
    jobs.forEach((job) => {
      if (job.location.toLowerCase().includes(lowerKeyword) && 
          !suggestions.some(s => s.text === job.location)) {
        suggestions.push({ id: `location-${job.location}`, text: job.location, category: 'location' })
      }
    })
    
    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }, [keyword])

  // Get current filters for preset saving
  const getCurrentFilters = () => ({
    keyword,
    selectedLocations,
    selectedSources,
    location,
    mode,
    experience,
    source,
    status,
    sortOption,
    showOnlyMatches,
  })

  const handleLoadPreset = (filters: Record<string, any>) => {
    setKeyword(filters.keyword || '')
    setSelectedLocations(filters.selectedLocations || [])
    setSelectedSources(filters.selectedSources || [])
    setLocation(filters.location || 'all')
    setMode(filters.mode || 'all')
    setExperience(filters.experience || 'all')
    setSource(filters.source || 'all')
    setStatus(filters.status || 'all')
    setSortOption(filters.sortOption || 'match-desc')
    setShowOnlyMatches(filters.showOnlyMatches || false)
  }

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
            {/* Search Bar with Autocomplete */}
            <SmartSearchBar
              value={keyword}
              onChange={setKeyword}
              onSearch={(value) => setKeyword(value)}
              placeholder="Search by title, company, location, or skills..."
              suggestions={searchSuggestions}
              onSuggestionClick={(suggestion) => {
                setKeyword(suggestion.text)
              }}
              showRecentSearches={true}
            />

            {/* Active Filter Pills */}
            <FilterPillGroup
              filters={activeFilterPills}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Filter Presets */}
            <div className="flex justify-end">
              <FilterPresets
                currentFilters={getCurrentFilters()}
                onLoadPreset={handleLoadPreset}
              />
            </div>

            {/* Multi-Select Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MultiSelectFilter
                label="Locations"
                options={locations.slice(1).map((loc) => ({ value: loc, label: loc }))}
                selected={selectedLocations}
                onChange={setSelectedLocations}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />

              <MultiSelectFilter
                label="Sources"
                options={[
                  { value: 'LinkedIn', label: 'LinkedIn' },
                  { value: 'Naukri', label: 'Naukri' },
                  { value: 'Indeed', label: 'Indeed' },
                ]}
                selected={selectedSources}
                onChange={setSelectedSources}
                icon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
              />

              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Modes</option>
                <option value="Remote">🏠 Remote</option>
                <option value="Hybrid">🔄 Hybrid</option>
                <option value="Onsite">🏢 Onsite</option>
              </select>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Experience</option>
                <option value="Fresher">✨ Fresher</option>
                <option value="0-1">📝 0-1 years</option>
                <option value="1-3">📈 1-3 years</option>
                <option value="3-5">🚀 3-5 years</option>
              </select>
            </div>

            {/* Additional Filters Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Application Statuses</option>
                <option value="Not Applied">⚪ Not Applied</option>
                <option value="Applied">🔵 Applied</option>
                <option value="Rejected">🔴 Rejected</option>
                <option value="Selected">🟢 Selected</option>
              </select>

              <div className="sm:col-span-2 lg:col-span-2">
                <SortingControls
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                />
              </div>

              {preferences && (
                <div className="flex items-center rounded-xl border-2 border-slate-200 bg-white px-4 py-3">
                  <Checkbox
                    checked={showOnlyMatches}
                    onChange={setShowOnlyMatches}
                    label={
                      <span className="text-sm font-medium text-slate-700">
                        Only ≥{preferences.minMatchScore}% match
                      </span>
                    }
                  />
                </div>
              )}
            </div>
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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedResult.items.map((job, index) => (
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
                  onStatusChange={() => {}}
                />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Pagination Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <PaginationControls
              currentPage={paginatedResult.pagination.currentPage}
              totalPages={paginatedResult.pagination.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={paginatedResult.pagination.totalItems}
              startIndex={paginatedResult.pagination.startIndex}
              endIndex={paginatedResult.pagination.endIndex}
            />
          </motion.div>
        </>
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
    </div>
  )
}

