'use client'

import { cn } from '@/lib/utils'

interface PropertyCardProps {
  name: string
  price: number
  image: string
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}

export function PropertyCard({ name, price, image, isSelected, onClick, compact }: PropertyCardProps) {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 transition-all cursor-pointer',
        isSelected
          ? 'border-green-500 ring-2 ring-green-200'
          : 'border-green-100 hover:border-green-300'
      )}
      onClick={onClick}
    >
      <div className={cn(compact ? 'p-2 md:p-6' : 'p-6')}>
        <div className={cn('text-center', compact ? 'text-2xl md:text-4xl mb-1 md:mb-3' : 'text-4xl mb-3')}>{image}</div>
        <h3 className={cn('font-bold text-green-800 text-center', compact ? 'text-sm md:text-xl mb-1 md:mb-4' : 'text-xl mb-4')}>{name}</h3>
        <div className={cn('text-center', compact && 'hidden md:block')}>
          <span className="text-2xl font-bold text-green-800">{price} DKK</span>
          <span className="text-green-600"> / person</span>
        </div>
      </div>
    </div>
  )
}
