import { ReactNode } from 'react'
import TopBar from './TopBar'
import ContextHeader from './ContextHeader'
import ProofFooter from './ProofFooter'

interface PageLayoutProps {
  projectName: string
  currentStep: number
  totalSteps: number
  status: 'not-started' | 'in-progress' | 'shipped'
  headline: string
  subtext: string
  children: ReactNode
}

export default function PageLayout({
  projectName,
  currentStep,
  totalSteps,
  status,
  headline,
  subtext,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar
        projectName={projectName}
        currentStep={currentStep}
        totalSteps={totalSteps}
        status={status}
      />
      
      <ContextHeader 
        headline={headline}
        subtext={subtext}
      />
      
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-40 py-64">
          {children}
        </div>
      </main>
      
      <ProofFooter />
    </div>
  )
}
