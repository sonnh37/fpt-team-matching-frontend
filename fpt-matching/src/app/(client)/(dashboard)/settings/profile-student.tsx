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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormInput,
  FormInputDateTimePicker,
  FormInputPhone,
  FormInputTextArea,
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
import { Profession } from "@/types/profession";
import { professionService } from "@/services/profession-service";
import { Specialty } from "@/types/specialty";
import { Semester } from "@/types/semester";
import { semesterService } from "@/services/semester-service";
import { Separator } from "@/components/ui/separator";
import { DropzoneOptions } from "react-dropzone";

const profileFormSchema = z.object({
  id: z.string().optional(),
  userId: z.string().nullable().optional(),
  specialtyId: z.string().nullable().optional(),
  semesterId: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  code: z.string().nullable().optional(),
  achievement: z.string().nullable().optional(),
  experienceProject: z.string().nullable().optional(),
  interest: z.string().nullable().optional(),
  fileCv: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileStudentForm({ user }: { user?: User }) {
  const queryClient = useQueryClient();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  const [files, setFiles] = useState<File[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await professionService.fetchAll();
        const res_ = await semesterService.fetchAll();
        setProfessions(res.data ?? []);
        setSemesters(res_.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    // defaultValues: user || {},
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

  async function onSubmit(data: ProfileFormValues) {
    // const updatedValues: UserUpdateCommand = {
    //   ...data,
    //   dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
    // };

    // console.log("check_valueuser", updatedValues);
    // const response = await userService.update(updatedValues);
    // if (response.status !== 1) throw new Error(response.message);

    toast.success("Thay đổi của bạn đã lưu.");
    // queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <FormField
                control={form.control}
                name="fileCv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scan cv</FormLabel>
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
                          <div className="flex items-center justify-center flex-col p-2 w-full ">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Separator />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cột 1 */}
              <FormItem>
                <FormLabel>Profession</FormLabel>
                <Select
                  onValueChange={(value) => {
                    const selectedProfession = professions.find(
                      (cat) => cat.id === value
                    );
                    setSelectedProfession(selectedProfession ?? null);
                  }}
                  value={selectedProfession ? selectedProfession.id : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((pro) => (
                      <SelectItem key={pro.id} value={pro.id!}>
                        {pro.professionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              <FormField
                control={form.control}
                name="specialtyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedProfession ? (
                            <>
                              {selectedProfession?.specialties!.map((spec) => (
                                <SelectItem key={spec.id} value={spec.id!}>
                                  {spec.specialtyName}
                                </SelectItem>
                              ))}
                            </>
                          ) : null}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters ? (
                            <>
                              {semesters.map((semes) => (
                                <SelectItem key={semes.id} value={semes.id!}>
                                  {semes.semesterName}
                                </SelectItem>
                              ))}
                            </>
                          ) : null}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cột 2 */}
              <FormInput label="Code" name="code" form={form} />
              <FormInput label="Bio" name="bio" form={form} />

              {/* Cột 3 */}

              <FormInput label="Achievement" name="achievement" form={form} />
              <FormInput label="Interest" name="interest" form={form} />

              {/* Experience Project (Chiếm 2 cột) */}
              <div className="col-start-1 md:col-span-2">
                <FormInputTextArea
                  label="Experience Project"
                  name="experienceProject"
                  form={form}
                />
              </div>
            </div>
            <div>
              <Separator />
            </div>
            <div>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </div>
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
