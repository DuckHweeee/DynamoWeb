"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "Admin" | "Operator";

export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  role: UserRole;  // Simplified role for compatibility
  roles: Array<{ id: number; name: string }>; // Full role array from API
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const urlLink = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to determine user role from role array
function getUserRole(roles: Array<{ id: number; name: string }> = []): UserRole {
  const hasAdmin = roles.some(role => role.name === "ROLE_ADMIN");

  if (hasAdmin) {
    return "Admin";
  }
  
  return "Operator";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth-user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Sync with cookies for middleware
        document.cookie = `auth-user=${JSON.stringify(userData)}; path=/; max-age=${7 * 24 * 60 * 60}`;
      } catch (error) {
        localStorage.removeItem("auth-user");
        document.cookie = "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    setIsLoading(false);
  }, []);

  // Sync user state with cookies
  useEffect(() => {
    if (user) {
      document.cookie = `auth-user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`;
    } else {
      document.cookie = "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(`${urlLink}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const userData = await response.json();
      
      // Transform API response to match our User interface
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullname: userData.fullname,
        role: getUserRole(userData.role), // Transform role array to simple role
        roles: userData.role || [],
      };

      setUser(user);
      localStorage.setItem("auth-user", JSON.stringify(user));
      document.cookie = `auth-user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Redirect based on role
      router.push(user.role === "Admin" ? "/" : "/tablet/process");

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth-user");
    document.cookie = "auth-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
