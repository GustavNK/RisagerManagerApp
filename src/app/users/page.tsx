"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  nextBookingDate?: string;
  nextBookingPropertyName?: string;
}

interface InvitationCode {
  id: number;
  code: string;
  createdDate: string;
  expiryDate: string;
  isUsed: boolean;
  usedDate?: string;
  usedByUserId?: string;
  createdByUserId: string;
}

export default function UsersPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.api.userAllList();
      return response.data as UserData[];
    },
    enabled: !!user,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No upcoming booking";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const { data: invitationCodes = [], isLoading: loadingCodes } = useQuery({
    queryKey: ['invitationCodes'],
    queryFn: async () => {
      const response = await api.api.userInvitationCodesList();
      return response.data as InvitationCode[];
    },
    enabled: !!user,
  });

  const generateCodeMutation = useMutation({
    mutationFn: () => api.api.userInvitationCodesCreate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitationCodes'] });
      setError("");
    },
    onError: (error) => {
      setError(getErrorMessage(error) || "Failed to generate invitation code");
    },
  });

  const generateInvitationCode = () => {
    generateCodeMutation.mutate();
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-green-800">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">Please log in to view users</h1>
          <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌲</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Risager Plantage</h1>
            </Link>
            <Link href="/" className="text-green-100 hover:text-white">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Users Table */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-green-100">
            <h2 className="text-3xl font-bold text-green-800">All Users</h2>
            <p className="text-green-600 mt-2">Overview of all registered users and their next bookings</p>
          </div>

          {error && (
            <div className="mx-8 mt-6 p-4 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}

          {users.length === 0 ? (
            <div className="px-8 py-12 text-center text-green-600">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Next Booking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {users.map((userData) => {
                    const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || '-';
                    return (
                    <tr key={userData.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {fullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userData.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userData.phoneNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userData.email || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {userData.nextBookingDate ? (
                          <div>
                            <div className="font-medium text-green-800">
                              {formatDate(userData.nextBookingDate)}
                            </div>
                            {userData.nextBookingPropertyName && (
                              <div className="text-xs text-green-600">
                                {userData.nextBookingPropertyName}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No upcoming booking</span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Invitation Codes Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-green-100 overflow-hidden mt-8">
          <div className="px-8 py-6 border-b border-green-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-green-800">Invitation Codes</h2>
              <p className="text-green-600 mt-2">Generate invitation codes for new user registration</p>
            </div>
            <button
              onClick={generateInvitationCode}
              disabled={loadingCodes}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              {loadingCodes ? "Generating..." : "Generate Code"}
            </button>
          </div>

          {invitationCodes.length === 0 ? (
            <div className="px-8 py-12 text-center text-green-600">
              No invitation codes generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Expires</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Used Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {invitationCodes.map((code) => {
                    const isExpired = new Date(code.expiryDate) < new Date();
                    return (
                      <tr key={code.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-mono font-bold text-green-800">
                          {code.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(code.createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(code.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {code.isUsed ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Used
                            </span>
                          ) : isExpired ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {code.usedDate ? new Date(code.usedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {!code.isUsed && !isExpired && (
                            <button
                              onClick={() => copyToClipboard(code.code)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Copy
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}