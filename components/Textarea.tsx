import { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export default function Textarea({ 
  label, 
  error, 
  fullWidth = false, 
  className,
  ...props 
}: TextareaProps) {
  return (
    <div className={clsx('flex flex-col gap-8', { 'w-full': fullWidth })}>
      {label && (
        <label className="font-sans font-medium text-primary">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'px-16 py-16 border-2 border-border bg-surface-light',
          'font-sans text-body-base text-primary',
          'transition-standard',
          'focus:border-primary focus:outline-none',
          'placeholder:text-[#999999]',
          'resize-vertical min-h-[120px]',
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
