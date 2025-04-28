"use client";
import { RootState } from "@/lib/redux/store";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return;
  }

  if (localStorage.getItem("showToast") === "true") {
    if (user) {
      toast.success(
        `${user.firstName} ơi, hôm nay có dự định gì nào?`
      );
    }
    localStorage.removeItem("showToast");
  }

  return <>{children}</>;
}
