"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { Header, Container } from "@/components/layout";
import { Alert, Button, Card, Label, Input } from "@/components/ui";
import { PropertyCard } from "@/components/features/booking/property-card";
import { BookingCalendar } from "@/components/features/booking/booking-calendar";

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
      const response = await api.api.bookingsPropertyDetail(selectedHouse.id, { format: 'json' });
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
      setError(message || "Booking mislykkedes. Kontroller venligst dine datoer og prøv igen.");
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

  const handleHouseSelection = (house: VacationHouse) => {
    setSelectedHouse(house);
    setStartDate("");
    setEndDate("");
    setExpectedPeople(1);
    setError("");
  };

  const handleBooking = () => {
    if (!selectedHouse || !startDate || !endDate) {
      setError("Vælg venligst et hus og datoer for din booking.");
      return;
    }

    if (expectedPeople < 1 || expectedPeople > 20) {
      setError("Antal personer skal være mellem 1 og 20.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError("Udrejsedato skal være efter ankomstdato.");
      return;
    }

    if (!isDateRangeAvailable(startDate, endDate)) {
      setError("De valgte datoer overlapper med en eksisterende booking. Vælg venligst andre datoer.");
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-teal-100 flex items-center justify-center">
        <Card className="text-center p-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">Log venligst ind</h2>
          <p className="text-green-600 mb-6">Du skal være logget ind for at lave en booking.</p>
          <Link href="/login">
            <Button>Log ind</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-teal-100">
      <Header />

      <main>
        <Container size="lg" className="py-16">
        <div className="mb-6">
          <Button variant="tertiary" size="sm" asChild>
            <Link href="/">← Tilbage til forsiden</Link>
          </Button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Book et feriehus</h1>
          <p className="text-xl text-green-600">Vælg mellem vores to smukke feriehuse</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6 max-w-5xl mx-auto">
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-6 max-w-5xl mx-auto">
            {success}
          </Alert>
        )}

        {/* House Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-5xl mx-auto">
          {vacationHouses.map((house) => (
            <PropertyCard
              key={house.id}
              id={house.id}
              name={house.name}
              price={house.price}
              image={house.image}
              isSelected={selectedHouse?.id === house.id}
              onClick={() => handleHouseSelection(house)}
            />
          ))}
        </div>

        {/* Booking Form */}
        {selectedHouse && (
          <Card className="p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
              Book {selectedHouse.name}
            </h3>

            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">Vælg dine datoer</h4>
              <BookingCalendar
                existingBookings={existingBookings}
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>

            {/* Expected People Field */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-4">Antal personer</h4>
              <Card className="p-4 w-full max-w-full">
                <Label htmlFor="expectedPeople">
                  Forventet antal personer:
                </Label>
                <Input
                  type="number"
                  id="expectedPeople"
                  min="1"
                  max="20"
                  value={expectedPeople}
                  onChange={(e) => setExpectedPeople(parseInt(e.target.value) || 1)}
                  helperText={`Prisen er ${selectedHouse?.price} DKK pr. person pr. nat`}
                />
              </Card>
            </div>

            {startDate && endDate && !isDateRangeAvailable(startDate, endDate) && (
              <Alert variant="error" className="mb-6">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span className="font-medium">Selected dates overlap with an existing booking</span>
                </div>
                <p className="text-sm mt-1">Please choose different dates from the available options above.</p>
              </Alert>
            )}

            {startDate && endDate && (
              <Alert variant="success" className="mb-6">
                <div className="flex justify-between items-center">
                  <span>Total nights:</span>
                  <span className="font-semibold">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>People:</span>
                  <span className="font-semibold">{expectedPeople}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total price:</span>
                  <span className="font-bold text-xl">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) * selectedHouse.price * expectedPeople} DKK
                  </span>
                </div>
              </Alert>
            )}

            <Button
              onClick={handleBooking}
              disabled={bookingMutation.isPending || !startDate || !endDate}
              fullWidth
              size="lg"
              isLoading={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Booker..." : "Bekræft booking"}
            </Button>
          </Card>
        )}
        </Container>
      </main>
    </div>
  );
}
