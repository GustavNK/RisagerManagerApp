"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Header, Footer, Container } from "@/components/layout";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

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
              <span className="block text-green-600">Risager Plantage</span>
            </h2>
            <p className="text-xl text-green-700 mb-12 max-w-5xl mx-auto leading-relaxed font-medium">
              Oplev skovens ro og skønhed i vores fredelige naturtilflugtssted.
              Omgivet af gamle træer og bakkende landskaber tilbyder Risager Plantage
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
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🏡</div>
                <CardTitle className="text-xl">Komfortable Huse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  Moderne faciliteter i harmonisk sammenhæng med skoven
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🌿</div>
                <CardTitle className="text-xl">Naturlige Omgivelser</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  Hundredvis af år gamle træer og ren skovluft
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl mb-4">🦌</div>
                <CardTitle className="text-xl">Vilde Dyr</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">
                  Oplev skovens mangfoldige dyreliv i deres naturlige habitat
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="text-center p-12">
            <h3 className="text-3xl font-bold text-green-800 mb-4">
              Klar til at opleve skoven?
            </h3>
            <p className="text-lg text-green-600 mb-8">
              Book dit ophold i dag og opdag magien ved Risager Plantage
            </p>
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Book nu
                  </Button>
                </Link>
                <Link href="/feed">
                  <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                    Se community
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href="/login">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Log ind for at booke
                </Button>
              </Link>
            )}
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
