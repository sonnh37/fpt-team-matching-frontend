"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { FormInput, FormSelectEnum } from "@/lib/form-custom-shadcn";
import { cn, getEnumOptions } from "@/lib/utils";
import { authService } from "@/services/auth-service";
import { Department } from "@/types/enums/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Email không hợp lệ");
const usernameSchema = z
  .string()
  .min(1, "Tên người dùng không được để trống")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Tên người dùng không hợp lệ");

const loginSchema = z.object({
  account: z.union([emailSchema, usernameSchema]),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  department: z.nativeEnum(Department).refine((val) => val !== undefined, {
    message: "Vui lòng chọn Campus trước khi đăng nhập.",
  }),
});

export const LoginAccountForm = ({
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
      account: "",
      password: "",
      department: undefined,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      setIsLoading(true);
      const department = form.getValues("department");
      if (department === undefined || department === null) {
        toast.warning("Vui lòng chọn Campus trước khi đăng nhập.");
        return;
      }
      const res = await authService.login(
        data.account,
        data.password,
        data.department
      );
      if (res.status != 1) {
        toast.warning(res.message);
        return;
      }

      localStorage.setItem("showToast", "true");
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6 mx-auto w-full", className)} {...props}>
        <Card className="overflow-hidden bg-background/90  border-none shadow-lg">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col items-center">
                  <Icons.logo className="" />
                  <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                    Đăng nhập bằng tài khoản
                  </h1>
                
                </div>

                <div className="space-y-4">
                  <FormSelectEnum
                    name="department"
                    label="Khu vực"
                    form={form}
                    placeholder="Chọn khu vực"
                    enumOptions={getEnumOptions(Department)}
                  />

                  <FormInput
                    type="text"
                    name="account"
                    label="Tài khoản hoặc Email"
                    placeholder="Nhập tài khoản hoặc email"
                    form={form}
                  />

                  <FormInput
                    type="password"
                    name="password"
                    label="Mật khẩu"
                    placeholder="Nhập mật khẩu"
                    form={form}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Đăng nhập
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-muted-foreground">
                      Hoặc
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full"
                  disabled={isLoading}
                >
                  <IoIosArrowRoundBack className="mr-2" />
                  <span>Quay lại đăng nhập</span>
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