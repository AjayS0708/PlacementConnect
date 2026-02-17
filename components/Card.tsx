import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

export default function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-[#E5E7EB] transition-standard rounded-lg shadow-sm',
        {
          'p-16': padding === 'sm',
          'p-24': padding === 'md',
          'p-40': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  )
}
