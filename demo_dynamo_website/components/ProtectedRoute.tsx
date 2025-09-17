"use client";

import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ["Admin", "Operator"],
  fallbackPath = "/login" 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // Redirect operators trying to access admin pages
        if (user.role === "Operator") {
          router.push("/tablet");
        } else {
          router.push("/access-denied");
        }
        return;
      }
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
