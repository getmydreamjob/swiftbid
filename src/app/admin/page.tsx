"use client";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase"; // Adjust the import path as needed
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return null; // Or a loading spinner, or redirecting message
  }

  // Authenticated user content
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>User: {user.email}</p>
      {/* Add your dashboard content here */}
    </div>
  );
}