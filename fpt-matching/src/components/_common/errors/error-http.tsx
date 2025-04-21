"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, AlertTriangle, FileSearch } from "lucide-react";

interface ErrorHttpProps {
  statusCode: 401 | 403 | 404;
  customMessage?: string;
}

export default function ErrorHttp({ statusCode, customMessage }: ErrorHttpProps) {
  const router = useRouter();

  const errorConfig = {
    401: {
      icon: <Lock className="w-10 h-10 text-amber-600 dark:text-amber-400" />,
      title: "Không được phép truy cập",
      defaultMessage: "Bạn cần đăng nhập để xem nội dung này",
    },
    403: {
      icon: <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />,
      title: "Từ chối truy cập",
      defaultMessage: "Bạn không có quyền truy cập trang này",
    },
    404: {
      icon: <FileSearch className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
      title: "Không tìm thấy trang",
      defaultMessage: "Trang bạn yêu cầu không tồn tại hoặc đã bị xóa",
    },
  };

  const { icon, title, defaultMessage } = errorConfig[statusCode];

  return (
    <div className="h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="bg-muted p-4 rounded-full">{icon}</div>
        
        <h1 className="text-4xl font-bold tracking-tight">{statusCode}</h1>
        <h2 className="text-xl font-medium">{title}</h2>
        
        <p className="text-muted-foreground">
          {customMessage || defaultMessage}
        </p>

        <div className="flex gap-3 mt-6 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()}>
            Quay lại
          </Button>
          <Button onClick={() => router.push("/")}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  );
}