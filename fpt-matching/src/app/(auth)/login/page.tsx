"use client";

import { LoginForm } from "@/components/sites/auth/login/login-form";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { RootState } from "@/lib/redux/store";
import { Role } from "@/types/user";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
