import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type ElevationLevel = 0 | 1 | 2 | 3 | 4
type PaddingSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'
type HoverEffect = 'lift' | 'glow' | 'brighten' | 'none'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'elevation'> {
  children: ReactNode
  className?: string
  padding?: PaddingSize
  elevation?: ElevationLevel
  bordered?: boolean
  interactive?: boolean
  glass?: boolean
  hoverEffect?: HoverEffect
}

const elevationClasses = {
  0: '',
  1: 'shadow-elevation-1',
  2: 'shadow-elevation-2',
  3: 'shadow-elevation-3',
  4: 'shadow-elevation-4',
}

const paddingClasses = {
  none: '',
  sm: 'p-16',
  md: 'p-24',
  lg: 'p-40',
  xl: 'p-48',
}

/**
 * Enhanced Card component with elevation system and micro-interactions
 * Supports glass morphism, interactive states, and Material Design elevation
 */
export default function Card({
  children,
  className,
  padding = 'md',
  elevation = 1,
  bordered = true,
  interactive = false,
  glass = false,
  hoverEffect = 'lift',
  ...props
}: CardProps) {
  // Determine hover animation based on hoverEffect prop
  const getHoverAnimation = () => {
    if (!interactive || hoverEffect === 'none') return undefined;
    
    switch (hoverEffect) {
      case 'lift':
        return {
          y: -8,
          scale: 1.02,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.08)',
        };
      case 'glow':
        return {
          boxShadow: '0 0 30px 0 rgba(59, 130, 246, 0.3)',
          scale: 1.01,
        };
      case 'brighten':
        return {
          scale: 1.03,
          filter: 'brightness(1.05)',
        };
      default:
        return undefined;
    }
  };

  return (
    <motion.div
      className={clsx(
        'rounded-lg transition-all duration-200',
        {
          'bg-white': !glass,
          'glass': glass,
          'border border-border/50': bordered && !glass,
          'border border-white/30': bordered && glass,
          'cursor-pointer': interactive,
          'overflow-hidden': interactive, // For ripple effect
        },
        elevationClasses[elevation],
        paddingClasses[padding],
        className
      )}
      initial={interactive ? { y: 0, scale: 1 } : undefined}
      whileHover={getHoverAnimation()}
      whileTap={
        interactive
          ? {
              scale: 0.97,
            }
          : undefined
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/**
 * Preset Card variants for common patterns
 */

// Interactive card that responds to hover/click
export function InteractiveCard({ children, className, ...props }: Omit<CardProps, 'interactive'>) {
  return (
    <Card interactive elevation={1} className={className} {...props}>
      {children}
    </Card>
  )
}

// Elevated card for important content
export function ElevatedCard({ children, className, ...props }: Omit<CardProps, 'elevation'>) {
  return (
    <Card elevation={2} className={className} {...props}>
      {children}
    </Card>
  )
}

// Glass card with backdrop blur
export function GlassCard({ children, className, ...props }: Omit<CardProps, 'glass'>) {
  return (
    <Card glass elevation={0} className={className} {...props}>
      {children}
    </Card>
  )
}

// Feature card with accent border
export function FeatureCard({
  children,
  accent = 'accent',
  className,
  ...props
}: CardProps & { accent?: 'accent' | 'success' | 'warning' | 'error' }) {
  const accentColors = {
    accent: 'border-l-accent-500',
    success: 'border-l-success-500',
    warning: 'border-l-warning-500',
    error: 'border-l-error-500',
  }

  return (
    <Card className={clsx('border-l-4', accentColors[accent], className)} {...props}>
      {children}
    </Card>
  )
}

