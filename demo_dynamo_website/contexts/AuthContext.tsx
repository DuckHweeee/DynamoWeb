"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "Admin" | "Operator";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
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

// Mock users for demonstration - replace with real API
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@dynamo.com",
    role: "Admin",
  },
  {
    id: "2",
    username: "operator",
    email: "operator@dynamo.com",
    role: "Operator",
  },
];

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

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Mock authentication - replace with real API call
    const mockUser = MOCK_USERS.find(
      (u) => u.username === username && password === "dynamo"
    );

    if (mockUser) {
        // Optimize by reducing redundant operations
        const userData = JSON.stringify(mockUser);
        setUser(mockUser);
        localStorage.setItem("auth-user", userData);
        document.cookie = `auth-user=${userData}; path=/; max-age=${7 * 24 * 60 * 60}`;

        // Redirect based on role
        router.push(mockUser.role === "Admin" ? "/" : "/tablet/process");

        setIsLoading(false);
        return true;
    }

    setIsLoading(false);
    return false;
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
