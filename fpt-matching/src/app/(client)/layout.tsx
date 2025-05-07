"use client";
import { useCurrentRole } from "@/hooks/use-current-role";
import {
  initializeCache,
  updateUserCache,
  UserCache,
} from "@/lib/redux/slices/cacheSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user?.user);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.cache) {
      const cache = JSON.parse(user.cache) as UserCache;
      setTheme(cache.theme ?? "light");
      dispatch(initializeCache(user.cache));
    } else {
      const roleCurrent = user.userXRoles[0].role
        ?.roleName;
        console.log("check_role_current", roleCurrent)
      if (roleCurrent) {
        setTheme("light");
        dispatch(updateUserCache({ role: roleCurrent, theme: "light" }));
      }
    }
    
  }, [user, dispatch]);

  //

  if (!user) {
    return;
  }

  if (localStorage.getItem("showToast") === "true") {
    if (user) {
      toast.success(`${user.firstName} ơi, hôm nay có dự định gì nào?`);
    }
    localStorage.removeItem("showToast");
  }

  return <>{children}</>;
}
