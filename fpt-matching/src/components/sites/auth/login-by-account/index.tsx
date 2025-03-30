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
    }
  };
  return (
    <Form {...form}>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden border-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex w-full justify-center items-center gap-2">
                  <Icons.logo></Icons.logo>
                </div>
                <div className="grid gap-2">
                  <FormSelectEnum
                    name="department"
                    label="Select Campus"
                    form={form}
                    placeholder="Select a campus"
                    enumOptions={getEnumOptions(Department)}
                  />
                </div>
                <div className="grid gap-2">
                  <FormInput
                    type="email"
                    name="account"
                    label="Email"
                    form={form}
                  />
                </div>
                <div className="grid gap-2">
                  <FormInput
                    type="password"
                    name="password"
                    label="Password"
                    form={form}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"></div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="w-full"
                  >
                    <IoIosArrowRoundBack />
                    <span className=""> Back</span>
                  </Button>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <Image
                src="/dai-hoc-fpt.jpg"
                width={9999}
                height={9999}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Form>
  );
};
