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
import { TopicResubmitForMentorByStudentCommand, TopicSubmitForMentorByStudentCommand } from "@/types/models/commands/topic/topic-student-create-pending-command";
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
  specialtyId: z.string().optional().nullable(),
  fileschema: z.any().optional().nullable(),
});

interface TopicUpdateFormProps {
  topic: Topic;
  onSuccess?: () => void;
}

export function TopicResubmitUpdateForm({ topic, onSuccess }: TopicUpdateFormProps) {
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

  const skipCheckAndSelectUI = isStudent ? topic.mentorId != undefined : topic.subMentorId != undefined;
  console.log("check_skip", skipCheckAndSelectUI)
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
      specialtyId: topic.specialtyId,
    },
  });

  async function handleSubmitConfirm(values: z.infer<typeof formSchema>) {
    setOpenSubmitDialog(false);
    try {
      // Hiển thị loading khi bắt đầu xử lý
      const loadingToastId = toast.loading("Đang xử lý yêu cầu...", {
        duration: Infinity,
      });

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
        fileUrl: fileUrl,
        isExistedTeam: false,
      };

      // Create topic based on user role
      const res = await topicService.update(command);

      // Cập nhật trạng thái loading
      toast.dismiss(loadingToastId);

      if (res.status == 1) {
        toast.success(res.message);
        onSuccess?.();
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
      const loadingToastId = toast.loading("Đang gửi ý tưởng cho mentor...");

      const command: TopicResubmitForMentorByStudentCommand = {
        ...topic,
      };

      // Create topic based on user role
      const res = await topicService.resubmitTopicToMentorByStudent(command);

      toast.dismiss(loadingToastId);

      if (res.status === 1) {
        toast.success(res.message);
        onSuccess?.();
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
                {isSubmitting ? "Đang xử lý..." : "Nộp lại cho Mentor"}
              </Button>
            )}
            <Button
              type="submit"
              variant={"outline"}
              className="border-primary text-primary hover:text-primary"
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
