'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/features/job-notification/data/jobs'
import Button from '@/components/Button'
import { getMatchScoreBadgeStyle } from '@/features/job-notification/utils/matchScore'
import { JobStatus, getJobStatus, setJobStatus, statusBadgeColors } from '@/features/job-notification/utils/statusTracker'

interface JobCardProps {
  job: Job
  matchScore?: number
  showMatchScore?: boolean
  onView: () => void
  onSave: () => void
  isSaved: boolean
  onStatusChange?: (status: JobStatus) => void
}

export default function JobCard({ job, matchScore = 0, showMatchScore = false, onView, onSave, isSaved, onStatusChange }: JobCardProps) {
  const [currentStatus, setCurrentStatus] = useState<JobStatus>('Not Applied')
  const [isMounted, setIsMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Load status from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true)
    setCurrentStatus(getJobStatus(job.id))
  }, [job.id])

  const handleApply = () => {
    window.open(job.applyUrl, '_blank')
    
    // Auto-update status to "Applied" if not already set
    if (currentStatus === 'Not Applied') {
      handleStatusChange('Applied')
    }
  }

  const handleStatusChange = (status: JobStatus) => {
    setCurrentStatus(status)
    setJobStatus(job.id, status)
    if (onStatusChange) {
      onStatusChange(status)
    }
  }

  const getSourceStyle = (source: string) => {
    switch (source) {
      case 'LinkedIn': 
        return { 
          bg: 'bg-gradient-to-br from-[#0A66C2] to-[#004182]',
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
          )
        }
      case 'Naukri': 
        return { 
          bg: 'bg-gradient-to-br from-[#4A90E2] to-[#357ABD]',
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-6h1.4l1.8 4.51L10.05 9h1.4L8.5 15zm4.75 0h-1.5V9h1.5v6zm4.75 0h-1.5V9h1.5v6z"/>
            </svg>
          )
        }
      case 'Indeed': 
        return { 
          bg: 'bg-gradient-to-br from-[#2164F3] to-[#1A4FCC]',
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M11.566 21.5v-8.538c0-.837-.679-1.517-1.517-1.517-.838 0-1.517.68-1.517 1.517V21.5H6.5v-8.538c0-1.933 1.567-3.5 3.549-3.5 1.981 0 3.548 1.567 3.548 3.5V21.5h-2.031zM11.5 7.5a2 2 0 100-4 2 2 0 000 4z"/>
              <circle cx="17.5" cy="6.5" r="1.5"/>
            </svg>
          )
        }
      default: 
        return { 
          bg: 'bg-gradient-to-br from-indigo-600 to-indigo-800',
          icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          )
        }
    }
  }

  const getDaysAgoText = (days: number) => {
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days <= 7) return `${days} days ago`
    if (days <= 14) return '1 week ago'
    if (days <= 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const getStatusConfig = (status: JobStatus) => {
    const configs = {
      'Not Applied': {
        color: 'from-slate-50 to-slate-100',
        textColor: 'text-slate-700',
        borderColor: 'border-slate-300',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        hoverGlow: 'hover:shadow-slate-200'
      },
      'Applied': {
        color: 'from-blue-500 to-blue-600',
        textColor: 'text-white',
        borderColor: 'border-blue-600',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        hoverGlow: 'hover:shadow-blue-200'
      },
      'Rejected': {
        color: 'from-red-500 to-red-600',
        textColor: 'text-white',
        borderColor: 'border-red-600',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        hoverGlow: 'hover:shadow-red-200'
      },
      'Selected': {
        color: 'from-green-500 to-green-600',
        textColor: 'text-white',
        borderColor: 'border-green-600',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        hoverGlow: 'hover:shadow-green-200'
      }
    }
    return configs[status]
  }

  const sourceStyle = getSourceStyle(job.source)

  return (
    <motion.div 
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Elevated Card with Modern Shadow */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300">
        
        {/* Gradient Accent Bar - Changes based on status */}
        <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b transition-all duration-300 ${
          currentStatus === 'Selected' ? 'from-green-400 to-green-600' :
          currentStatus === 'Applied' ? 'from-blue-400 to-blue-600' :
          currentStatus === 'Rejected' ? 'from-red-400 to-red-600' :
          'from-slate-300 to-slate-400'
        }`} />

        <div className="p-6 sm:p-7">
          {/* Header Section - Company & Role */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <motion.h3 
                className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-indigo-700 transition-colors duration-200"
                layout
              >
                {job.title}
              </motion.h3>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-sm">
                  {job.company.charAt(0)}
                </div>
                <p className="text-base font-semibold text-slate-700">
                  {job.company}
                </p>
              </div>
            </div>
            
            {/* Source Badge & Match Score */}
            <div className="flex flex-col gap-2.5 items-end">
              <motion.div 
                className={`flex items-center gap-2 px-3.5 py-2 ${sourceStyle.bg} text-white rounded-xl shadow-lg`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sourceStyle.icon}
                <span className="text-sm font-semibold">{job.source}</span>
              </motion.div>
              
              <AnimatePresence>
                {showMatchScore && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative"
                  >
                    <div 
                      className="px-3.5 py-2 rounded-xl shadow-lg font-bold text-sm backdrop-blur-sm"
                      style={{
                        background: `linear-gradient(135deg, ${matchScore >= 80 ? '#10b981, #059669' : matchScore >= 60 ? '#3b82f6, #2563eb' : '#f59e0b, #d97706'})`,
                        color: 'white',
                        boxShadow: `0 4px 12px ${matchScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : matchScore >= 60 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{matchScore}%</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Job Details Grid - Modern Icons */}
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Location */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{job.location} • {job.mode}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Experience</p>
                <p className="text-sm font-semibold text-slate-700 truncate">{job.experience} years</p>
              </div>
            </div>
          </div>

          {/* Salary & Posted */}
          <div className="mb-5 flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Compensation</p>
                <p className="text-base font-bold text-emerald-900">{job.salaryRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 border border-slate-200">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-slate-600">{getDaysAgoText(job.postedDaysAgo)}</span>
            </div>
          </div>

          {/* Application Status Pipeline */}
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Application Status
              </h4>
              {isMounted && (
                <motion.div
                  key={currentStatus}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r ${getStatusConfig(currentStatus).color} ${getStatusConfig(currentStatus).textColor} shadow-sm`}
                >
                  {getStatusConfig(currentStatus).icon}
                  {currentStatus}
                </motion.div>
              )}
            </div>
            
            {/* Status Timeline/Pipeline */}
            <div className="grid grid-cols-4 gap-2">
              {(['Not Applied', 'Applied', 'Rejected', 'Selected'] as JobStatus[]).map((status, index) => {
                const isActive = currentStatus === status
                const config = getStatusConfig(status)
                
                return (
                  <motion.button
                    key={status}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusChange(status)
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-300
                      ${isActive 
                        ? `bg-gradient-to-br ${config.color} ${config.textColor} ${config.borderColor} shadow-lg ${config.hoverGlow}`
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      {config.icon}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-[10px] sm:text-xs font-bold text-center leading-tight ${isActive ? '' : 'text-slate-600'}`}>
                      {status}
                    </span>

                    {/* Active Indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md flex items-center justify-center"
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${config.color}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Primary Actions - Enhanced CTAs */}
          <div className="flex gap-3">
            <motion.button
              onClick={onView}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </motion.button>
            
            <motion.button
              onClick={onSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow
                ${isSaved 
                  ? 'border-amber-400 bg-gradient-to-br from-amber-400 to-amber-500 text-white hover:from-amber-500 hover:to-amber-600' 
                  : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50'
                }
              `}
            >
              <svg className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </motion.button>
            
            <motion.button
              onClick={handleApply}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-bold text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Apply Now
            </motion.button>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none rounded-2xl"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

