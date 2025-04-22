"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorSystemProps {
  message?: string;
  errorCode?: number | string;
  showRetry?: boolean;
}

export default function ErrorSystem({
  message = "Đã xảy ra lỗi kết nối với máy chủ",
  errorCode,
  showRetry = true,
}: ErrorSystemProps) {
  const router = useRouter();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="bg-red-100/80 dark:bg-red-900/20 p-4 rounded-full">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>
        
        {errorCode && (
          <div className="text-sm font-mono px-3 py-1 bg-muted rounded-full">
            Mã lỗi: {errorCode}
          </div>
        )}
        
        <h1 className="text-4xl font-bold tracking-tight">
          Lỗi kết nối máy chủ
        </h1>
        
        <p className="text-muted-foreground text-lg">
          {message || "Không thể kết nối tới máy chủ, vui lòng thử lại sau"}
        </p>

        <div className="flex gap-3 mt-6 w-full sm:w-auto flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Quay lại
          </Button>
          
          {showRetry && (
            <Button
              variant="secondary"
              onClick={handleRetry}
              className="flex-1 gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </Button>
          )}
          
          <Button onClick={() => router.push("/")} className="flex-1">
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}