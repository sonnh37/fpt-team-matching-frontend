"use client";
import { RootState } from "@/lib/redux/store";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const Header = dynamic(
  () => import("@/components/layouts/navbar/header").then((mod) => mod.Header),
  { ssr: false }
);
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

  if (!user) return null;

  return <>{children}</>;
}
