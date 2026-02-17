import { ReactNode } from 'react'
import Badge from '../Badge'
import ProgressIndicator from '../ProgressIndicator'

interface TopBarProps {
  projectName: string
  currentStep: number
  totalSteps: number
  status: 'not-started' | 'in-progress' | 'shipped'
}

export default function TopBar({ 
  projectName, 
  currentStep, 
  totalSteps, 
  status 
}: TopBarProps) {
  return (
    <div className="border-b border-border bg-surface-light">
      <div className="max-w-[1440px] mx-auto px-40 py-16">
        <div className="flex items-center justify-between">
          <div className="font-sans font-semibold text-body-lg text-primary">
            {projectName}
          </div>
          
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={totalSteps}
          />
          
          <Badge status={status} />
        </div>
      </div>
    </div>
  )
}
