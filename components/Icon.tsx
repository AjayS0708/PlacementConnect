import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type IconColor = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'inherit'

interface IconProps extends Omit<HTMLMotionProps<'div'>, 'size' | 'color'> {
  children: ReactNode
  size?: IconSize
  color?: IconColor
  withBackground?: boolean
  rounded?: boolean
  animated?: boolean
  className?: string
}

const sizeClasses = {
  xs: 'w-4 h-4 text-sm',
  sm: 'w-5 h-5 text-base',
  md: 'w-6 h-6 text-lg',
  lg: 'w-8 h-8 text-xl',
  xl: 'w-10 h-10 text-2xl',
}

const backgroundSizes = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
}

const colorClasses = {
  primary: 'text-primary-900',
  accent: 'text-accent-700',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  info: 'text-info-600',
  inherit: '',
}

const backgroundColorClasses = {
  primary: 'bg-primary-50',
  accent: 'bg-accent-50',
  success: 'bg-success-50',
  warning: 'bg-warning-50',
  error: 'bg-error-50',
  info: 'bg-info-50',
  inherit: 'bg-gray-50',
}

/**
 * Icon wrapper component with consistent sizing, colors, and optional animations
 * Wraps Lucide icons with standardized styling
 */
export default function Icon({
  children,
  size = 'md',
  color = 'inherit',
  withBackground = false,
  rounded = false,
  animated = false,
  className,
  ...props
}: IconProps) {
  const iconContent = (
    <div className={clsx(sizeClasses[size], colorClasses[color], 'flex items-center justify-center')}>
      {children}
    </div>
  )

  if (withBackground) {
    return (
      <motion.div
        className={clsx(
          'flex items-center justify-center',
          backgroundSizes[size],
          backgroundColorClasses[color],
          {
            'rounded-full': rounded,
            'rounded-lg': !rounded,
          },
          'transition-all duration-200',
          className
        )}
        whileHover={animated ? { scale: 1.1, rotate: 5 } : undefined}
        whileTap={animated ? { scale: 0.95 } : undefined}
        {...props}
      >
        {iconContent}
      </motion.div>
    )
  }

  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={className}
        {...props}
      >
        {iconContent}
      </motion.div>
    )
  }

  return <div className={className}>{iconContent}</div>
}

/**
 * Animated icon for loading states
 */
export function IconSpinner({ size = 'md', className }: Pick<IconProps, 'size' | 'className'>) {
  return (
    <motion.div
      className={clsx(sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
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
      </svg>
    </motion.div>
  )
}

/**
 * Badge icon with notification dot
 */
export function IconWithBadge({
  children,
  count,
  ...props
}: IconProps & { count?: number }) {
  return (
    <div className="relative inline-flex">
      <Icon {...props}>{children}</Icon>
      {count !== undefined && count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold text-white bg-error-500 rounded-full ring-2 ring-white"
        >
          {count > 99 ? '99+' : count}
        </motion.span>
      )}
    </div>
  )
}

/**
 * Preset icon containers for common use cases
 */
export function IconCircle({ children, color = 'accent', size = 'md', className }: IconProps) {
  return (
    <Icon
      withBackground
      rounded
      color={color}
      size={size}
      animated
      className={className}
    >
      {children}
    </Icon>
  )
}

export function IconSquare({ children, color = 'accent', size = 'md', className }: IconProps) {
  return (
    <Icon
      withBackground
      rounded={false}
      color={color}
      size={size}
      animated
      className={className}
    >
      {children}
    </Icon>
  )
}
