"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Gender } from "@/types/enums/user";
import { UserUpdateCommand } from "@/types/models/commands/users/user-update-command";
import { User } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { profilestudentService } from "@/services/profile-student-service";
import { BusinessResult } from "@/types/models/responses/business-result";
import { ProfileStudent } from "@/types/profile-student";
import {
  LoadingComponent,
  LoadingPage,
} from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/_common/file-upload";
import { CloudUpload, Paperclip } from "lucide-react";

const profileFormSchema = z.object({
  id: z.string().optional(),
  fileCv: z.string(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileStudentForm({ user }: { user?: User }) {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user || {},
  });

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getProfileStudent"],
    queryFn: profilestudentService.fetchProfileByCurrentUser,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  if (result?.status != 1) {
    // scan cv
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="fileCv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={setFiles}
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full ">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>Select a file to upload.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  }

  async function onSubmit(data: ProfileFormValues) {
    // const updatedValues: UserUpdateCommand = {
    //   ...data,
    //   dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
    // };

    // console.log("check_valueuser", updatedValues);
    // const response = await userService.update(updatedValues);
    // if (response.status !== 1) throw new Error(response.message);

    toast.success("Thay đổi của bạn đã lưu.");
    queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Các trường input khác */}
        {/* <FormInput label="First name" name="firstName" form={form} />
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

        <Button type="submit" disabled={!isChanged}>
          Update profile
        </Button> */}
      </form>
    </Form>
  );
}
