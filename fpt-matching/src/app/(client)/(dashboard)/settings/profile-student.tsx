"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Profession } from "@/types/profession";
import { User } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
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
    maxSize: 1024 * 1024 * 4, // 4MB
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, professionsRes] = await Promise.all([
          profilestudentService.getProfileByCurrentUser(),
          (await professionService.getAll()).data,
        ]);

        setProfile(profileRes.data ?? null);
        setProfessions(professionsRes?.results ?? []);
        form.reset(profileRes.data);

        const profess = professionsRes?.results?.find(
          (m) => m.id === profileRes.data?.specialty?.professionId
        );
        setSelectedProfession(profess ?? null);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
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
      setIsLoadingUpload(true);
      try {
        if (profile?.fileCv) {
          // await cloudinaryService.(profile.fileCv);
        }

        fileCv = await cloudinaryService.uploadFile(files[0]);
      } catch (error) {
        toast.error("Lỗi khi tải lên CV");
        console.error(error);
        setIsLoadingUpload(false);
        return;
      } finally {
        setIsLoadingUpload(false);
      }
    }

    try {
      if (!profile?.id) {
        const profileStudentCommand: ProfileStudentCreateCommand = {
          ...data,
          fileCv: fileCv,
        };
        const response = await profilestudentService.create(
          profileStudentCommand
        );
        if (response.status !== 1) throw new Error(response.message);
        toast.success("Cập nhật hồ sơ thành công!");
      } else {
        const profileStudentCommand: ProfileStudentUpdateCommand = {
          ...data,
          fileCv: fileCv,
        };
        const response = await profilestudentService.update(
          profileStudentCommand
        );
        if (response.status !== 1) throw new Error(response.message);
        toast.success("Cập nhật hồ sơ thành công!");
      }

      queryClient.refetchQueries({ queryKey: ["getUserInfo"] });
      setOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu hồ sơ");
      console.error(error);
    }
  }

  async function handleScanCv(newFiles: File[] | null) {
    if (!newFiles || newFiles.length === 0) {
      toast.error("Vui lòng chọn file CV");
      return;
    }

    try {
      setIsLoadingUpload(true);
      const response = await apiHubsService.scanCv(newFiles[0]);
      if (response) {
        // form.setValue("fullSkill", response.skill?.toString());
        // form.setValue("experienceProject", response.?.toString())
        form.setValue("bio", response.context?.toString())
        form.setValue("experienceProject", response.skill?.toString())
        form.setValue("json", JSON.stringify(response));
        toast.success("Quét CV thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi quét CV");
      console.error(error);
    } finally {
      setIsLoadingUpload(false);
    }
  }

  const onValueChange = (newFiles: File[] | null) => {
    setFiles(newFiles);
    if (newFiles && newFiles.length > 0) {
      handleScanCv(newFiles);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Chỉnh sửa hồ sơ</Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[60%] sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold ">
            Hồ sơ sinh viên
          </DialogTitle>
          <DialogDescription className="">
            Cập nhật thông tin hồ sơ cá nhân của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Phần upload CV */}
              <div className="p-4 rounded-lg">
                <FormField
                  control={form.control}
                  name="fileCv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium mb-2">
                        Tải lên CV (PDF)
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          value={files}
                          onValueChange={onValueChange}
                          dropzoneOptions={dropZoneConfig}
                          className="relative  border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-zinc-500 transition-colors"
                        >
                          <FileInput className="outline-none">
                            <div className="flex flex-col items-center justify-center p-4 w-full">
                              <CloudUpload className="w-10 h-10 mb-2" />
                              <p className="mb-1 text-sm ">
                                <span className="font-semibold ">
                                  Nhấn để tải lên
                                </span>
                                &nbsp;hoặc kéo thả file vào đây
                              </p>
                              <p className="text-xs ">
                                Chỉ chấp nhận file PDF (tối đa 4MB)
                              </p>
                            </div>
                          </FileInput>
                          <FileUploaderContent>
                            {files && files.length > 0 ? (
                              files.map((file, i) => (
                                <FileUploaderItem
                                  key={i}
                                  index={i}
                                  className="border border-zin-100 rounded-md p-2"
                                >
                                  <Paperclip className="h-4 w-4 " />
                                  <span className="ml-2 text-sm">
                                    {file.name}
                                  </span>
                                </FileUploaderItem>
                              ))
                            ) : profile?.fileCv ? (
                              <div className="flex items-center space-x-2 p-2 rounded-md border border-zinc-100">
                                <Paperclip className="h-4 w-4 " />
                                <a
                                  href={profile.fileCv}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline text-sm"
                                >
                                  {decodeURIComponent(
                                    profile.fileCv.split("/").pop() ??
                                      "CV hiện tại"
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

              <Separator className="my-6" />

              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột 1 */}
                <div className="space-y-4">
                  <FormItem>
                    <FormLabel className="block text-sm font-medium">
                      Ngành học
                    </FormLabel>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn ngành học" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions &&
                          professions?.map((pro) => (
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
                        <FormLabel className="block text-sm font-medium ">
                          Chuyên ngành
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value ?? undefined}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProfession?.specialties?.map((spec) => (
                                <SelectItem key={spec.id} value={spec.id!}>
                                  {spec.specialtyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormInput
                    label="Mã người dùng"
                    name="code"
                    form={form}
                    placeholder="Nhập Mã người dùng"
                  />
                </div>

                {/* Cột 2 */}
                <div className="space-y-4">
                  <FormInput
                    label="Giới thiệu bản thân"
                    name="bio"
                    form={form}
                    placeholder="Mô tả ngắn về bản thân"
                  />

                  <FormInput
                    label="Sở thích"
                    name="interest"
                    form={form}
                    placeholder="Nhập sở thích cá nhân"
                  />

                  <FormInput
                    label="Thành tích"
                    name="achievement"
                    form={form}
                    placeholder="Nhập các thành tích đạt được"
                  />
                </div>
              </div>

              {/* Kinh nghiệm dự án */}
              <div className="space-y-4">
                <FormInputTextArea
                  label="Kinh nghiệm dự án"
                  name="experienceProject"
                  form={form}
                  placeholder="Mô tả các dự án đã tham gia, vai trò và kinh nghiệm đạt được"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isLoadingUpload}>
                {isLoadingUpload ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : profile?.id ? (
                  "Cập nhật hồ sơ"
                ) : (
                  "Cập nhật hồ sơ"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
