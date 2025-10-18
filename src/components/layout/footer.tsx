import * as React from 'react'
import Link from 'next/link'

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ ...props }, ref) => {
    return (
      <footer ref={ref} className="bg-green-800 text-green-100 mt-20" {...props}>
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
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Portal Login
                  </Link>
                </li>
                <li>
                  <Link href="/booking" className="hover:text-white transition-colors">
                    Booking
                  </Link>
                </li>
                <li>
                  <Link href="/feed" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
              <p className="text-sm">
                Dybt i skoven
                <br />
                Hvor de gamle træer vokser
                <br />
                Danmark
              </p>
            </div>
          </div>
          <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Risager Plantage. Alle rettigheder forbeholdes.</p>
          </div>
        </div>
      </footer>
    )
  }
)

Footer.displayName = 'Footer'

export { Footer }
