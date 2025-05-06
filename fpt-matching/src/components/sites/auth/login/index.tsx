"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { FormSelectEnum } from "@/lib/form-custom-shadcn";
import { cn, getEnumOptions } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { Department } from "@/types/enums/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  department: z.nativeEnum(Department).refine((val) => val !== undefined, {
    message: "Vui lòng chọn Campus trước khi đăng nhập.",
  }),
});

export const LoginGoogleForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  type FormSchema = z.infer<typeof loginSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      department: undefined,
    },
  });

  const googleLogin = useGoogleLogin({
    scope:
      "openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.addresses.read",
    onSuccess: (response) => {
      const department = form.getValues("department");
      if (department === undefined || department === null) {
        toast.warning("Vui lòng chọn Campus trước khi đăng nhập.");
        setIsLoading(false);
        return;
      }
      authService
        .loginByGoogle(response.access_token, department)
        .then((res) => {
          if (res.status !== 1) {
            toast.warning(res.message);
            return;
          }
          localStorage.setItem("showToast", "true");
          window.location.href = "/";
        })
        .catch((error) => {
          toast.error("Đăng nhập thất bại");
          console.error(error);
        })
        .finally(() => setIsLoading(false));
    },
    onError: () => {
      toast.error("Đăng nhập bằng Google thất bại");
      setIsLoading(false);
    },
    onNonOAuthError: () => {
      setIsLoading(false);
    },
  });

  // Xử lý trường hợp popup bị đóng mà không có phản hồi
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoading) {
        // Nếu trang trở lại visible và vẫn đang loading (có thể popup đã đóng)
        // Chờ thêm 1s để chắc chắn không có sự kiện nào từ Google
        const timer = setTimeout(() => {
          if (isLoading) {
            setIsLoading(false);
            toast.warning("Đăng nhập bị hủy");
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoading]);

  const onSubmit = (data: FormSchema) => {
    try {
      setIsLoading(true);
      if (data.department === null || data.department === undefined) {
        toast.warning("Vui lòng chọn Campus trước khi đăng nhập.");
        setIsLoading(false);
        return;
      }
      googleLogin();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div
        className={cn("flex flex-col gap-6 mx-auto w-full", className)}
        {...props}
      >
        <Card className="overflow-hidden bg-background/90  border-none shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center ">
                  <Icons.logo className="w-32 h-auto" />
                  <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Đăng nhập hệ thống
                  </h1>
                  <p className="text-sm text-muted-foreground text-center">
                    Chọn khu vực và đăng nhập bằng tài khoản Google của bạn
                  </p>
                </div>

                <div className="space-y-4">
                  <FormSelectEnum
                    name="department"
                    label="Khu vực"
                    form={form}
                    placeholder="Chọn khu vực"
                    enumOptions={getEnumOptions(Department)}
                    disabled={isLoading}
                  />

                  <Button 
                    variant="default" 
                    className="w-full" 
                    type="submit"
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center">
                      {isLoading ? (
                        <Icons.spinner className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5 mr-2"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                      <span>Đăng nhập với Google</span>
                    </div>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-muted-foreground">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/login-by-account")}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={isLoading}
                >
                  <span>Tài khoản & Mật khẩu</span>
                </Button>
              </div>
            </form>

            <div className="hidden md:block relative">
              <Image
                src="/dai-hoc-fpt.jpg"
                fill
                alt="FPT University Campus"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
              <div className="absolute bottom-6 left-6 text-white/90">
                <h2 className="text-xl font-bold">FPT University</h2>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
};