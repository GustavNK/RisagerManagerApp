"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      api.api.userLoginCreate(data),
    onSuccess: () => {
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      setSuccess("Login successful!");
      setError("");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
    onError: (error) => {
      setError(getErrorMessage(error) || "Login failed. Please check your credentials.");
      setSuccess("");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      invitationCode: string;
    }) => api.api.userRegisterCreate(data),
    onSuccess: () => {
      setSuccess("Registration successful! You can now login.");
      setError("");
      setIsRegistering(false);
    },
    onError: (error) => {
      setError(getErrorMessage(error) || "Registration failed. Please try again.");
      setSuccess("");
    },
  });

  const handleLogin = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    loginMutation.mutate({
      username,
      password,
    });
  };

  const handleRegister = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    registerMutation.mutate({
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      invitationCode,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🌲</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800">
            {isRegistering ? "Register" : "Welcome Back"}
          </h1>
          <p className="text-green-600 mt-2">
            {isRegistering ? "Create your Risager Plantage account" : "Sign in to your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  Invitation Code
                </label>
                <input
                  type="text"
                  placeholder="Enter invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-green-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base"
              required
            />
          </div>

          <div className="flex gap-4 mt-6">
            {isRegistering ? (
              <button
                onClick={handleRegister}
                disabled={registerMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? "Creating Account..." : "Register"}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={loginMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setSuccess("");
            }}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Need an account? Register"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-green-600 hover:text-green-800 text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
