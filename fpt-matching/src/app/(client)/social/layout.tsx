"use client";

import { LoadingComponent } from "@/components/_common/loading-page";
import Footer from "@/components/layouts/footer";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const Header = dynamic(
  () => import("@/components/layouts/navbar/header").then((mod) => mod.Header),
  { ssr: false }
);
export default function SocialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-accent">
      <Header />
      <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
      <Footer />
    </div>
  );
}
