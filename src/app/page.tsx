"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header, Footer, Container } from "@/components/layout";
import { Button } from "@/components/ui";

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-teal-100">
      <Header />

      {/* Hero Section */}
      <main>
        <Container size="lg" className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
              Velkommen til
              <span className="block text-green-600">Nørre Risager Plantage</span>
            </h2>
            <p className="text-xl text-green-700 mb-12 max-w-5xl mx-auto leading-relaxed font-medium">
              Oplev skovens ro og skønhed i vores fredelige naturtilflugtssted.
              Omgivet af gamle træer og bakkende landskaber tilbyder Nørre Risager Plantage
              en unik flugt ind i naturens omfavnelse.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {user ? (
                <Link href="/booking">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Book dit ophold
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Log ind
                  </Button>
                </Link>
              )}
              <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                Læs mere
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
