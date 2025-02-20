"use client";

import { LoginAccountForm } from "@/components/sites/auth/login-by-account";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginAccountForm />
      </div>
    </div>
  );
}
