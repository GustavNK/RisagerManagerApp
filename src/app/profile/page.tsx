"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "@/lib/api";
import { Header, Container } from "@/components/layout";
import { Alert, Button, Card, Label, Input } from "@/components/ui";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.api.userProfileList();
      const profileData = response.data as UserProfile;
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phoneNumber: profileData.phoneNumber || "",
        email: profileData.email || "",
      });
      return profileData;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phoneNumber: string; email: string }) =>
      api.api.userProfileUpdate(data),
    onSuccess: () => {
      setMessage("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      setMessage(getErrorMessage(error) || "Failed to update profile");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <h1 className="text-2xl font-bold text-green-800 mb-4">Please log in to view your profile</h1>
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
        <Container size="sm" className="py-16">
        <div className="mb-6">
          <Button variant="tertiary" size="sm" asChild>
            <Link href="/">← Tilbage til forsiden</Link>
          </Button>
        </div>
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Min Profil</h1>

          {message && (
            <Alert
              variant={message.includes("successfully") ? "success" : "error"}
              className="mb-6"
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="flex-1"
                size="lg"
                isLoading={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Update Profile"}
              </Button>
              <Button
                asChild
                variant="secondary"
                className="flex-1"
                size="lg"
              >
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </form>
        </Card>
        </Container>
      </main>
    </div>
  );
}