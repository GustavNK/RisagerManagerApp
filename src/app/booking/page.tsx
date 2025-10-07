"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";

interface VacationHouse {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
}

interface Booking {
  id: number;
  propertyId: number;
  userId: string;
  startDate: string;
  endDate: string;
}

export default function BookingPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<VacationHouse | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedPeople, setExpectedPeople] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingStartDate, setSelectingStartDate] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();

  const vacationHouses: VacationHouse[] = [
    {
      id: 1,
      name: "Røde Hus",
      description: "",
      price: 30,
      image: "🏠",
      features: []
    },
    {
      id: 2,
      name: "Søhuset",
      description: "",
      price: 30,
      image: "🏡",
      features: []
    }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  const { data: existingBookings = [] } = useQuery({
    queryKey: ['bookings', 'property', selectedHouse?.id],
    queryFn: async () => {
      if (!selectedHouse?.id) return [];
      const response = await api.api.bookingsPropertyDetail(selectedHouse.id);
      return ((response.data as unknown) as Booking[]) || [];
    },
    enabled: !!selectedHouse?.id,
  });

  const bookingMutation = useMutation({
    mutationFn: (data: {
      propertyId: number;
      userId: string;
      startDate: string;
      endDate: string;
      expectedPeople: number;
    }) => api.api.bookingsCreate(data),
    onSuccess: () => {
      setSuccess(`Successfully booked ${selectedHouse?.name} from ${startDate} to ${endDate}!`);
      setError("");
      setSelectedHouse(null);
      setStartDate("");
      setEndDate("");
      setExpectedPeople(1);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      setError(message || "Booking failed. Please try again.");
      setSuccess("");
    },
  });

  const isDateRangeAvailable = (startDate: string, endDate: string) => {
    if (!existingBookings || !Array.isArray(existingBookings)) return true;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return !existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      // Check if the new booking overlaps with existing booking
      return start < bookingEnd && end > bookingStart;
    });
  };

  const getUnavailableDateRanges = () => {
    if (!existingBookings || !Array.isArray(existingBookings)) return [];

    return existingBookings.map(booking => ({
      start: booking.startDate,
      end: booking.endDate,
      guest: booking.userId
    }));
  };

  const isDateUnavailable = (date: Date) => {
    if (!existingBookings || !Array.isArray(existingBookings)) return false;

    const dateStr = date.toISOString().split('T')[0];
    return existingBookings.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return date >= bookingStart && date < bookingEnd;
    });
  };

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDateClick = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today || isDateUnavailable(date)) {
      return;
    }

    const dateStr = date.toISOString().split('T')[0];

    if (selectingStartDate) {
      setStartDate(dateStr);
      setEndDate("");
      setSelectingStartDate(false);
    } else {
      if (new Date(dateStr) <= new Date(startDate)) {
        setStartDate(dateStr);
        setEndDate("");
        setSelectingStartDate(false);
      } else {
        setEndDate(dateStr);
        setSelectingStartDate(true);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return dateStr === startDate || dateStr === endDate;
  };

  const handleBooking = () => {
    if (!selectedHouse || !startDate || !endDate) {
      setError("Please select a house and dates for your booking.");
      return;
    }

    if (expectedPeople < 1 || expectedPeople > 20) {
      setError("Expected people must be between 1 and 20.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    if (!isDateRangeAvailable(startDate, endDate)) {
      setError("The selected dates overlap with an existing booking. Please choose different dates.");
      return;
    }

    setError("");
    setSuccess("");

    bookingMutation.mutate({
      propertyId: selectedHouse.id,
      userId: user?.username || "",
      startDate: startDate,
      endDate: endDate,
      expectedPeople: expectedPeople,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Please Login</h2>
          <p className="text-green-600 mb-6">You need to be logged in to make a booking.</p>
          <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-green-800/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Site Name */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌲</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Risager Plantage</h1>
            </Link>

            {/* Navigation and User Section */}
            <div className="flex items-center space-x-6">
              {/* Navigation */}
              <nav className="hidden md:flex space-x-3 items-center">
                <Link href="/" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Home
                </Link>
                <Link href="/feed" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Feed
                </Link>
                <Link href="/bookings" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  View Bookings
                </Link>
              </nav>

              {/* Divider */}
              <div className="hidden md:block w-px h-6 bg-green-300"></div>

              {/* User Section */}
              <div className="flex items-center space-x-4">
                <span className="text-green-100">
                  Welcome, <span className="font-semibold">{user?.username}</span>
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('currentUser');
                    router.push('/login');
                  }}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Book Your Forest Retreat</h2>
          <p className="text-xl text-green-600">Choose from our two beautiful vacation houses</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
            {success}
          </div>
        )}

        {/* House Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {vacationHouses.map((house) => (
            <div
              key={house.id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
                selectedHouse?.id === house.id
                  ? "border-green-500 ring-2 ring-green-200"
                  : "border-green-100 hover:border-green-300"
              }`}
              onClick={() => {
                setSelectedHouse(house);
                setStartDate("");
                setEndDate("");
                setExpectedPeople(1);
                setError("");
                setSelectingStartDate(true);
                setCurrentMonth(new Date().getMonth());
                setCurrentYear(new Date().getFullYear());
              }}
            >
              <div className="p-6">
                <div className="text-4xl mb-3 text-center">{house.image}</div>
                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">{house.name}</h3>
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-800">{house.price} DKK</span>
                  <span className="text-green-600"> / person</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedHouse && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 max-w-2xl mx-auto border border-green-100">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Book {selectedHouse.name}
            </h3>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">Select Your Dates</h4>
              <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    ←
                  </button>
                  <h5 className="text-lg font-semibold text-green-800">
                    {new Date(currentYear, currentMonth).toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })}
                  </h5>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
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
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                    const isUnavailable = isDateUnavailable(date);
                    const isSelected = isDateSelected(date);
                    const isInRange = isDateInRange(date);

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
                        {date.getDate()}
                      </button>
                    );
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
                  {!startDate && (
                    <div className="text-gray-500">Click a date to select check-in</div>
                  )}
                  {startDate && !endDate && (
                    <div className="text-gray-500">Click another date to select check-out</div>
                  )}
                </div>
              </div>
            </div>

            {/* Expected People Field */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">Number of People</h4>
              <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                <label htmlFor="expectedPeople" className="block text-sm font-medium text-green-700 mb-2">
                  Expected number of people:
                </label>
                <input
                  type="number"
                  id="expectedPeople"
                  min="1"
                  max="20"
                  value={expectedPeople}
                  onChange={(e) => setExpectedPeople(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-sm text-green-600 mt-2">
                  Price is {selectedHouse?.price} DKK per person per night
                </p>
              </div>
            </div>

            {startDate && endDate && !isDateRangeAvailable(startDate, endDate) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span className="text-red-700 font-medium">Selected dates overlap with an existing booking</span>
                </div>
                <p className="text-red-600 text-sm mt-1">Please choose different dates from the available options above.</p>
              </div>
            )}

            {startDate && endDate && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Total nights:</span>
                  <span className="font-semibold text-green-800">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">People:</span>
                  <span className="font-semibold text-green-800">{expectedPeople}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-700">Total price:</span>
                  <span className="font-bold text-green-800 text-xl">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * selectedHouse.price * expectedPeople} DKK
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={bookingMutation.isPending || !startDate || !endDate}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}