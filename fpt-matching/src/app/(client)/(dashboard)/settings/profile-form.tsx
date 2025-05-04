"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  FormInput,
  FormInputDateTimePicker,
  FormInputPhone,
  FormRadioGroup,
} from "@/lib/form-custom-shadcn";
import { getEnumOptions } from "@/lib/utils";
import { userService } from "@/services/user-service";
import { Department, Gender } from "@/types/enums/user";
import { UserUpdateCommand } from "@/types/models/commands/users/user-update-command";
import { User } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ProfileStudentForm } from "./profile-student";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(1, { message: "Họ không được để trống" })
    .max(50, { message: "Họ không được vượt quá 50 ký tự" })
    .nullable()
    .optional(),
  lastName: z
    .string()
    .min(1, { message: "Tên không được để trống" })
    .max(50, { message: "Tên không được vượt quá 50 ký tự" })
    .nullable()
    .optional(),
  avatar: z.string().nullable().optional(),
  email: z
    .string()
    .email({ message: "Vui lòng nhập địa chỉ email hợp lệ" })
    .nullable(),
  dob: z
    .union([z.string(), z.date()])
    .nullable()
    .optional(),
  address: z
    .string()
    .max(255, { message: "Địa chỉ không được vượt quá 255 ký tự" })
    .nullable()
    .optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
  department: z.nativeEnum(Department).nullable().optional(),
  phone: z
    .string()
    .nullable()
    .optional(),
  username: z
    .string()
    .min(2, { message: "Tên đăng nhập phải có ít nhất 2 ký tự" })
    .max(30, { message: "Tên đăng nhập không được vượt quá 30 ký tự" })
    .nullable(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user?: User }) {
  const [imageUrl, setImageUrl] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user || {},
  });

  useEffect(() => {
    if (user) {
      form.reset(user);
      setImageUrl(user.avatar || "");
    }

    const subscription = form.watch((values) => {
      const hasChanged = JSON.stringify(values) !== JSON.stringify(user);
      setIsChanged(hasChanged);
    });

    return () => subscription.unsubscribe();
  }, [user, form]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsSubmitting(true);
      const updatedValues: UserUpdateCommand = {
        ...data,
        dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
      };

      const response = await userService.update(updatedValues);
      if (response.status !== 1) throw new Error(response.message);

      toast.success("Cập nhật thông tin thành công");
      queryClient.refetchQueries({ queryKey: ["getUserInfo"] });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProfileStudentForm user={user} />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thông tin cá nhân</CardTitle>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Ảnh đại diện
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-fit">
                            <CldUploadWidget
                              onSuccess={async (results) => {
                                if (
                                  typeof results.info === "object" &&
                                  "secure_url" in results.info
                                ) {
                                  setIsUploading(true);
                                  const imageUrl = results.info.secure_url;
                                  setImageUrl(imageUrl);
                                  field.onChange(imageUrl);
                                  await onSubmit(form.getValues());
                                  toast.success("Tải lên ảnh thành công");
                                } else {
                                  toast.error("Tải lên ảnh thất bại");
                                }
                                setIsUploading(false);
                              }}
                              onUploadAdded={() => setIsUploading(true)}
                              onError={() => {
                                toast.error("Tải lên ảnh thất bại");
                                setIsUploading(false);
                              }}
                              options={{
                                sources: ['local', 'url'],
                                multiple: false,
                                maxFiles: 1,
                                clientAllowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
                                maxImageFileSize: 5000000,
                              }}
                            >
                              {({ open }) => (
                                <div className="relative group">
                                  <div
                                    className="relative w-32 h-32 rounded-lg overflow-hidden cursor-pointer border-2 border-zinc-300 dark:border-zinc-600 hover:border-primary transition-all"
                                    onClick={() => open()}
                                  >
                                    {imageUrl ? (
                                      imageUrl.includes("cloudinary.com") ? (
                                        <CldImage
                                          src={imageUrl}
                                          width={128}
                                          height={128}
                                          crop="fill"
                                          alt="Ảnh đại diện"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <Image
                                          src={imageUrl}
                                          className="w-full h-full object-cover"
                                          alt="Ảnh đại diện"
                                          width={128}
                                          height={128}
                                        />
                                      )
                                    ) : (
                                      <div className="w-full h-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                                        <span className="text-zinc-500 dark:text-zinc-400">
                                          Chọn ảnh
                                        </span>
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <span className="text-white font-medium">
                                        {isUploading ? (
                                          <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                          "Đổi ảnh"
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CldUploadWidget>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormInput 
                    label="Họ" 
                    name="firstName" 
                    form={form}
                    placeholder="Nhập họ của bạn"
                    description="Ví dụ: Nguyễn, Trần, Lê,..."
                  />

                  <FormInput 
                    label="Tên" 
                    name="lastName" 
                    form={form}
                    placeholder="Nhập tên của bạn"
                    description="Ví dụ: Văn A, Thị B,..."
                  />

                  <FormInput
                    type="email"
                    disabled
                    label="Email"
                    name="email"
                    form={form}
                    placeholder="Địa chỉ email"
                    description="Email đăng nhập hệ thống"
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FormInputDateTimePicker 
                    label="Ngày sinh" 
                    name="dob" 
                    form={form}
                    description="Chọn ngày tháng năm sinh"
                  />

                  <FormInputPhone 
                    label="Số điện thoại" 
                    name="phone" 
                    form={form}
                    placeholder="Nhập số điện thoại"
                    description="Ví dụ: 0987654321"
                  />

                  <FormRadioGroup
                    label="Giới tính"
                    name="gender"
                    form={form}
                    enumOptions={getEnumOptions(Gender)}
                    description="Chọn giới tính của bạn"
                  />

                  <FormInput 
                    label="Địa chỉ" 
                    name="address" 
                    form={form}
                    placeholder="Nhập địa chỉ"
                    description="Ví dụ: Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={!isChanged || isSubmitting}
                  className="min-w-[180px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật thông tin"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}