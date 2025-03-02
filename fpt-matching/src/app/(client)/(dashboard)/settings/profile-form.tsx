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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getEnumOptions } from "@/lib/utils";
import { userService } from "@/services/user-service";
import { Gender } from "@/types/enums/user";
import { UserUpdateCommand } from "@/types/models/commands/users/user-update-command";
import { User } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { ProfileStudentForm } from "./profile-student";

const profileFormSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .max(50, { message: "First name must not exceed 50 characters." })
    .nullable()
    .optional(),

  lastName: z
    .string()
    .min(1, { message: "Last name is required." })
    .max(50, { message: "Last name must not exceed 50 characters." })
    .nullable()
    .optional(),

  avatar: z.string().nullable().optional(),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .nullable(),

  dob: z
    .union([z.string(), z.date()]) // Chấp nhận cả string và Date
    .nullable()
    .optional(),

  address: z
    .string()
    .max(255, { message: "Address must not exceed 255 characters." })
    .nullable()
    .optional(),

  gender: z.nativeEnum(Gender).nullable().optional(),

  phone: z
    .string()
    // .regex(/^[0-9]{10,15}$/, { message: "Please enter a valid phone number." })
    .nullable()
    .optional(),

  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(30, { message: "Username must not exceed 30 characters." })
    .nullable(),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .nullable()
    .optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user?: User }) {
  const [imageUrl, setImageUrl] = useState("");
  const [isChanged, setIsChanged] = useState(false);
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
    const updatedValues: UserUpdateCommand = {
      ...data,
      dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
    };

    const response = await userService.update(updatedValues);
    if (response.status !== 1) throw new Error(response.message);

    toast.success("Thay đổi của bạn đã lưu.");
    queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Cv */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit cv profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit cv profile</DialogTitle>
              <DialogDescription>
                <ProfileStudentForm user={user}/>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4"></div>
          
          </DialogContent>
        </Dialog>
        {/* Avatar */}
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <div className="relative w-fit">
                  <CldUploadWidget
                    onSuccess={async (results) => {
                      if (
                        typeof results.info === "object" &&
                        "secure_url" in results.info
                      ) {
                        const imageUrl = results.info.secure_url;
                        setImageUrl(imageUrl);
                        try {
                          field.onChange(imageUrl);
                          await onSubmit(form.getValues());
                        } catch (error) {
                          toast.error("Cập nhật ảnh thất bại!");
                        }
                      } else {
                        toast.error("Upload ảnh thất bại!");
                      }
                    }}
                  >
                    {({ open }) => (
                      <div
                        className="relative group w-24 rounded-md overflow-hidden cursor-pointer"
                        onClick={() => open()}
                      >
                        {imageUrl ? (
                          imageUrl.includes("cloudinary.com") ? (
                            <CldImage
                              src={imageUrl}
                              width={9999}
                              height={9999}
                              crop="fill"
                              alt="Uploaded Image"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={imageUrl}
                              className="w-full h-full object-cover"
                              alt="External Image"
                              width={9999}
                              height={9999}
                            />
                          )
                        ) : (
                          <span className="flex items-center justify-center w-full h-full bg-gray-200">
                            No Image
                          </span>
                        )}
                        {imageUrl && (
                          <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Fix
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Các trường input khác */}
        <FormInput label="First name" name="firstName" form={form} />
        <FormInput label="Last name" name="lastName" form={form} />
        <FormInput
          type="email"
          disabled
          label="Email"
          name="email"
          form={form}
        />
        <FormInputDateTimePicker label="Date" name="dob" form={form} />
        <FormInputPhone label="Phone" name="phone" form={form} />
        <FormRadioGroup
          label="Sex"
          name="gender"
          form={form}
          enumOptions={getEnumOptions(Gender)}
        />
        <FormInput label="Address" name="address" form={form} />

        {/* Nút Submit */}
        <Button type="submit" disabled={!isChanged}>
          Update profile
        </Button>
      </form>
    </Form>
  );
}
