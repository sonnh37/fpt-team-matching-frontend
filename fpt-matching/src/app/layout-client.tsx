"use client";
import store from "@/lib/redux/store";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";
import AuthProvider from "@/components/_common/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfirmProvider } from "@/components/_common/formdelete/confirm-context";
import { CircleCheck } from "lucide-react";
import { Toaster } from "@/components/_common/toast";
import { Const } from "@/lib/constants/const";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  if (!queryClient) {
    return null;
  }

  return (
    <>
      <NextTopLoader
        color="#F97316"
        height={4}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #de3500,0 0 5px #de3500"
        template='<div class="bar" role="bar"><div class="peg"></div></div>
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={1600}
        showAtBottom={false}
      />
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider
              clientId={Const.CLIENT_ID ?? ""}
            >
              <TooltipProvider delayDuration={100}>
                <AuthProvider>
                  <ConfirmProvider>{children}</ConfirmProvider>
                </AuthProvider>
              </TooltipProvider>
            </GoogleOAuthProvider>
          </QueryClientProvider>
        </Provider>
        <Toaster/>
      </ThemeProvider>
    </>
  );
}
