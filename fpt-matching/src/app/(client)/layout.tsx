"use client";
import AutoBreadcrumb from "@/components/_common/breadcrumbs";
import { LoadingComponent } from "@/components/_common/loading-page";
import Footer from "@/components/layouts/footer";
import { RootState } from "@/lib/redux/store";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";

const Header = dynamic(
  () => import("@/components/layouts/navbar/header").then((mod) => mod.Header),
  { ssr: false }
);
export default function HomeLayout({
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
  return (
    <div className="bg-accent">
      <Header />
      <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
      <Footer />
    </div>
  );
}
