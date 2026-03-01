import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type ElevationLevel = 0 | 1 | 2 | 3 | 4

interface SurfaceProps extends Omit<HTMLMotionProps<'div'>, 'elevation'> {
  children: ReactNode
  elevation?: ElevationLevel
  glass?: boolean
  bordered?: boolean
  interactive?: boolean
  className?: string
}

/**
 * Surface component with Material Design 3 inspired elevation system
 * Replaces generic divs with semantically elevated surfaces
 */
export default function Surface({
  children,
  elevation = 1,
  glass = false,
  bordered = true,
  interactive = false,
  className,
  ...props
}: SurfaceProps) {
  const elevationClasses = {
    0: 'elevation-0',
    1: 'elevation-1',
    2: 'elevation-2',
    3: 'elevation-3',
    4: 'elevation-4',
  }

  return (
    <motion.div
      className={clsx(
        'bg-surface-light rounded-lg',
        elevationClasses[elevation],
        {
          'glass': glass,
          'border border-border/50': bordered && !glass,
          'interactive': interactive,
          'transition-standard': !interactive,
        },
        className
      )}
      initial={interactive ? { scale: 1 } : undefined}
      whileHover={
        interactive
          ? {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={
        interactive
          ? {
              scale: 0.98,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Preset Surface variants for common use cases
export function SurfaceCard({ children, className, ...props }: Omit<SurfaceProps, 'elevation'>) {
  return (
    <Surface elevation={1} className={clsx('p-24', className)} {...props}>
      {children}
    </Surface>
  )
}

export function SurfaceModal({ children, className, ...props }: Omit<SurfaceProps, 'elevation'>) {
  return (
    <Surface elevation={3} className={clsx('p-40', className)} {...props}>
      {children}
    </Surface>
  )
}

export function SurfaceDialog({ children, className, ...props }: Omit<SurfaceProps, 'elevation'>) {
  return (
    <Surface elevation={4} className={clsx('p-48', className)} {...props}>
      {children}
    </Surface>
  )
}
