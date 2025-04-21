"use client";

import { logout, setUser } from "@/lib/redux/slices/userSlice";
import { authService } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ErrorSystem from "./errors/error-system";
import { LoadingPage } from "./loading-page";
import { AnimatePresence, motion } from "framer-motion";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [showContent, setShowContent] = useState(false);

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
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
      // delay show content,
      setTimeout(() => setShowContent(true), 500);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && minLoadingDone && result) {
      if (result.status === 1) {
        dispatch(setUser(result.data!));
      } else {
        dispatch(logout());
      }
    }
  }, [isLoading, minLoadingDone, result, dispatch]);

  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
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
    </>
  );
};