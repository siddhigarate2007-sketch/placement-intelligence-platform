"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "./api";

interface UserProfile {
  id: number;
  email: string;
  full_name: string;
  role: "STUDENT" | "OFFICER" | "FACULTY" | "ADMIN";
  department_id?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: "STUDENT" | "OFFICER" | "FACULTY") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const userProfile: UserProfile = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
      };
      setToken(data.access_token);
      setUser(userProfile);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(userProfile));

      if (userProfile.role === "OFFICER") {
        router.push("/officer");
      } else if (userProfile.role === "FACULTY") {
        router.push("/faculty");
      } else {
        router.push("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const userProfile: UserProfile = {
        id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
      };
      setToken(data.access_token);
      setUser(userProfile);
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(userProfile));

      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  const switchDemoRole = async (role: "STUDENT" | "OFFICER" | "FACULTY") => {
    let email = "priya@student.edu";
    let password = "Student@123";
    if (role === "OFFICER") {
      email = "officer@placement.edu";
      password = "Admin@123";
    } else if (role === "FACULTY") {
      email = "faculty@placement.edu";
      password = "Admin@123";
    }
    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
