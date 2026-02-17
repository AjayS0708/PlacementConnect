import { ReactNode } from 'react'

interface PrimaryWorkspaceProps {
  children: ReactNode
}

export default function PrimaryWorkspace({ children }: PrimaryWorkspaceProps) {
  return (
    <div className="flex-1 pr-24">
      {children}
    </div>
  )
}
