import * as React from 'react'
import { cn } from '@/lib/utils'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info'
  showIcon?: boolean
}

// Icon components using SVG
const SuccessIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ErrorIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const WarningIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const InfoIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', showIcon = true, children, ...props }, ref) => {
    const variantClasses = {
      success: 'bg-green-50 border-green-500 text-green-700',
      error: 'bg-red-50 border-red-500 text-red-700',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
      info: 'bg-blue-50 border-blue-500 text-blue-700',
    }

    const icons = {
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />,
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'px-4 py-3 rounded-lg border text-sm',
          showIcon && 'flex items-start gap-3',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {showIcon && icons[variant]}
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

export { Alert }
