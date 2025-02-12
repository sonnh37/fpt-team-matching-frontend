"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ErrorSystem from "./errors/error-system";
import { LoadingPage } from "./loading-page";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const user = useSelector((state: RootState) => state.user.user);

  const [isAllowed, setIsAllowed] = useState(false);

  const { data: result, isLoading, isError, error } = useQuery({
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
  }, [result, dispatch]);

  // useEffect(() => {
  //   if (isLoading) return; // Chờ load dữ liệu xong mới check quyền truy cập

  //   if (!user && pathName !== "/login") {
  //     router.push("/login");
  //   } else if (user && pathName.startsWith("/login")) {
  //     router.push("/");
  //   } else {
  //     setIsAllowed(true); // Cho phép render khi điều kiện hợp lệ
  //   }
  // }, [user, pathName, router, isLoading]);

  if (isLoading) return <LoadingPage />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  return <>{children}</>;
};
