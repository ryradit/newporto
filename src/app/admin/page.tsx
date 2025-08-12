"use client";

import { useAuth } from "@/contexts/auth-context";
import { AuthorManagement } from "@/components/author-management";
import { useEffect, useState } from "react";
import { checkIfUserIsAuthor } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      if (user?.email) {
        const isAuthor = await checkIfUserIsAuthor(user.email);
        setIsAuthorized(isAuthor);
      }
    }

    checkAuthorization();
  }, [user]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not logged in
  if (!user) {
    redirect("/");
  }

  // Show unauthorized message if not an author
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized Access</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AuthorManagement />
    </div>
  );
}
