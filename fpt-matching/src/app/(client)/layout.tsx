"use client";
import { useCurrentSemester, useCurrentSemesterId } from "@/hooks/use-current-role";
import {
  initializeCache,
  updateUserCache,
  UserCache,
} from "@/lib/redux/slices/cacheSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user?.user);
  const {currentSemester} = useCurrentSemester();
  const router = useRouter();
  const { setTheme } = useTheme();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const initializeUserCache = async () => {
      try {
        if (user.cache) {
          const cache = JSON.parse(user.cache) as UserCache;
          setTheme(cache.theme ?? "light");
          
          // Đảm bảo semester trong cache khớp với semesterId hiện tại
          const updatedCache = {
            ...cache,
            semester: currentSemester?.id ?? cache.semester
          };
          
          await dispatch(initializeCache(JSON.stringify(updatedCache)));
        } else {
          const roleCurrent = user.userXRoles[0]?.role?.roleName;
          console.log("check_rolecurrent", roleCurrent)
          console.log("check_currentsemester", currentSemester)
          if (roleCurrent && currentSemester?.id) {
            setTheme("light");
            await dispatch(
              updateUserCache({
                role: roleCurrent,
                theme: "light",
                semester: currentSemester.id,
              })
            );
          }
        }

        if (localStorage.getItem("showToast") === "true") {
          toast.success(`${user.firstName} ơi, hôm nay có dự định gì nào?`);
          localStorage.removeItem("showToast");
        }
      } catch (error) {
        console.error("Cache initialization error:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUserCache();
  }, [user, currentSemester, dispatch, setTheme, router]);

  if (!user || isInitializing) {
    return null;
  }

  return <>{children}</>;
}