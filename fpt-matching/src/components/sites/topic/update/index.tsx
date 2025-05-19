"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Topic } from "@/types/topic";
import Link from "next/link";
import {
  FormInput,
  FormInputTextArea,
  FormSwitch,
} from "@/lib/form-custom-shadcn";
import { toast } from "sonner";
import { userService } from "@/services/user-service";
import { fileUploadService } from "@/services/file-upload-service";
import { AlertCircle, FileText, Send } from "lucide-react";
import { useSelectorUser } from "@/hooks/use-auth";
import { TopicCreateCommand } from "@/types/models/commands/topic/topic-create-command";
import { topicService } from "@/services/topic-service";
import { TopicUpdateCommand } from "@/types/models/commands/topic/topic-update-command";
import { TopicStudentCreatePendingCommand } from "@/types/models/commands/topic/topic-student-create-pending-command";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";

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
}

export function TopicUpdateForm({ topic }: TopicUpdateFormProps) {
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);
  const role = useCurrentRole();
  const user = useSelectorUser();
  if (!user) return;
  const isLecturer = role === "Mentor";
  const isStudent = role === "Student";
  const isEnterpriseTopic = topic.isEnterpriseTopic;
  const query: UserGetAllQuery = {
    role: "Mentor",
    isPagination: false,
  };

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

  async function handleSubmitConfirm(values: z.infer<typeof formSchema>) {
    setOpenSubmitDialog(false);
    try {
      // Hiển thị loading khi bắt đầu xử lý
      const loadingToastId = toast.loading("Đang xử lý yêu cầu...", {
        duration: Infinity,
      });

      // Check mentor availability
      // const mentorCheck =
      //   await userService.checkMentorAndSubMentorSlotAvailability({
      //     mentorId: isStudent ? values.mentorId : user?.id,
      //     subMentorId: values.subMentorId,
      //   });

      // if (!mentorCheck.data) {
      //   toast.dismiss(loadingToastId);
      //   return toast.error(mentorCheck.message);
      // }

      let fileUrl = topic.fileUrl; // Giả sử nếu fileschema là string (URL cũ)

      // Chỉ upload file nếu fileschema là File object (file mới)
      if (values.fileschema instanceof File) {
        const fileUpload = await fileUploadService.uploadFile(
          values.fileschema,
          "Topic"
        );
        if (fileUpload.status != 1) {
          toast.dismiss(loadingToastId);
          return toast.error(fileUpload.message);
        }
        fileUrl = fileUpload.data;
      }

      const command: TopicUpdateCommand = {
        ...topic,
        ...values,
        subMentorId: undefined,
        specialtyId: values.specialtyId ?? undefined, // Ensure no null
        isEnterpriseTopic: isStudent
          ? false
          : values.isEnterpriseTopic ?? false,
        enterpriseName: isStudent
          ? undefined
          : values.enterpriseName ?? undefined,
        mentorId: isLecturer ? topic.mentorId : undefined,
        fileUrl: fileUrl,
        isExistedTeam: false,
      };

      // Create topic based on user role
      const res = await topicService.update(command);

      // Cập nhật trạng thái loading
      toast.dismiss(loadingToastId);

      if (res.status == 1) {
        toast.success(res.message);
        queryClient.refetchQueries({ queryKey: ["data"] });

        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  }

  async function handleSubmitToMentorConfirm() {
    setOpenMentorDialog(false);
    setIsSubmitting(true);
    try {
      const values = form.getValues();
      console.log(
        "check_values",
        isStudent ? values.mentorId ?? undefined : topic.mentorId
      );
      // Kiểm tra nếu là student và chưa chọn mentor
      if (isStudent && !values.mentorId) {
        setIsSubmitting(false);
        setOpenMentorDialog(true);
        return toast.error("Vui lòng chọn giảng viên hướng dẫn");
      }

      const loadingToastId = toast.loading("Đang gửi ý tưởng cho mentor...");

      // Check mentor availability
      const mentorCheck =
        await userService.checkMentorAndSubMentorSlotAvailability({
          mentorId: isStudent ? values.mentorId ?? undefined : topic.mentorId,
          subMentorId: values.subMentorId ?? undefined,
        });

      if (!mentorCheck.data) {
        toast.dismiss(loadingToastId);
        return toast.error(mentorCheck.message);
      }

      // Gọi API để nộp cho mentor
      const command: TopicStudentCreatePendingCommand = {
        ...topic,
        mentorId: values.mentorId ?? undefined,
        subMentorId: values.subMentorId ?? undefined,
      };

      // Create topic based on user role
      const res = await topicService.submitTopicToMentorByStudent(command);

      toast.dismiss(loadingToastId);

      if (res.status === 1) {
        toast.success(res.message);
        queryClient.refetchQueries({ queryKey: ["data"] });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => setOpenSubmitDialog(true))}
        className="space-y-8 p-1 md:p-6 flex justify-center"
      >
        {/* Dialog xác nhận cập nhật ý tưởng */}
        <Dialog open={openSubmitDialog} onOpenChange={setOpenSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Xác nhận cập nhật ý tưởng</span>
              </DialogTitle>
              <DialogDescription className="pt-2">
                Bạn có chắc chắn muốn cập nhật ý tưởng này không?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setOpenSubmitDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleSubmitConfirm(form.getValues())}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Chắc chắn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog xác nhận nộp cho mentor */}
        <Dialog open={openMentorDialog} onOpenChange={setOpenMentorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Xác nhận nộp ý tưởng</span>
              </DialogTitle>

              <DialogDescription className="pt-2">
                Bạn có chắc chắn muốn nộp ý tưởng này cho mentor không?
              </DialogDescription>
            </DialogHeader>

            {/* Mentor Selection - Only for Students */}
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

            {role == "Mentor" && (
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
            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setOpenMentorDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmitToMentorConfirm}
                className="gap-2"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? "Đang xử lý..." : "Chắc chắn"}
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
                onClick={() => setOpenMentorDialog(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Nộp cho Mentor"}
              </Button>
            )}
            <Button
              type="submit"
              variant={"outline"}
              className="border-primary text-primary"
              disabled={isSubmitting}
            >
              Cập nhật Ý tưởng
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
