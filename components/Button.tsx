import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClasses = {
  primary:
    'bg-gradient-primary text-white shadow-elevation-1 hover:shadow-elevation-2 border border-transparent',
  secondary:
    'bg-primary-900 text-white hover:bg-primary-800 shadow-elevation-1 hover:shadow-elevation-2 border border-transparent',
  outline:
    'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white bg-transparent',
  ghost: 'text-primary-900 hover:bg-primary-50 bg-transparent border border-transparent',
  danger:
    'bg-error-500 text-white hover:bg-error-600 shadow-elevation-1 hover:shadow-elevation-2 border border-transparent',
}

const sizeClasses = {
  sm: 'px-16 py-8 text-sm',
  md: 'px-24 py-12 text-base',
  lg: 'px-32 py-16 text-lg',
}

/**
 * Enhanced Button component with micro-interactions and variants
 * Supports loading states, icons, and smooth animations
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={clsx(
        'font-sans font-medium rounded-lg inline-flex items-center justify-center gap-8',
        'transition-all duration-200 relative overflow-hidden',
        'focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantClasses[variant],
        sizeClasses[size],
        {
          'w-full': fullWidth,
        },
        className
      )}
      whileHover={
        !disabled && !loading
          ? {
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={
        !disabled && !loading
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <motion.svg
          className="w-4 h-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      )}

      {/* Left Icon */}
      {!loading && leftIcon && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          {leftIcon}
        </motion.span>
      )}

      {/* Button Text */}
      <span className={clsx({ 'opacity-0': loading })}>{children}</span>

      {/* Right Icon */}
      {!loading && rightIcon && (
        <motion.span
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center"
        >
          {rightIcon}
        </motion.span>
      )}

      {/* Ripple Effect (Optional - can be enhanced with canvas) */}
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <motion.span
          className="absolute inset-0 bg-white/20"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      </span>
    </motion.button>
  )
}

/**
 * Button group for composite actions
 */
export function ButtonGroup({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('inline-flex rounded-lg shadow-elevation-1', className)}>
      {children}
    </div>
  )
}

/**
 * Icon-only button
 */
export function IconButton({
  children,
  size = 'md',
  className,
  ...props
}: Omit<ButtonProps, 'leftIcon' | 'rightIcon'>) {
  const iconSizeClasses = {
    sm: 'w-8 h-8 p-8',
    md: 'w-10 h-10 p-10',
    lg: 'w-12 h-12 p-12',
  }

  return (
    <Button
      size={size}
      className={clsx(iconSizeClasses[size], 'aspect-square', className)}
      {...props}
    >
      {children}
    </Button>
  )
}

