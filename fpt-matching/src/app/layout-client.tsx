"use client";
import store from "@/lib/redux/store";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/_common/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";

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
        // color="#1b2d3f"
        height={4}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        template='<div class="bar" role="bar"><div class="peg"></div></div>
                    <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={1600}
        showAtBottom={false}
      />
      <ThemeProvider attribute="class" enableSystem={true} defaultTheme="light">
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={100}>
              <AuthProvider>{children}</AuthProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
      <Toaster
        position="top-right"
        richColors
        // icons={{
        //   success: "🎉",
        //   error: "🚨",
        //   warning: "⚠️",
        // }}
      />
    </>
  );
}
