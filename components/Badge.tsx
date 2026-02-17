import clsx from 'clsx'

interface BadgeProps {
  status?: 'not-started' | 'in-progress' | 'shipped'
  variant?: 'gray' | 'blue' | 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md'
  children?: React.ReactNode
}

const statusConfig = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-[#E8E7E3] text-primary',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-warning text-white',
  },
  'shipped': {
    label: 'Shipped',
    className: 'bg-success text-white',
  },
}

const variantConfig = {
  gray: 'bg-[#E8E7E3] text-[#6B7280]',
  blue: 'bg-[#DBEAFE] text-[#1E40AF]',
  green: 'bg-[#D1FAE5] text-[#065F46]',
  yellow: 'bg-[#FEF3C7] text-[#92400E]',
  red: 'bg-[#FEE2E2] text-[#991B1B]',
}

export default function Badge({ status, variant, size = 'md', children }: BadgeProps) {
  // Support both old status-based and new variant-based usage
  const content = status ? statusConfig[status].label : children
  const className = variant ? variantConfig[variant] : (status ? statusConfig[status].className : variantConfig.gray)
  
  return (
    <span
      className={clsx(
        'font-sans font-medium inline-block rounded',
        className,
        {
          'px-12 py-4 text-[13px]': size === 'sm',
          'px-16 py-6 text-[14px]': size === 'md',
        }
      )}
    >
      {content}
    </span>
  )
}

