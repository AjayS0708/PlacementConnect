'use client'

import { useState, useEffect } from 'react'
import { Job } from '@/data/jobs'
import Button from './Button'
import Badge from './Badge'
import { getMatchScoreBadgeStyle } from '@/utils/matchScore'
import { JobStatus, getJobStatus, setJobStatus, statusColors, statusBadgeColors } from '@/utils/statusTracker'

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

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'LinkedIn': return 'bg-[#0A66C2] text-white'
      case 'Naukri': return 'bg-[#4A90E2] text-white'
      case 'Indeed': return 'bg-[#2164F3] text-white'
      default: return 'bg-primary text-white'
    }
  }

  const getDaysAgoText = (days: number) => {
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  return (
    <div className="border border-[#E5E7EB] bg-white p-24 transition-all duration-200 hover:border-accent hover:shadow-md rounded-lg">
      <div className="space-y-16">
        {/* Header */}
        <div className="flex items-start justify-between gap-16">
          <div className="flex-1 space-y-8">
            <h3 className="font-serif text-heading-sm text-primary">
              {job.title}
            </h3>
            <p className="font-sans text-body-base font-medium text-primary">
              {job.company}
            </p>
          </div>
          <div className="flex flex-col gap-8 items-end">
            <div className="flex gap-8 items-center">
              <span 
                className={`px-16 py-8 font-sans text-sm font-medium rounded-md ${getSourceColor(job.source)}`}
                style={{ borderRadius: '6px' }}
              >
                {job.source}
              </span>
              {isMounted && (
                <span 
                  className={`px-16 py-8 font-sans text-sm font-medium rounded-md text-white ${statusBadgeColors[currentStatus]}`}
                  style={{ borderRadius: '6px' }}
                >
                  {currentStatus}
                </span>
              )}
            </div>
            {showMatchScore && (
              <span 
                className="px-16 py-8 font-sans text-sm font-bold rounded-md shadow-sm"
                style={{
                  ...getMatchScoreBadgeStyle(matchScore),
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-8 font-sans text-body-base text-[#666666]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{job.location} • {job.mode}</span>
          </div>
          <div className="flex items-center gap-8 font-sans text-body-base text-[#666666]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>{job.experience} years</span>
          </div>
          <div className="font-sans text-[15px] text-[#374151] font-semibold">
            {job.salaryRange}
          </div>
        </div>

        {/* Posted */}
        <div className="pt-8 border-t border-border">
          <p className="font-sans text-sm text-[#999999]">
            Posted {getDaysAgoText(job.postedDaysAgo)}
          </p>
        </div>

        {/* Status Buttons */}
        <div className="space-y-8">
          <p className="font-sans text-xs font-semibold text-[#666666] uppercase tracking-wide">Application Status</p>
          <div className="grid grid-cols-2 gap-8">
            {(['Not Applied', 'Applied', 'Rejected', 'Selected'] as JobStatus[]).map((status) => {
              const isActive = currentStatus === status
              const getColorClasses = (status: JobStatus) => {
                switch (status) {
                  case 'Not Applied':
                    return isActive 
                      ? 'bg-[#9CA3AF] text-white border-[#6B7280]'
                      : 'bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#9CA3AF]'
                  case 'Applied':
                    return isActive
                      ? 'bg-[#3B82F6] text-white border-[#2563EB]'
                      : 'bg-white text-[#3B82F6] border-[#93C5FD] hover:border-[#3B82F6]'
                  case 'Rejected':
                    return isActive
                      ? 'bg-[#EF4444] text-white border-[#DC2626]'
                      : 'bg-white text-[#EF4444] border-[#FCA5A5] hover:border-[#EF4444]'
                  case 'Selected':
                    return isActive
                      ? 'bg-[#10B981] text-white border-[#059669]'
                      : 'bg-white text-[#10B981] border-[#6EE7B7] hover:border-[#10B981]'
                }
              }
              
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(status)
                  }}
                  className={`px-12 py-8 text-xs font-medium border transition-all duration-200 rounded-md ${getColorClasses(status)} ${isActive ? 'font-semibold' : ''}`}
                >
                  {status}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-8 pt-8">
          <Button variant="secondary" onClick={onView} className="flex-1 text-sm py-12">
            View
          </Button>
          <Button 
            variant="secondary" 
            onClick={onSave} 
            className={`flex-1 text-sm py-12 ${isSaved ? 'bg-accent text-white border-accent' : ''}`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="primary" onClick={handleApply} className="flex-1 text-sm py-12">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}
