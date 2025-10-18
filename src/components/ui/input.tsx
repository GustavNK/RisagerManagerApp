import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

// Error icon SVG
const ErrorIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, disabled, ...props }, ref) => {
    return (
      <div className="">
        <div className="relative">
          <input
            type={type}
            className={cn(
              // Base styles
              'px-4 py-3 rounded-lg text-base transition-all',
              'bg-white text-gray-900 placeholder-gray-500',
              'border-2 focus:outline-none focus:ring-2 focus:ring-offset-1',

              // Normal state
              !error && !disabled && 'border-green-300 focus:border-green-500 focus:ring-green-500',

              // Error state - add padding for icon
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500 pr-10',

              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed bg-gray-100',

              // Minimum touch target height
              'min-h-[44px]',

              className
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-red-500">
              <ErrorIcon />
            </div>
          )}
        </div>
        {helperText && (
          <div
            id={`${props.id}-helper`}
            className={cn(
              'mt-2 text-sm flex items-start gap-2',
              error ? 'text-red-600' : 'text-gray-600'
            )}
          >
            {error && <ErrorIcon />}
            <span>{helperText}</span>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
