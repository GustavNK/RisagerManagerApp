"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

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
              {loading ? (
                <div className="text-green-100">Loading...</div>
              ) : user ? (
                <>
                  {/* Navigation */}
                  <nav className="hidden md:flex space-x-3 items-center">
                    <Link href="/feed" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      Feed
                    </Link>
                    <Link href="/booking" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      Book Now
                    </Link>
                    <Link href="/bookings" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      View Bookings
                    </Link>
                    <Link href="/users" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      Users
                    </Link>
                    <Link href="/profile" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      Profile
                    </Link>
                  </nav>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-6 bg-green-300"></div>

                  {/* User Section */}
                  <div className="flex items-center space-x-4">
                    <span className="text-green-100">
                      Welcome, <span className="font-semibold">{user.username}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/login" className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            Velkommen til
            <span className="block text-green-600">Risager Plantage</span>
          </h2>
          <p className="text-xl text-green-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Oplev skovens ro og skønhed i vores fredelige naturtilflugtssted.
            Omgivet af gamle træer og bakkende landskaber tilbyder Risager Plantage
            en unik flugt ind i naturens omfavnelse.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            {user ? (
              <Link
                href="/booking"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Book dit ophold
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Log ind
              </Link>
            )}
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Læs mere
            </button>
          </div>
        </div>

        {/* Forest Image Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-16">
          <div className="h-96 bg-gradient-to-r from-green-800 to-green-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🌲</div>
              <h3 className="text-3xl font-bold mb-2">Skovens Stilhed</h3>
              <p className="text-xl opacity-90">Hvor naturens fred møder moderne komfort</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100 text-center">
            <div className="text-4xl mb-4">🏡</div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">Komfortable Huse</h3>
            <p className="text-green-600">
              Moderne faciliteter i harmonisk sammenhæng med skoven
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100 text-center">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">Naturlige Omgivelser</h3>
            <p className="text-green-600">
              Hundredvis af år gamle træer og ren skovluft
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-green-100 text-center">
            <div className="text-4xl mb-4">🦌</div>
            <h3 className="text-xl font-semibold text-green-800 mb-3">Vilde Dyr</h3>
            <p className="text-green-600">
              Oplev skovens mangfoldige dyreliv i deres naturlige habitat
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-12 shadow-lg border border-green-100">
          <h3 className="text-3xl font-bold text-green-800 mb-4">Klar til at opleve skoven?</h3>
          <p className="text-lg text-green-600 mb-8">
            Book dit ophold i dag og opdag magien ved Risager Plantage
          </p>
          {user ? (
            <div className="space-x-4">
              <Link
                href="/booking"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Book nu
              </Link>
              <Link
                href="/feed"
                className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Se community
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Log ind for at booke
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-green-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Risager Plantage</h4>
              <p className="text-sm">
                Et bæredygtigt skovtilflugtssted dedikeret til naturbeskyttelse og fredelige oplevelser i naturen.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Hurtige Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login" className="hover:text-white transition-colors">Portal Login</Link></li>
                <li><Link href="/booking" className="hover:text-white transition-colors">Booking</Link></li>
                <li><Link href="/feed" className="hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
              <p className="text-sm">
                Dybt i skoven<br />
                Hvor de gamle træer vokser<br />
                Danmark
              </p>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Risager Plantage. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}