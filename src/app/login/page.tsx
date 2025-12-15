"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { LoginForm } from "@/components/features/auth/login-form";
import { RegisterForm } from "@/components/features/auth/register-form";
import Link from "next/link";

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegistrationSuccess = () => {
    // Switch back to login form after successful registration
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-teal-100 flex items-center justify-center p-4">
      <Card className="">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <CardTitle className="text-3xl">
            {isRegistering ? "Opret konto" : "Velkommen tilbage"}
          </CardTitle>
          <p className="text-green-600 mt-2">
            {isRegistering ? "Opret din Risager Plantage konto" : "Log ind på din konto"}
          </p>
        </CardHeader>

        <CardContent>
          {isRegistering ? (
            <RegisterForm onSuccess={handleRegistrationSuccess} />
          ) : (
            <LoginForm />
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className={isRegistering
                ? "text-green-600 hover:text-green-800 font-medium"
                : "w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-colors"
              }
            >
              {isRegistering
                ? "Har du allerede en konto? Log ind"
                : "Opret konto"}
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-green-600 hover:text-green-800 text-sm"
            >
              ← Tilbage til forsiden
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
