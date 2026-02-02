"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { User, AuthContextData } from "@/types";
import { API_CONFIG } from "@/constants";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadUserFromToken();
  }, []);

  async function loadUserFromToken() {
    try {
      const token = Cookies.get("accessToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await api.get("/auth/me", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      setUser(response.data);
    } catch (error: any) {
      if (
        error.code === "ECONNABORTED" ||
        error.code === "ERR_CANCELED" ||
        error.message?.includes("timeout") ||
        error.code === "ERR_NETWORK"
      ) {
        console.warn(
          "Backend demorou muito (Render free tier?). Confiando no token existente...",
        );

        setUser({
          id: "temp",
          email: "loading...",
          name: "Carregando...",
        } as User);
        setLoading(false);
        return;
      }

      if (error.response?.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    Cookies.set("accessToken", accessToken, { expires: 7 });
    Cookies.set("refreshToken", refreshToken, { expires: 30 });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(userData);

    await new Promise((resolve) => setTimeout(resolve, API_CONFIG.UX_DELAY));
    router.push("/dashboard");
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    const { accessToken, refreshToken, user: userData } = response.data;

    Cookies.set("accessToken", accessToken, { expires: 7 });
    Cookies.set("refreshToken", refreshToken, { expires: 30 });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setUser(userData);

    await new Promise((resolve) => setTimeout(resolve, API_CONFIG.UX_DELAY));
    router.push("/dashboard");
  }

  function logout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setUser(null);

    setTimeout(() => {
      router.push("/");
    }, 50);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
