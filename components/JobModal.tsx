'use client'

import { Job } from '@/data/jobs'
import Button from './Button'
import { useEffect } from 'react'

interface JobModalProps {
  job: Job | null
  onClose: () => void
  onSave: () => void
  isSaved: boolean
}

export default function JobModal({ job, onClose, onSave, isSaved }: JobModalProps) {
  useEffect(() => {
    if (job) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [job])

  if (!job) return null

  const handleApply = () => {
    window.open(job.applyUrl, '_blank')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-primary/50 z-50 flex items-center justify-center p-24"
      onClick={handleBackdropClick}
    >
      <div className="bg-surface-light max-w-[800px] w-full max-h-[90vh] overflow-y-auto border-2 border-border">
        <div className="p-40 space-y-32">
          {/* Header */}
          <div className="flex items-start justify-between gap-24">
            <div className="flex-1 space-y-16">
              <h2 className="font-serif text-heading-lg text-primary">
                {job.title}
              </h2>
              <div className="space-y-8">
                <p className="font-sans text-body-lg font-medium text-primary">
                  {job.company}
                </p>
                <div className="flex items-center gap-16 font-sans text-body-base text-[#666666]">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.mode}</span>
                  <span>•</span>
                  <span>{job.experience} years</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-8 hover:bg-background transition-standard"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Salary */}
          <div className="pt-16 border-t border-border">
            <p className="font-sans text-body-lg text-accent font-semibold">
              {job.salaryRange}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-16">
            <h3 className="font-serif text-heading-sm text-primary">
              About the Role
            </h3>
            <p className="font-sans text-body-base text-primary leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-16">
            <h3 className="font-serif text-heading-sm text-primary">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-8">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-16 py-8 border border-border bg-background font-sans text-sm text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Source */}
          <div className="space-y-8">
            <p className="font-sans text-sm text-[#666666]">
              Source: {job.source}
            </p>
            <p className="font-sans text-sm text-[#999999]">
              Posted {job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo === 1 ? 'Yesterday' : `${job.postedDaysAgo} days ago`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-16 pt-24 border-t border-border">
            <Button
              variant="secondary"
              onClick={onSave}
              className={isSaved ? 'bg-accent text-white border-accent' : ''}
              fullWidth
            >
              {isSaved ? 'Saved' : 'Save for Later'}
            </Button>
            <Button variant="primary" onClick={handleApply} fullWidth>
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
