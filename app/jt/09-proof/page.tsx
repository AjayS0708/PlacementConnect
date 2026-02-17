'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Badge from '@/components/Badge'
import { getTestStatus } from '@/utils/testChecker'

type StepStatus = 'completed' | 'pending'

interface DevelopmentStep {
  id: string
  label: string
  status: StepStatus
}

interface ArtifactLinks {
  lovable: string
  github: string
  deployment: string
}

const ARTIFACTS_KEY = 'project-artifacts'
const SHIPPED_KEY = 'project-shipped'

export default function ProofPage() {
  const [steps, setSteps] = useState<DevelopmentStep[]>([
    { id: '1', label: 'Setup Dashboard & Job Cards', status: 'completed' },
    { id: '2', label: 'Implement Match Scoring System', status: 'completed' },
    { id: '3', label: 'Build Daily Digest Feature', status: 'completed' },
    { id: '4', label: 'Add Status Tracking', status: 'completed' },
    { id: '5', label: 'Create Saved Jobs Page', status: 'completed' },
    { id: '6', label: 'Setup Test Checklist', status: 'completed' },
    { id: '7', label: 'Collect Artifacts & Links', status: 'pending' },
    { id: '8', label: 'Ship to Production', status: 'pending' },
  ])

  const [artifacts, setArtifacts] = useState<ArtifactLinks>({
    lovable: '',
    github: '',
    deployment: '',
  })

  const [errors, setErrors] = useState<Partial<ArtifactLinks>>({})
  const [testStatus, setTestStatus] = useState({ passed: 0, total: 10, allPassed: false })
  const [shipStatus, setShipStatus] = useState<'not-started' | 'in-progress' | 'shipped'>('not-started')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // Load saved artifacts
    let loadedArtifacts = { lovable: '', github: '', deployment: '' }
    const saved = localStorage.getItem(ARTIFACTS_KEY)
    if (saved) {
      try {
        loadedArtifacts = JSON.parse(saved)
        setArtifacts(loadedArtifacts)
      } catch {}
    }

    // Check test status
    const status = getTestStatus()
    setTestStatus(status)

    // Check ship status
    const shipped = localStorage.getItem(SHIPPED_KEY)
    if (shipped === 'true') {
      setShipStatus('shipped')
    } else {
      // Determine if in progress
      const hasRequiredLinks = loadedArtifacts.github || loadedArtifacts.deployment
      if (hasRequiredLinks || status.allPassed) {
        setShipStatus('in-progress')
      }
    }

    // Update step statuses
    updateStepStatuses(loadedArtifacts, status)
  }, [])

  const updateStepStatuses = (currentArtifacts: ArtifactLinks, testState: typeof testStatus) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === '6') {
          return { ...step, status: testState.allPassed ? 'completed' : 'pending' }
        }
        if (step.id === '7') {
          // Only require GitHub and Deployment (Lovable is optional)
          const requiredLinksProvided =
            currentArtifacts.github && currentArtifacts.deployment
          return { ...step, status: requiredLinksProvided ? 'completed' : 'pending' }
        }
        if (step.id === '8') {
          const shipped = localStorage.getItem(SHIPPED_KEY) === 'true'
          return { ...step, status: shipped ? 'completed' : 'pending' }
        }
        return step
      })
    )
  }

  const validateUrl = (url: string): boolean => {
    if (!url) return false
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleInputChange = (field: keyof ArtifactLinks, value: string) => {
    const updated = { ...artifacts, [field]: value }
    setArtifacts(updated)
    
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Save to localStorage
    localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(updated))

    // Update ship status and step statuses
    const requiredLinksProvided = updated.github && updated.deployment
    if (requiredLinksProvided || testStatus.allPassed) {
      setShipStatus('in-progress')
    }
    
    updateStepStatuses(updated, testStatus)
  }

  const validateAllLinks = (): boolean => {
    const newErrors: Partial<ArtifactLinks> = {}
    let isValid = true

    // Lovable is optional - only validate if provided
    if (artifacts.lovable && !validateUrl(artifacts.lovable)) {
      newErrors.lovable = 'Please enter a valid URL'
      isValid = false
    }

    if (!artifacts.github) {
      newErrors.github = 'GitHub repository link is required'
      isValid = false
    } else if (!validateUrl(artifacts.github)) {
      newErrors.github = 'Please enter a valid URL'
      isValid = false
    }

    if (!artifacts.deployment) {
      newErrors.deployment = 'Deployment URL is required'
      isValid = false
    } else if (!validateUrl(artifacts.deployment)) {
      newErrors.deployment = 'Please enter a valid URL'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const canShip = (): boolean => {
    // Only require tests + GitHub + Deployment (Lovable is optional)
    return (
      testStatus.allPassed &&
      validateUrl(artifacts.github) &&
      validateUrl(artifacts.deployment)
    )
  }

  const handleCopySubmission = async () => {
    if (!validateAllLinks()) {
      return
    }

    // Include Lovable link only if provided
    const lovableSection = artifacts.lovable 
      ? `Lovable Project:\n${artifacts.lovable}\n\n` 
      : ''

    const submissionText = `------------------------------------------
Job Notification Tracker — Final Submission

${lovableSection}GitHub Repository:
${artifacts.github}

Live Deployment:
${artifacts.deployment}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced
------------------------------------------`

    try {
      await navigator.clipboard.writeText(submissionText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      alert('Failed to copy to clipboard. Please try again.')
    }
  }

  const handleMarkAsShipped = () => {
    if (!canShip()) {
      alert('Cannot ship: Please complete all tests and provide GitHub + Deployment links.')
      return
    }

    localStorage.setItem(SHIPPED_KEY, 'true')
    setShipStatus('shipped')
    updateStepStatuses(artifacts, testStatus)
  }

  const getStatusBadge = () => {
    switch (shipStatus) {
      case 'not-started':
        return <Badge variant="gray">Not Started</Badge>
      case 'in-progress':
        return <Badge variant="blue">In Progress</Badge>
      case 'shipped':
        return <Badge variant="green">Shipped</Badge>
    }
  }

  return (
    <div className="space-y-40">
      {/* Header */}
      <div className="space-y-16">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-heading-lg text-primary">
            Project 1 — Job Notification Tracker
          </h1>
          {getStatusBadge()}
        </div>
        <p className="font-sans text-body-base text-[#666666]">
          Final proof and submission system for production deployment.
        </p>
      </div>

      {/* Shipped Success Message */}
      {shipStatus === 'shipped' && (
        <Card className="bg-[#F0FDF4] border-[#86EFAC]">
          <div className="flex items-center gap-16">
            <div className="w-40 h-40 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="square"
              >
                <path d="M20 6L9 17L4 12" />
              </svg>
            </div>
            <div>
              <p className="font-sans text-body-base font-semibold text-[#065F46]">
                Project 1 Shipped Successfully.
              </p>
              <p className="font-sans text-sm text-[#047857] mt-4">
                All requirements met. Production deployment complete.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* A) Step Completion Summary */}
      <Card padding="lg">
        <div className="space-y-24">
          <h2 className="font-serif text-heading-md text-primary">
            Step Completion Summary
          </h2>
          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center justify-between py-12 border-b border-[#E5E7EB] last:border-b-0"
              >
                <div className="flex items-center gap-12">
                  <span className="font-sans text-sm text-[#9CA3AF] w-24">
                    {step.id}.
                  </span>
                  <span className="font-sans text-body-base text-primary">
                    {step.label}
                  </span>
                </div>
                <div>
                  {step.status === 'completed' ? (
                    <Badge variant="green">Completed</Badge>
                  ) : (
                    <Badge variant="gray">Pending</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* B) Artifact Collection Inputs */}
      <Card padding="lg">
        <div className="space-y-32">
          <div className="space-y-8">
            <h2 className="font-serif text-heading-md text-primary">
              Artifact Collection
            </h2>
            <p className="font-sans text-sm text-[#666666]">
              Required: GitHub repository and live deployment. Lovable link is optional if you built in VS Code.
            </p>
          </div>

          <div className="space-y-24">
            {/* Lovable Project Link - OPTIONAL */}
            <div className="space-y-8">
              <label className="font-sans text-sm font-medium text-primary">
                Lovable Project Link <span className="text-[#9CA3AF]">(Optional)</span>
              </label>
              <Input
                value={artifacts.lovable}
                onChange={(e) => handleInputChange('lovable', e.target.value)}
                placeholder="https://lovable.dev/projects/... (skip if built in VS Code)"
                className={errors.lovable ? 'border-[#EF4444]' : ''}
              />
              {errors.lovable && (
                <p className="font-sans text-sm text-[#EF4444]">{errors.lovable}</p>
              )}
            </div>

            {/* GitHub Repository Link */}
            <div className="space-y-8">
              <label className="font-sans text-sm font-medium text-primary">
                GitHub Repository Link <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                value={artifacts.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                placeholder="https://github.com/username/repo"
                className={errors.github ? 'border-[#EF4444]' : ''}
              />
              {errors.github && (
                <p className="font-sans text-sm text-[#EF4444]">{errors.github}</p>
              )}
            </div>

            {/* Deployed URL */}
            <div className="space-y-8">
              <label className="font-sans text-sm font-medium text-primary">
                Live Deployment URL <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                value={artifacts.deployment}
                onChange={(e) => handleInputChange('deployment', e.target.value)}
                placeholder="https://your-app.vercel.app"
                className={errors.deployment ? 'border-[#EF4444]' : ''}
              />
              {errors.deployment && (
                <p className="font-sans text-sm text-[#EF4444]">{errors.deployment}</p>
              )}
            </div>
          </div>

          {/* Test Status Info */}
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-16">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-primary">
                  Test Checklist Status
                </p>
                <p className="font-sans text-sm text-[#666666] mt-4">
                  {testStatus.passed} of {testStatus.total} tests passed
                </p>
              </div>
              <div>
                {testStatus.allPassed ? (
                  <Badge variant="green">All Passed</Badge>
                ) : (
                  <Badge variant="yellow">{testStatus.total - testStatus.passed} Pending</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Final Submission Export */}
      <Card padding="lg">
        <div className="space-y-24">
          <div className="space-y-8">
            <h2 className="font-serif text-heading-md text-primary">
              Final Submission
            </h2>
            <p className="font-sans text-sm text-[#666666]">
              Copy formatted submission text for delivery.
            </p>
          </div>

          <div className="flex gap-16">
            <Button
              variant="secondary"
              onClick={handleCopySubmission}
              disabled={!artifacts.github && !artifacts.deployment}
              fullWidth
            >
              {copySuccess ? (
                <span className="flex items-center justify-center gap-8">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17L4 12" />
                  </svg>
                  Copied!
                </span>
              ) : (
                'Copy Final Submission'
              )}
            </Button>

            {canShip() && shipStatus !== 'shipped' && (
              <Button variant="primary" onClick={handleMarkAsShipped} fullWidth>
                Mark as Shipped
              </Button>
            )}
          </div>

          {/* Shipping Requirements */}
          {!canShip() && (
            <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-16">
              <p className="font-sans text-sm font-medium text-[#92400E]">
                Shipping Requirements:
              </p>
              <ul className="mt-8 space-y-4 font-sans text-sm text-[#92400E]">
                {!testStatus.allPassed && (
                  <li className="flex items-center gap-8">
                    <span className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                    Complete all {testStatus.total} test checklist items
                  </li>
                )}
                {!validateUrl(artifacts.github) && (
                  <li className="flex items-center gap-8">
                    <span className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                    Provide valid GitHub repository link
                  </li>
                )}
                {!validateUrl(artifacts.deployment) && (
                  <li className="flex items-center gap-8">
                    <span className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                    Provide valid deployment URL
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
