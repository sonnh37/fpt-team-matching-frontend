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
        });
    },
  });

  const onSubmit = (data: FormSchema) => {
    try {
      if (data.department === null || data.department === undefined) {
        toast.warning("Vui lòng chọn Campus trước khi đăng nhập.");
        return;
      }
      googleLogin();
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
                  <Icons.logo className="w-28"></Icons.logo>
                </div>
                <div className="grid gap-2">
                  <FormSelectEnum
                    name="department"
                    label="Campus"
                    placeholder="Select a campus"
                    form={form}
                    enumOptions={getEnumOptions(Department)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button variant="default" className="w-full" type="submit">
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
                    <span>Login with Google</span>
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    onClick={() => {
                      router.push("/login-by-account");
                    }}
                    type="button"
                    variant="outline"
                    className="w-full"
                  >
                    <span>Sign in with email & password</span>
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
