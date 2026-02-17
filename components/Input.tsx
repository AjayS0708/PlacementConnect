import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export default function Input({ 
  label, 
  error, 
  fullWidth = false, 
  className,
  ...props 
}: InputProps) {
  return (
    <div className={clsx('flex flex-col gap-8', { 'w-full': fullWidth })}>
      {label && (
        <label className="font-sans font-medium text-primary">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'px-16 py-16 border border-[#E5E7EB] bg-white rounded-lg shadow-sm',
          'font-sans text-body-base text-primary',
          'transition-all duration-200',
          'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-20',
          'placeholder:text-[#9CA3AF]',
          {
            'border-accent': error,
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-accent text-sm font-medium">
          {error}
        </span>
      )}
    </div>
  )
}
