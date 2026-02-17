'use client'

import TopNav from './TopNav'

type ResumeBuilderShellProps = {
  children: React.ReactNode
}

export default function ResumeBuilderShell({ children }: ResumeBuilderShellProps) {
  return (
    <div className="resume-builder">
      <div className="app-shell">
        <TopNav />
        {children}
      </div>
    </div>
  )
}
