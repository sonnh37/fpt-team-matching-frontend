"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import ErrorSystem from "./errors/error-system";
import { LoadingPage } from "./loading-page";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getUserInfo"],
    queryFn: authService.getUserInfo,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingPage />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  if (result) {
    if (result.status === 1) {
      dispatch(setUser(result.data!));
    } else {
      dispatch(logout());
    }
  }
  
  return <>{children}</>;
};
