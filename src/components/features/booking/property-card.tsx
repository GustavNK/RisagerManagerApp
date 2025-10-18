'use client'

import { cn } from '@/lib/utils'

interface PropertyCardProps {
  id: number
  name: string
  price: number
  image: string
  isSelected: boolean
  onClick: () => void
}

export function PropertyCard({ id, name, price, image, isSelected, onClick }: PropertyCardProps) {
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
      <div className="p-6">
        <div className="text-4xl mb-3 text-center">{image}</div>
        <h3 className="text-xl font-bold text-green-800 mb-4 text-center">{name}</h3>
        <div className="text-center">
          <span className="text-2xl font-bold text-green-800">{price} DKK</span>
          <span className="text-green-600"> / person</span>
        </div>
      </div>
    </div>
  )
}
