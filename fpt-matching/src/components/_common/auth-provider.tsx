"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import { RootState } from "@/lib/redux/store";
import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErrorSystem from "./errors/error-system";
import { LoadingPage } from "./loading-page";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Chặn render children khi chưa check xong
  const user = useSelector((state: RootState) => state.user.user);

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

  useEffect(() => {
    if (result?.status === 1) {
      dispatch(setUser(result.data!));
    } else {
      dispatch(logout());
    }
    setIsAuthChecked(true); // Đánh dấu đã check xong
  }, [result, dispatch]);

  if (isLoading || !isAuthChecked) return <LoadingPage />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  return isAuthChecked ? <>{children}</> : null;
};
