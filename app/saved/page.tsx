'use client'

import { useState, useEffect, useMemo } from 'react'
import { jobs, Job } from '@/data/jobs'
import JobCard from '@/components/JobCard'
import JobModal from '@/components/JobModal'
import Card from '@/components/Card'
import Toast from '@/components/Toast'
import { JobStatus } from '@/utils/statusTracker'

interface ToastData {
  id: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export default function SavedPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [toasts, setToasts] = useState<ToastData[]>([])

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Load saved jobs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedJobs')
    if (saved) {
      setSavedJobs(JSON.parse(saved))
    }
  }, [])

  const handleSaveJob = (jobId: string) => {
    const newSavedJobs = savedJobs.filter(id => id !== jobId)
    setSavedJobs(newSavedJobs)
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs))
  }

  // Get saved job objects
  const savedJobObjects = useMemo(() => {
    return jobs.filter(job => savedJobs.includes(job.id))
  }, [savedJobs])

  return (
    <div className="max-w-[1400px] mx-auto space-y-40">
      <div className="space-y-16">
        <h1 className="font-serif text-heading-lg text-primary">
          Saved Jobs
        </h1>
        <p className="font-sans text-body-base text-[#666666]">
          {savedJobObjects.length} {savedJobObjects.length === 1 ? 'job' : 'jobs'} saved for later
        </p>
      </div>

      {savedJobObjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {savedJobObjects.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onView={() => setSelectedJob(job)}
              onSave={() => handleSaveJob(job.id)}
              isSaved={true}
              onStatusChange={(status) => showToast(`Status updated: ${status}`, 'success')}
            />
          ))}
        </div>
      ) : (
        <Card padding="lg">
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-16 max-w-[500px]">
              <div className="w-64 h-64 mx-auto mb-24 border-2 border-border flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#999999]"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-heading-md text-primary">
                No saved jobs yet
              </h2>
              <p className="font-sans text-body-base text-[#666666]">
                When you save a job from your dashboard, it will appear here.
              </p>
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
