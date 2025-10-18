'use client'

import { useState } from 'react'

interface BookingCalendarProps {
  existingBookings: Array<{
    startDate: string
    endDate: string
    userId: string
  }>
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export function BookingCalendar({
  existingBookings,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectingStartDate, setSelectingStartDate] = useState(true)

  const isDateUnavailable = (date: Date) => {
    if (!existingBookings || !Array.isArray(existingBookings)) return false

    // Convert date to YYYY-MM-DD string in UTC (ignore time component)
    const checkDateStr = date.toISOString().split('T')[0]

    return existingBookings.some(booking => {
      // Get YYYY-MM-DD strings from booking dates (already in UTC format)
      const bookingStartStr = booking.startDate.split('T')[0]
      const bookingEndStr = booking.endDate.split('T')[0]

      // A date is unavailable if it falls within the booking range (inclusive of start, exclusive of end)
      return checkDateStr >= bookingStartStr && checkDateStr < bookingEndStr
    })
  }

  const generateCalendarDays = (year: number, month: number) => {
    // Create dates in UTC to avoid timezone issues
    const firstDay = new Date(Date.UTC(year, month, 1))
    const startDate = new Date(firstDay)
    startDate.setUTCDate(startDate.getUTCDate() - firstDay.getUTCDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setUTCDate(currentDate.getUTCDate() + 1)
    }

    return days
  }

  const handleDateClick = (date: Date) => {
    // Compare using UTC dates (ignore time)
    const todayStr = new Date().toISOString().split('T')[0]
    const dateStr = date.toISOString().split('T')[0]

    if (dateStr < todayStr || isDateUnavailable(date)) {
      return
    }

    if (selectingStartDate) {
      onStartDateChange(dateStr)
      onEndDateChange('')
      setSelectingStartDate(false)
    } else {
      if (dateStr <= startDate) {
        onStartDateChange(dateStr)
        onEndDateChange('')
        setSelectingStartDate(false)
      } else {
        onEndDateChange(dateStr)
        setSelectingStartDate(true)
      }
    }
  }

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false
    const dateStr = date.toISOString().split('T')[0]
    return dateStr >= startDate && dateStr <= endDate
  }

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return dateStr === startDate || dateStr === endDate
  }

  return (
    <div className="bg-white border-2 border-green-300 rounded-lg p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11)
              setCurrentYear(currentYear - 1)
            } else {
              setCurrentMonth(currentMonth - 1)
            }
          }}
          className="p-2 text-green-600 hover:bg-green-50 rounded"
        >
          ←
        </button>
        <h5 className="text-lg font-semibold text-green-800">
          {new Date(currentYear, currentMonth).toLocaleDateString('da-DK', {
            month: 'long',
            year: 'numeric',
          })}
        </h5>
        <button
          type="button"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0)
              setCurrentYear(currentYear + 1)
            } else {
              setCurrentMonth(currentMonth + 1)
            }
          }}
          className="p-2 text-green-600 hover:bg-green-50 rounded"
        >
          →
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarDays(currentYear, currentMonth).map((date, index) => {
          const isCurrentMonth = date.getUTCMonth() === currentMonth
          const todayStr = new Date().toISOString().split('T')[0]
          const dateStr = date.toISOString().split('T')[0]
          const isToday = dateStr === todayStr
          const isPast = dateStr < todayStr
          const isUnavailable = isDateUnavailable(date)
          const isSelected = isDateSelected(date)
          const isInRange = isDateInRange(date)

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={isPast || isUnavailable}
              className={`
                p-2 text-sm rounded transition-all
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isPast || isUnavailable ? 'text-gray-300 cursor-not-allowed bg-gray-100' : ''}
                ${isToday && !isPast && !isUnavailable ? 'ring-2 ring-blue-300' : ''}
                ${isSelected ? 'bg-green-600 text-white font-bold' : ''}
                ${isInRange && !isSelected ? 'bg-green-100 text-green-800' : ''}
                ${!isPast && !isUnavailable && !isSelected && !isInRange && isCurrentMonth ? 'hover:bg-green-50 text-gray-900' : ''}
              `}
            >
              {date.getUTCDate()}
            </button>
          )
        })}
      </div>

      {/* Selected Dates Display */}
      <div className="mt-4 text-sm text-green-700">
        {startDate && (
          <div>
            <strong>Check-in:</strong> {new Date(startDate).toLocaleDateString('da-DK')}
            {selectingStartDate && <span className="ml-2 text-blue-600">(Click to change)</span>}
          </div>
        )}
        {endDate && (
          <div>
            <strong>Check-out:</strong> {new Date(endDate).toLocaleDateString('da-DK')}
            {!selectingStartDate && <span className="ml-2 text-blue-600">(Click to change)</span>}
          </div>
        )}
        {!startDate && <div className="text-gray-500">Click a date to select check-in</div>}
        {startDate && !endDate && (
          <div className="text-gray-500">Click another date to select check-out</div>
        )}
      </div>
    </div>
  )
}
