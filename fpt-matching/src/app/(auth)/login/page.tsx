"use client";

import { LoginGoogleForm } from "@/components/sites/auth/login";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-svh items-center justify-center p-6 md:p-10">
      <div 
        className="absolute inset-0 bg-[url('/dai-hoc-fpt.jpg')] bg-cover bg-center blur-sm"
      ></div>
      
      {/* Overlay làm tối nền (tuỳ chọn) */}
      <div className="absolute inset-0 bg-black/50 "></div>
      
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <LoginGoogleForm />
      </div>
    </div>
  );
}