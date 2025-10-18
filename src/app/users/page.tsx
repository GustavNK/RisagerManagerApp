"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { Header, Container } from "@/components/layout";
import { Alert, Button, Card } from "@/components/ui";

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
        <Card className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-green-800 mb-4">Please log in to view users</h1>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Header />

      <main>
        <Container size="lg" className="py-16">
        <div className="mb-6">
          <Button variant="tertiary" size="sm" asChild>
            <Link href="/">← Tilbage til forsiden</Link>
          </Button>
        </div>
        <Card className="overflow-hidden">
          <div className="px-8 py-6 border-b border-green-100">
            <h1 className="text-3xl font-bold text-green-800">Brugerstyring</h1>
            <p className="text-green-600 mt-2">Oversigt over alle registrerede brugere og deres næste bookinger</p>
          </div>

          {error && (
            <div className="mx-8 mt-6">
              <Alert variant="error">
                {error}
              </Alert>
            </div>
          )}

          {users.length === 0 ? (
            <div className="px-8 py-12 text-center text-green-600">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="">
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
        </Card>

        {/* Invitation Codes Section */}
        <Card className="overflow-hidden mt-8">
          <div className="px-8 py-6 border-b border-green-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-green-800">Invitation Codes</h2>
              <p className="text-green-600 mt-2">Generate invitation codes for new user registration</p>
            </div>
            <Button
              onClick={generateInvitationCode}
              disabled={loadingCodes}
              isLoading={loadingCodes}
            >
              {loadingCodes ? "Generating..." : "Generate Code"}
            </Button>
          </div>

          {invitationCodes.length === 0 ? (
            <div className="px-8 py-12 text-center text-green-600">
              No invitation codes generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="">
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
                            <Button
                              onClick={() => copyToClipboard(code.code)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Copy
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        </Container>
      </main>
    </div>
  );
}