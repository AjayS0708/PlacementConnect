import clsx from 'clsx'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  className 
}: ProgressIndicatorProps) {
  return (
    <div className={clsx('flex items-center gap-16', className)}>
      <span className="font-sans text-body-base text-primary font-medium">
        Step {currentStep} / {totalSteps}
      </span>
      <div className="flex gap-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              'w-8 h-8 transition-standard',
              index < currentStep ? 'bg-accent' : 'bg-border'
            )}
          />
        ))}
      </div>
    </div>
  )
}
