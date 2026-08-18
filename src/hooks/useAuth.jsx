import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, logoutApi, getMeApi } from "../services/authApi.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const STORAGE_KEY = "sec_library_admin";

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // Cached display object for instant UI on refresh — NOT proof of a valid
  // session by itself. The /me query below is what actually validates the
  // httpOnly auth_token cookie against the backend.
  const [cachedUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useQuery({
    queryKey: ["adminMe"],
    queryFn: getMeApi,
    enabled: !!cachedUser, // skip the call entirely if there was never a cached login
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = meData?.data?.admin || (isMeLoading ? cachedUser : null);
  const isInitializing = !!cachedUser && isMeLoading;

  const loginMutation = useMutation({
    mutationFn: loginApi, // { regNo, password }
    onSuccess: (response) => {
      const admin = response.data.admin;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
      queryClient.setQueryData(["adminMe"], response);
      toast.success(response.message || "Logged in successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logoutApi,

    onSettled: () => {
      localStorage.removeItem(STORAGE_KEY);
      queryClient.clear();
    },

    onSuccess: (response) => {
      toast.success(response.message || "Logged out");
      navigate("/login");
    },

    onError: () => {
      toast.success("Logged out");
      navigate("/login");
    },
  });

  const value = {
    user: isMeError ? null : user,
    isInitializing,
    isAuthenticated: !isMeError && !!user,
    login: (credentials) => loginMutation.mutateAsync(credentials),
    isLoggingIn: loginMutation.isPending,
    logout: () => logoutMutation.mutateAsync(),
    isLoggingOut: logoutMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
