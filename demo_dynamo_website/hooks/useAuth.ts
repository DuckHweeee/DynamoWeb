"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to sync authentication state with cookies for middleware
 */
export function useAuthSync() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Set cookie for middleware to read
      document.cookie = `auth-user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    } else {
      // Clear cookie
      document.cookie = "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [user]);

  return { user };
}

/**
 * Hook to check if user has specific role
 */
export function useRole() {
  const { user } = useAuth();

  const hasRole = (role: string) => user?.role === role;
  const hasAnyRole = (roles: string[]) => user?.role && roles.includes(user.role);
  const isAdmin = () => user?.role === "Admin";
  const isOperator = () => user?.role === "Operator";
  const hasSpecificRole = (roleName: string) => user?.roles?.some(role => role.name === roleName);

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isOperator,
    hasSpecificRole,
    currentRole: user?.role,
    userRoles: user?.roles,
  };
}
