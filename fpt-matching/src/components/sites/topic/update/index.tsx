"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import {
  FormInput,
  FormInputTextArea,
  FormSwitch,
} from "@/lib/form-custom-shadcn";
import { fileUploadService } from "@/services/file-upload-service";
import { topicService } from "@/services/topic-service";
import { userService } from "@/services/user-service";
import {
  TopicLecturerCreatePendingCommand,
  TopicSubmitForMentorByStudentCommand,
} from "@/types/models/commands/topic/topic-student-create-pending-command";
import { TopicUpdateCommand } from "@/types/models/commands/topic/topic-update-command";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { Topic } from "@/types/topic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, FileText, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  englishName: z.string().min(1, "Tên tiếng Anh là bắt buộc").nullable(),
  vietNameseName: z.string().min(1, "Tên tiếng Việt là bắt buộc").nullable(),
  abbreviation: z.string().max(20, "Tối đa 20 ký tự").nullable(),
  description: z.string().min(10, "Tối thiểu 10 ký tự").nullable(),
  isEnterpriseTopic: z.boolean().optional(),
  enterpriseName: z.string().optional().nullable(),
  mentorId: z.string().optional().nullable(),
  specialtyId: z.string().optional().nullable(),
  subMentorId: z.string().optional().nullable(),
  fileschema: z.any().optional().nullable(),
});

interface TopicUpdateFormProps {
  topic: Topic;
  onSuccess?: () => void;
}

export function TopicUpdateForm({ topic, onSuccess }: TopicUpdateFormProps) {
  const queryClient = useQueryClient();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogAction, setDialogAction] = useState<"submit" | "update">(
    "submit"
  );
  const role = useCurrentRole();
  const user = useSelectorUser();
  if (!user) return;
  const isLecturer = role === "Mentor";
  const isStudent = role === "Student";
  const query: UserGetAllQuery = {
    role: "Mentor",
    isPagination: false,
  };

  const skipCheckAndSelectUI = isStudent
    ? topic.mentorId != undefined
    : topic.subMentorId != undefined;
  console.log("check_skip", skipCheckAndSelectUI);
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["getUsersByRole", query],
    queryFn: () => userService.getAll(query),
    refetchOnWindowFocus: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishName: topic.englishName,
      vietNameseName: topic.vietNameseName,
      abbreviation: topic.abbreviation,
      description: topic.description,
      isEnterpriseTopic: topic.isEnterpriseTopic || false,
      enterpriseName: topic.enterpriseName,
      mentorId: topic.mentorId,
      specialtyId: topic.specialtyId,
      subMentorId: topic.subMentorId,
    },
  });

  const isEnterpriseTopic = form.watch("isEnterpriseTopic");

  async function handleUpdate(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Hiển thị loading khi bắt đầu xử lý


      let fileUrl = topic.fileUrl; // Giả sử nếu fileschema là string (URL cũ)

      // Chỉ upload file nếu fileschema là File object (file mới)
      if (values.fileschema instanceof File) {
        const fileUpload = await fileUploadService.uploadFile(
          values.fileschema,
          "Topic"
        );
        if (fileUpload.status != 1) {
          return toast.error(fileUpload.message);
        }
        fileUrl = fileUpload.data;
      }

      const command: TopicUpdateCommand = {
        ...topic,
        ...values,
        fileUrl: fileUrl,
        isExistedTeam: false,
      };

      // Create topic based on user role
      const res = await topicService.update(command);


      if (res.status == 1) {
        toast.success(res.message);
        onSuccess?.();
        queryClient.refetchQueries({ queryKey: ["data"] });

        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false); 
    }
  }

  async function handleSubmitToMentorConfirm() {
    setIsSubmitting(true);
    try {
      const values = form.getValues();

      if (!skipCheckAndSelectUI) {
        // Kiểm tra nếu là student và chưa chọn mentor
        if (isStudent && !values.mentorId) {
          return toast.error("Vui lòng chọn giảng viên hướng dẫn");
        }

        // Check mentor availability
        const mentorCheck =
          await userService.checkMentorAndSubMentorSlotAvailability({
            mentorId: isStudent ? values.mentorId ?? undefined : topic.ownerId,
            subMentorId: values.subMentorId ?? undefined,
          });

        if (!mentorCheck.data) {
          return toast.error(mentorCheck.message);
        }
      }

      // Gọi API để nộp cho mentor
      let res;
      if (isStudent) {
        const command: TopicSubmitForMentorByStudentCommand = {
          ...topic,
          mentorId: values.mentorId ?? undefined,
          subMentorId: values.subMentorId ?? undefined,
        };

        // Create topic based on user role
        res = await topicService.submitTopicToMentorByStudent(command);
      }

      if (isLecturer) {
        const command: TopicLecturerCreatePendingCommand = {
          ...topic,
          subMentorId: values.subMentorId ?? undefined,
        };

        // Create topic based on user role
        res = await topicService.submitTopicOfLecturerByLecturer(command);
      }

      if (res?.status === 1) {
        toast.success(res.message);
        onSuccess?.();
        queryClient.refetchQueries({ queryKey: ["data"] });
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form className="space-y-8 p-1 md:p-6 flex justify-center">
        {/* Dialog xác nhận cập nhật ý tưởng */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Xác nhận gửi ý tưởng</span>
              </DialogTitle>
              <DialogDescription className="pt-2">
                Bạn có chắc chắn muốn gửi ý tưởng này không?
                {dialogAction === "submit" && (
                  <>
                    <br />
                    ⚠️ Lưu ý quan trọng: Khi nộp chính thức, đề tài sẽ thuộc
                    quyền quản lý của giảng viên hướng dẫn.
                    <br />
                    Sau khi gửi, bạn không thể chỉnh sửa thông tin đề tài.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={async () => {
                  setIsConfirmDialogOpen(false);
                  if (dialogAction === "submit") {
                    await handleSubmitToMentorConfirm();
                  } else {
                    await handleUpdate(form.getValues());
                  }
                }}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Chắc chắn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Chỉnh sửa ý tưởng
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Cập nhật thông tin bên dưới để chỉnh sửa ý tưởng dự án.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Enterprise Toggle - Only for Lecturers */}
            {isLecturer && (
              <div className="space-y-4 rounded-lg border p-4">
                <FormSwitch
                  form={form}
                  name="isEnterpriseTopic"
                  label="Dự án do Doanh nghiệp tài trợ"
                  description="Chọn nếu dự án của bạn được tài trợ bởi doanh nghiệp"
                />
              </div>
            )}

            {/* Enterprise Name (conditionally shown) */}
            {isEnterpriseTopic && (
              <div className="space-y-4 rounded-lg border p-4">
                <FormInput
                  form={form}
                  name="enterpriseName"
                  label="Tên Doanh nghiệp"
                  description="Tên công ty tài trợ cho dự án này"
                />
              </div>
            )}

            {/* Topic Details Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Chi tiết Ý tưởng</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  form={form}
                  name="englishName"
                  label="Tên tiếng Anh"
                  placeholder="Tên dự án bằng tiếng Anh"
                  description="Tên chính thức của dự án"
                />

                <FormInput
                  form={form}
                  name="vietNameseName"
                  label="Tên tiếng Việt"
                  placeholder="Tên dự án bằng tiếng Việt"
                />
              </div>

              <FormInput
                form={form}
                name="abbreviation"
                label="Viết tắt"
                placeholder="Tên viết tắt của dự án"
                description="Tối đa 20 ký tự"
              />

              <FormInputTextArea
                form={form}
                name="description"
                label="Mô tả"
                placeholder="Tối thiểu 10 ký tự"
                description="Mô tả chi tiết về dự án của bạn..."
              />
            </div>

            {isStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="mentorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giảng viên hướng dẫn</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giảng viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {usersData?.data?.results?.map((user) => (
                            <SelectItem key={user.id} value={user.id!}>
                              <div className="flex items-center gap-2">
                                <span>
                                  {user.lastName} {user.firstName}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {user.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Chọn giảng viên sẽ hướng dẫn dự án của bạn
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subMentorId"
                  render={({ field }) => {
                    const mentorId = form.watch("mentorId");
                    const filteredUsers = usersData?.data?.results?.filter(
                      (user) => user.id !== mentorId
                    );

                    return (
                      <FormItem>
                        <FormLabel>Giảng viên hướng dẫn 2 (Tùy chọn)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? undefined}
                          disabled={!mentorId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn giảng viên 2" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredUsers?.map((user) => (
                              <SelectItem key={user.id} value={user.id!}>
                                <div className="flex items-center gap-2">
                                  <span>
                                    {user.lastName} {user.firstName}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {user.email}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chọn giảng viên sẽ hướng dẫn dự án của bạn
                        </FormDescription>
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}

            {isLecturer && (
              <FormField
                control={form.control}
                name="subMentorId"
                render={({ field }) => {
                  const filteredUsers = usersData?.data?.results?.filter(
                    (user_) => user_.id !== user.id
                  );

                  return (
                    <FormItem>
                      <FormLabel>Giảng viên 2 (Tùy chọn)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                        disabled={!user.id}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giảng viên 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredUsers?.map((userFiltered) => (
                            <SelectItem
                              key={userFiltered?.id}
                              value={userFiltered.id ?? ""}
                            >
                              <div className="flex items-center gap-2">
                                <span>
                                  {userFiltered.lastName}{" "}
                                  {userFiltered.firstName}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {userFiltered.email}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Chọn giảng viên sẽ hướng dẫn dự án của bạn
                      </FormDescription>
                    </FormItem>
                  );
                }}
              />
            )}

            {/* File Upload */}
            <FormField
              control={form.control}
              name="fileschema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tài liệu Dự án</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Hiển thị file hiện tại nếu có */}
                      {topic.fileUrl && (
                        <div className="flex items-center gap-2 p-3 rounded-md bg-gray-100 dark:bg-gray-800">
                          <FileText className="h-5 w-5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {topic.fileUrl.split("/").pop()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              File hiện tại
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={topic.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Input upload file mới */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="dark:bg-muted/50"
                          accept={ALLOWED_EXTENSIONS.join(",")}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Định dạng chấp nhận: {ALLOWED_EXTENSIONS.join(", ")} (tối đa
                    10MB)
                    {topic.fileUrl &&
                      " - Tải lên file mới sẽ ghi đè file hiện tại"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            {isStudent && (
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setDialogAction("submit");
                  setIsConfirmDialogOpen(true);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Nộp"}
              </Button>
            )}

            {isLecturer && (
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setDialogAction("submit");
                  setIsConfirmDialogOpen(true);
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Nộp"}
              </Button>
            )}
            <Button
              type="button"
              variant={"outline"}
              className="border-primary text-primary hover:text-primary"
              disabled={isSubmitting}
              onClick={() => {
                setDialogAction("update");
                setIsConfirmDialogOpen(true);
              }}
            >
              Cập nhật bản nháp
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
