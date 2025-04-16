"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LoadingPage } from "./loading-page";
import { AnimatePresence, motion } from "framer-motion";
import ErrorSystem from "./errors/error-system";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const ALLOWED_UNAUTHENTICATED_PAGES = ["/login", "/login-by-account"];

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getUserInfo"],
    queryFn: authService.getUserInfo,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
      setTimeout(() => setShowContent(true), 300);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && minLoadingDone) {
      if (result?.status === 1) {
        dispatch(setUser(result.data!));
      } else if (result?.status === -5) {
        setSessionExpired(true);
        dispatch(logout()); 
        if(!ALLOWED_UNAUTHENTICATED_PAGES.includes(pathname)) {
          router.push("/login")
        }
      } else if (result) {
        setSessionExpired(true);
        if (!ALLOWED_UNAUTHENTICATED_PAGES.includes(pathname)) {
          toast.warning(result.message, {
            description: "Vui lòng đăng nhập lại để tiếp tục",
            duration: Infinity,
            dismissible: false,
            action: {
              label: "Đăng nhập",
              onClick: () => {
                dispatch(logout());
                router.push("/login");
              },
            },
          });
        }
      }
    }
  }, [isLoading, minLoadingDone, result, dispatch, router, pathname]);

  if (isError) {
    console.error("Auth error:", error);
    toast.error("Lỗi hệ thống", {
      description: "Không thể xác thực phiên làm việc",
    });
    return <ErrorSystem message={error.message} />;
  }

  if (sessionExpired) {
    if (ALLOWED_UNAUTHENTICATED_PAGES.includes(pathname)) {
      return (
        <AnimatePresence>
          {showContent && !isLoading && minLoadingDone && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      );
    }
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {(isLoading || !minLoadingDone) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <LoadingPage />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && !isLoading && minLoadingDone && !sessionExpired && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};