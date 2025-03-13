"use client";
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import stringSimilarity from "string-similarity";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorSystem from "@/components/_common/errors/error-system";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/_common/file-upload";
import { LoadingComponent } from "@/components/_common/loading-page";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FormInput, FormInputTextArea } from "@/lib/form-custom-shadcn";
import { apiHubsService } from "@/services/api-hubs-service";
import { professionService } from "@/services/profession-service";
import { profilestudentService } from "@/services/profile-student-service";
import { semesterService } from "@/services/semester-service";
import { Profession } from "@/types/profession";
import { Semester } from "@/types/semester";
import { User } from "@/types/user";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import { toast } from "sonner";
import { ProfileStudentUpdateCommand } from "@/types/models/commands/profile-students/profile-student-update-command";
import { ProfileStudentCreateCommand } from "@/types/models/commands/profile-students/profile-student-create-command";
import { ProfileStudent } from "@/types/profile-student";
import { cloudinaryService } from "@/services/cloudinary-service";

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
  json: z.string().nullable().optional(),
  fullSkill: z.string().nullable().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileStudentForm({ user }: { user?: User }) {
  const queryClient = useQueryClient();
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  const [profile, setProfile] = useState<ProfileStudent | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  const dropZoneConfig: DropzoneOptions = {
    maxFiles: 1,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, professionsRes] = await Promise.all([
          profilestudentService.fetchProfileByCurrentUser(),
          professionService.fetchAll(),
        ]);

        setProfile(profileRes.data ?? null);
        setProfessions(professionsRes.data ?? []);
        form.reset(profileRes.data);

        const profess = professionsRes.data?.find(
          (m) => m.id === profileRes.data?.specialty?.professionId
        );
        setSelectedProfession(profess ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;

  async function onSubmit(data: ProfileFormValues) {
    let fileCv = data.fileCv;

    if (files && files.length > 0) {
      // if (profile?.fileCv) {
      //   const isDeleted = await cloudinaryService.deleteFile(profile.fileCv);
      //   if (!isDeleted) return;
      // }
      if (profile?.fileCv) {
        // const isDeleted = await cloudinaryService.deleteFile(profile.fileCv);
        // if (!isDeleted) {
        //     toast.error("Xóa file cũ thất bại!");
        //     return;
        // }
      }
       // Bắt đầu upload

      fileCv = await cloudinaryService.uploadFile(files[0]);

    }

    if (profile == undefined || !profile.id) {
      const profileStudentCommand: ProfileStudentCreateCommand = {
        ...data,
        fileCv: fileCv,
      };
      const response = await profilestudentService.create(
        profileStudentCommand
      );
      if (response.status !== 1) throw new Error(response.message);
    } else {
      const profileStudentCommand: ProfileStudentUpdateCommand = {
        ...data,
        fileCv: fileCv,
      };

      const response = await profilestudentService.update(
        profileStudentCommand
      );
      if (response.status !== 1) throw new Error(response.message);
    }

    toast.success("Thay đổi của bạn đã lưu.");
    queryClient.invalidateQueries({ queryKey: ["getUserInfo"] });
    setOpen(false);
  }

  async function handleScanCv(newFiles: File[] | null) {
    if (!newFiles || newFiles.length === 0) {
      toast.error("Vui lòng chọn một file CV.");
      return;
    }

    try {
      setIsLoadingUpload(true);
      const response = await apiHubsService.scanCv(newFiles[0]);
      if (response) {
        form.setValue("fullSkill", response.skill?.toString());
        form.setValue("json", JSON.stringify(response));
        toast.success("Scan CV thành công!");
      }
      setIsLoadingUpload(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi scan CV.");
      console.error(error);
      setIsLoadingUpload(false);

    }
  }

  const onValueChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
    if (newFiles && newFiles.length > 0) {
      handleScanCv(newFiles);
    }
  };

  // if (!selectedProfession) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit cv profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[60%] sm:max-w-fit max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit cv profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
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
                              onValueChange={onValueChange}
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
                                {files && files.length > 0 ? (
                                  files.map((file, i) => (
                                    <FileUploaderItem key={i} index={i}>
                                      <Paperclip className="h-4 w-4 stroke-current" />
                                      <span>{file.name}</span>
                                    </FileUploaderItem>
                                  ))
                                ) : profile?.fileCv ? (
                                  <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                                    <Paperclip className="h-4 w-4 stroke-current" />
                                    <a
                                      href={profile.fileCv}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {decodeURIComponent(
                                        profile.fileCv.split("/").pop() ??
                                          "CV File"
                                      )}
                                    </a>
                                  </div>
                                ) : null}
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
                          const selectedProfession = professions?.find(
                            (cat) => cat.id === value
                          );
                          setSelectedProfession(selectedProfession ?? null);
                        }}
                        value={
                          selectedProfession ? selectedProfession.id : undefined
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select profession" />
                        </SelectTrigger>
                        <SelectContent>
                          {professions?.map((pro) => (
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
                              onValueChange={(value) => {
                                if (value) {
                                  field.onChange(value);
                                }
                              }}
                              value={
                                field.value ??
                                form.watch("specialtyId") ??
                                undefined
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select specialty" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedProfession ? (
                                  <>
                                    {selectedProfession?.specialties!.map(
                                      (spec) => (
                                        <SelectItem
                                          key={spec.id}
                                          value={spec.id!}
                                        >
                                          {spec.specialtyName}
                                        </SelectItem>
                                      )
                                    )}
                                  </>
                                ) : null}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
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
              /> */}

                    {/* Cột 2 */}
                    <FormInput label="Code" name="code" form={form} />
                    <FormInput label="Bio" name="bio" form={form} />

                    {/* Cột 3 */}

                    <FormInput
                      label="Achievement"
                      name="achievement"
                      form={form}
                    />
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
                    <Button disabled={isLoadingUpload} type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
