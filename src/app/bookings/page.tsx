"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage, getApiUrl } from "@/lib/api";

interface Booking {
  id: number;
  propertyId: number;
  userId: string;
  startDate: string;
  endDate: string;
  expectedPeople: number;
  userFirstName: string;
  userLastName: string;
  userFullName: string;
  totalPrice: number;
  nights: number;
}

interface VacationHouse {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
}

export default function BookingsPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [error, setError] = useState("");
  const [selectedHouse, setSelectedHouse] = useState<VacationHouse | null>(null);
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

  const getHouseName = (propertyId: number) => {
    const house = vacationHouses.find(h => h.id === propertyId);
    return house ? house.name : `Property ${propertyId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = (startDate: string, endDate: string, expectedPeople: number, propertyId: number) => {
    const nights = calculateNights(startDate, endDate);
    const house = vacationHouses.find(h => h.id === propertyId);
    const pricePerPerson = house?.price || 30;
    return nights * pricePerPerson * expectedPeople;
  };

  const { data: bookings = [], isLoading: loading, error: queryError } = useQuery({
    queryKey: ['bookings', selectedHouse?.id],
    queryFn: async () => {
      const url = selectedHouse?.id
        ? `${getApiUrl()}/api/Bookings/property/${selectedHouse.id}`
        : `${getApiUrl()}/api/Bookings`;

      console.log('Fetching bookings from:', url);

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch bookings: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Received bookings:', data);
      return data as Booking[];
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: number) => api.api.bookingsDelete(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      setError(getErrorMessage(error) || "Failed to delete booking.");
    },
  });

  const deleteBooking = (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }
    deleteBookingMutation.mutate(bookingId);
  };

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      setUser(JSON.parse(storedUser));
    };

    checkAuth();
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Please Login</h2>
          <p className="text-green-600 mb-6">You need to be logged in to view bookings.</p>
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
                <Link href="/booking" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Book Now
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
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            {selectedHouse ? `${selectedHouse.name} Bookings` : "All Bookings"}
          </h2>
          <p className="text-xl text-green-600">
            {selectedHouse ? `Reservations for ${selectedHouse.name}` : "Overview of all vacation house reservations"}
          </p>
        </div>

        {/* House Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div
            className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 transition-all cursor-pointer ${
              !selectedHouse
                ? "border-green-500 ring-2 ring-green-200"
                : "border-green-100 hover:border-green-300"
            }`}
            onClick={() => {
              setSelectedHouse(null);
            }}
          >
            <div className="p-6">
              <div className="text-4xl mb-3 text-center">🏘️</div>
              <h3 className="text-xl font-bold text-green-800 mb-4 text-center">All Houses</h3>
              <div className="text-center">
                <span className="text-green-600">View all bookings</span>
              </div>
            </div>
          </div>
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {loading || !bookings ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white font-bold text-2xl">🌲</span>
            </div>
            <p className="text-green-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto border border-green-100">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">No Bookings Yet</h3>
            <p className="text-green-600 mb-6">There are no bookings in the system yet.</p>
            <Link
              href="/booking"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Make First Booking
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-green-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Booking ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">House</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Guest</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Check-in</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Check-out</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nights</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Total Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {bookings.map((booking, index) => (
                    <tr key={booking.id} className={index % 2 === 0 ? "bg-white/50" : "bg-green-50/50"}>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{booking.id}</td>
                      <td className="px-6 py-4 text-sm text-green-800 font-semibold">
                        {getHouseName(booking.propertyId)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{booking.userFullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(booking.startDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(booking.endDate)}</td>
                      <td className="px-6 py-4 text-sm text-green-700 font-medium">
                        {booking.nights} nights
                      </td>
                      <td className="px-6 py-4 text-sm text-green-800 font-semibold">
                        {booking.totalPrice.toLocaleString('da-DK')} DKK
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg border border-green-200 p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-500">Booking #{booking.id}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-700">
                        {booking.nights} nights
                      </div>
                      <div className="text-sm font-bold text-green-800">
                        {booking.totalPrice.toLocaleString('da-DK')} DKK
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-green-800 mb-1">
                    {getHouseName(booking.propertyId)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Guest: {booking.userFullName}</p>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>{formatDate(booking.startDate)}</span>
                    <span>→</span>
                    <span>{formatDate(booking.endDate)}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookings && (
          <div className="text-center mt-8">
            <p className="text-green-600 mb-4">Total bookings: {bookings.length}</p>
            <Link
              href="/booking"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all inline-block"
            >
              Make New Booking
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}