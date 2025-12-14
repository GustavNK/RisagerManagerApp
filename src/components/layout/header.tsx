'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export interface HeaderProps {
  showNavigation?: boolean
  showUserSection?: boolean
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ showNavigation = true, showUserSection = true }, ref) => {
    const [user, setUser] = useState<{ email: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const router = useRouter()

    useEffect(() => {
      const checkLoginStatus = () => {
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        setLoading(false)
      }

      checkLoginStatus()
    }, [])

    const handleLogout = () => {
      localStorage.removeItem('currentUser')
      setUser(null)
      setMobileMenuOpen(false)
      router.push('/login')
    }

    const closeMobileMenu = () => {
      setMobileMenuOpen(false)
    }

    return (
      <header ref={ref} className="bg-green-800/90 backdrop-blur-sm shadow-lg">
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
              ) : user && showUserSection ? (
                <>
                  {/* Desktop Navigation */}
                  {showNavigation && (
                    <nav className="hidden md:flex space-x-3 items-center">
                      <Link
                        href="/"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Hjem
                      </Link>
                      <Link
                        href="/booking"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Ny Booking
                      </Link>
                      <Link
                        href="/bookings"
                        className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Alle Bookinger
                      </Link>
                    </nav>
                  )}

                  {/* Divider */}
                  {showNavigation && (
                    <div className="hidden md:block w-px h-6 bg-green-300"></div>
                  )}

                  {/* Desktop User Section */}
                  <div className="hidden md:flex items-center space-x-4">
                    <span className="text-green-100">
                      Velkommen, <span className="font-semibold">{user.email}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Log ud
                    </button>
                  </div>

                  {/* Mobile Hamburger Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-white hover:bg-green-700 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    )}
                  </button>
                </>
              ) : (
                !loading && !user && (
                  <Link
                    href="/login"
                    className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Log ind
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && user && showNavigation && (
            <div className="md:hidden border-t border-green-700">
              <nav className="flex flex-col py-4 space-y-2">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium text-center"
                >
                  Hjem
                </Link>
                <Link
                  href="/booking"
                  onClick={closeMobileMenu}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium text-center"
                >
                  Ny Booking
                </Link>
                <Link
                  href="/bookings"
                  onClick={closeMobileMenu}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium text-center"
                >
                  Alle Bookinger
                </Link>
                <div className="border-t border-green-700 pt-3 mt-2">
                  <p className="text-green-100 text-center text-sm mb-2">
                    {user.email}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors font-medium"
                  >
                    Log ud
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    )
  }
)

Header.displayName = 'Header'

export { Header }
