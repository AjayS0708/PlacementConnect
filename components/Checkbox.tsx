import { ReactNode } from 'react'
import clsx from 'clsx'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: ReactNode
  disabled?: boolean
}

export default function Checkbox({ 
  checked, 
  onChange, 
  label, 
  disabled = false 
}: CheckboxProps) {
  return (
    <label 
      className={clsx(
        'flex items-center gap-16 cursor-pointer transition-standard',
        {
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={clsx(
          'w-24 h-24 border-2 flex items-center justify-center transition-standard',
          {
            'border-accent bg-accent': checked,
            'border-border bg-surface-light': !checked,
          }
        )}
      >
        {checked && (
          <svg
            width="14"
            height="11"
            viewBox="0 0 14 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5.5L5 9.5L13 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="square"
            />
          </svg>
        )}
      </div>
      <span className="font-sans text-body-base text-primary">
        {label}
      </span>
    </label>
  )
}
