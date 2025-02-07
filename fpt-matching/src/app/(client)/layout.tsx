"use client";
import AutoBreadcrumb from "@/components/_common/breadcrumbs";
import { LoadingComponent } from "@/components/_common/loading-page";
import Footer from "@/components/layouts/footer";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const Header = dynamic(
  () => import("@/components/layouts/navbar/header").then((mod) => mod.Header),
  { ssr: false }
);
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <AutoBreadcrumb />
      <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
      <Footer />
    </>
  );
}
