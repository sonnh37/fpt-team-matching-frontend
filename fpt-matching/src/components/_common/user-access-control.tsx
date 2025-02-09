"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import store from "@/lib/redux/store";

import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import ErrorSystem from "./errors/error-system";
import { LoadingPage } from "./loading-page";

interface UserAccessControlProps {
  children: React.ReactNode;
}

export const UserAccessControl: React.FC<UserAccessControlProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getUserInfo"],
    queryFn: () => authService.getUserInfo(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    console.log("Error fetching:", error);
    return <ErrorSystem />;
  }

  if (result?.status === 1) {
    const user = result.data!;
    store.dispatch(setUser(user));
    if (pathName.startsWith("/login")) {
      router.push("/");
    }
  } else {
    store.dispatch(logout());
  }

  return <>{children}</>;
};
