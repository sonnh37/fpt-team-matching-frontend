"use client";
import { AlertMessage } from "@/components/_common/alert-message";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole, useCurrentSemester } from "@/hooks/use-current-role";
import { FormInput, FormSwitch } from "@/lib/form-custom-shadcn";
import { isActiveTopic } from "@/lib/utils";
import { fileUploadService } from "@/services/file-upload-service";
import { invitationService } from "@/services/invitation-service";
import { professionService } from "@/services/profession-service";
import { profilestudentService } from "@/services/profile-student-service";
import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { topicService } from "@/services/topic-service";
import { userService } from "@/services/user-service";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { SemesterStatus } from "@/types/enums/semester";
import { TeamMemberRole } from "@/types/enums/team-member";
import { TopicStatus, TopicType } from "@/types/enums/topic";
import { TopicCreateCommand } from "@/types/models/commands/topic/topic-create-command";
import { InvitationGetByStatudQuery } from "@/types/models/queries/invitations/invitation-get-by-status-query";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, FileArchive, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useState } from "react";
import { TopicApprovalStatus } from "@/app/(client)/(dashboard)/topic/idea-is-exist/page";
// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  englishName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Anh" })
    .min(2, { message: "Tên tiếng Anh phải có ít nhất 2 ký tự" }),

  // teamSize: z
  //   .number({
  //     required_error: "Vui lòng chọn số lượng thành viên",
  //     invalid_type_error: "Số lượng thành viên phải là số",
  //   })
  //   .gte(4, { message: "Số lượng thành viên tối thiểu là 4" }),

  abbreviation: z
    .string({ required_error: "Vui lòng nhập tên viết tắt" })
    .max(20, { message: "Tên viết tắt không được quá 20 ký tự" }),

  vietNameseName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Việt" })
    .min(2, { message: "Tên tiếng Việt phải có ít nhất 2 ký tự" }),

  description: z
    .string({ required_error: "Vui lòng nhập mô tả" })
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),

  fileschema: z
    .custom<File>((val) => val instanceof File, {
      message: "Vui lòng chọn tệp đính kèm",
    })
    .refine(
      (file) => {
        const fileName = file.name.toLowerCase();
        return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      },
      {
        message: "Chỉ chấp nhận tệp .doc, .docx hoặc .pdf",
      }
    ),

  specialtyId: z.string().optional(),

  mentorId: z
    .string({ required_error: "Vui lòng chọn giảng viên hướng dẫn" })
    .optional(),

  subMentorId: z.string().optional(),

  enterpriseName: z
    .string()
    .min(2, { message: "Tên doanh nghiệp phải có ít nhất 2 ký tự" })
    .optional(),

  isEnterpriseTopic: z.boolean().default(false),
});
export const CreateProjectForm = () => {
  const role = useCurrentRole();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogAction, setDialogAction] = useState<"submit" | "draft">(
    "submit"
  );
  const user = useSelectorUser();
  const { currentSemester, isLoading: isLoadingSemester } =
    useCurrentSemester();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const isEnterpriseTopic = form.watch("isEnterpriseTopic");

  // Check user role
  const isStudent = role == "Student";
  const isLecturer = role == "Mentor";

  // Fetch all necessary data in parallel
  const {
    data: result_project,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useQuery({
    queryKey: ["getProjectInfo"],
    queryFn: () => projectService.getProjectInfo(),
    enabled: !!isStudent, // Only fetch if student
    refetchOnWindowFocus: false,
  });

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: errorProfile,
  } = useQuery({
    queryKey: ["getProfileByCurrentUser"],
    queryFn: () => profilestudentService.getProfileByCurrentUser(),
    refetchOnWindowFocus: false,
  });

  const {
    data: professionsData,
    isLoading: isLoadingProfessions,
    error: errorProfessions,
  } = useQuery({
    queryKey: ["getAllProfessions"],
    queryFn: () => professionService.getAll(),
    refetchOnWindowFocus: false,
  });

  const {
    data: topicsData,
    isLoading: isLoadingTopics,
    error: errorTopics,
  } = useQuery({
    queryKey: ["getTopicByUser"],
    queryFn: () => topicService.getTopicByUser(),
    enabled: !!isStudent,
    refetchOnWindowFocus: false,
  });

  const query: UserGetAllQuery = {
    role: "Mentor",
    isPagination: false,
  };

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["getUsersByRole", query],
    queryFn: () => userService.getAll(query),
    refetchOnWindowFocus: false,
  });

  const query_invitations: InvitationGetByStatudQuery = {
    status: InvitationStatus.Pending,
    pageNumber: 1,
    pageSize: 100,
    isPagination: true,
  };

  const {
    data: invitationsData,
    isLoading: isLoadingInvitations,
    error: errorInvitations,
  } = useQuery({
    queryKey: ["getUserInvitationsByType", query_invitations],
    queryFn: () =>
      invitationService.getUserInvitationsStatus(query_invitations),
    enabled: !!isStudent, // Only fetch if student
    refetchOnWindowFocus: false,
  });

  const project = result_project?.data;
  const teamMembers = project?.teamMembers;

  const invitationPendings = invitationsData?.data?.results ?? [];
  const invitationPendingBySelfs = invitationPendings.filter(
    (invitation) => invitation.type == InvitationType.SentByStudent
  );
  const invitationPendingByTeams = invitationPendings.filter(
    (invitation) => invitation.type == InvitationType.SendByTeam
  );

  // Set form values when profile data is loaded
  useQuery({
    queryKey: ["setSpecialtyId"],
    queryFn: async () => {
      if (profileData?.data?.specialtyId) {
        form.setValue("specialtyId", profileData.data.specialtyId);
      }
      return null;
    },
    enabled: !!profileData?.data,
  });

  // Loading and error states
  const isLoading =
    isLoadingSemester ||
    isLoadingProject ||
    isLoadingProfile ||
    isLoadingProfessions ||
    isLoadingTopics ||
    isLoadingUsers ||
    isLoadingInvitations;

  const isError =
    // errorStage ||
    errorProject ||
    errorProfile ||
    errorProfessions ||
    errorTopics ||
    errorInvitations;

  if (!user) return null;
  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;

  if (!currentSemester) {
    return (
      <AlertMessage
        messageType="error"
        message="Không tìm thấy học kì hiện tại. Vui lòng chọn học kì trước khi tạo dự án."
      />
    );
  }

  switch (currentSemester.status) {
    case SemesterStatus.Closed:
      return (
        <AlertMessage
          messageType="error"
          message="Học kì đã kết thúc. Không thể tạo dự án mới."
        />
      );
    case SemesterStatus.OnGoing:
      return (
        <AlertMessage
          messageType="warning"
          message="Học kì đang diễn ra. Không thể tạo dự án mới vào lúc này."
        />
      );
    case SemesterStatus.NotStarted:
      return (
        <AlertMessage
          messageType="info"
          message="Học kì chưa bắt đầu. Vui lòng đợi đến giai đoạn chuẩn bị để tạo dự án."
        />
      );
  }

  // Student-specific checks

  if (isStudent) {
    if (project) {
      const isProjectNoTopic = !project?.topicId;
      const isLeaderProject = project?.teamMembers.some(
        (m) => m.userId == user.id && m.role == TeamMemberRole.Leader
      );

      if (!isProjectNoTopic) {
        return <AlertMessage message="Bạn đã có đề tài." messageType="error" />;
      }

      if (!isLeaderProject) {
        return (
          <AlertMessage message="Bạn đang trong dự án." messageType="error" />
        );
      }
    } else {
      const messages = [];
      if (invitationPendingByTeams.length > 0) {
        messages.push(
          `Bạn có lời mời đang chờ cho ${invitationPendingByTeams.length} nhóm`
        );
      }
      if (invitationPendingBySelfs.length > 0) {
        messages.push(
          `Bạn có ${invitationPendingBySelfs.length} lời mời đang chờ xử lý`
        );
      }

      if (messages.length > 0) {
        return (
          <AlertMessage message={messages.join(". ")} messageType="error" />
        );
      }

      return <AlertMessage message="Bạn chưa tạo team." messageType="error" />;
    }
  }

  const activeTopic = topicsData?.data?.find(
    (t) =>
      t.status === TopicStatus.ManagerApproved &&
      t.project?.id &&
      t.isExistedTeam
  );

  if (activeTopic && isStudent) {
    return <TopicApprovalStatus topic={activeTopic} isStudent={isStudent} />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // Hiển thị loading khi bắt đầu xử lý

      // Check mentor availability
      const mentorCheck =
        await userService.checkMentorAndSubMentorSlotAvailability({
          mentorId: isStudent ? values.mentorId : user?.id,
          subMentorId: values.subMentorId,
        });

      if (!mentorCheck.data) {
        return toast.error(mentorCheck.message);
      }

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Topic"
      );
      if (fileUpload.status != 1) {
        return toast.error(fileUpload.message);
      }

      // Create topic based on user role
      const command: TopicCreateCommand = {
        ...values,
        isEnterpriseTopic: isStudent ? false : values.isEnterpriseTopic,
        enterpriseName: isStudent ? undefined : values.enterpriseName,
        mentorId: isLecturer ? undefined : values.mentorId,
        fileUrl: fileUpload.data,
        isExistedTeam: false,
        semesterId: currentSemester?.id,
      };

      const res = isStudent
        ? await topicService.submitTopicToMentorByStudent(command)
        : await topicService.submitTopicOfLecturerByLecturer(command);

      if (res.status == 1) {
        toast.success(res.message, {
          action: {
            label: "Xem danh sách",
            onClick: () => router.push("/topic/request?tab=pending"),
          },
        });
        setTimeout(() => router.push("/topic/request?tab=pending"), 2000);
        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateDraft() {
    const values = form.getValues();
    setIsSubmitting(true);
    try {
      // Hiển thị loading khi bắt đầu xử lý

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Topic"
      );
      if (fileUpload.status != 1) {
        return toast.error(fileUpload.message);
      }

      // Create daft based on user role
      const commandStudent: TopicCreateCommand = {
        ...values,
        isEnterpriseTopic: isStudent ? false : values.isEnterpriseTopic,
        enterpriseName: isStudent ? undefined : values.enterpriseName,
        mentorId: isLecturer ? undefined : values.mentorId,
        fileUrl: fileUpload.data,
        status: TopicStatus.Draft,
        type: TopicType.Student,
        semesterId: currentSemester?.id,
        ownerId: user?.id,
        isExistedTeam: false,
      };

      const commandLecture: TopicCreateCommand = {
        ...values,
        isEnterpriseTopic: isStudent ? false : values.isEnterpriseTopic,
        enterpriseName: isStudent ? undefined : values.enterpriseName,
        mentorId: isLecturer ? undefined : values.mentorId,
        fileUrl: fileUpload.data,
        status: TopicStatus.Draft,
        type: TopicType.Lecturer,
        semesterId: currentSemester?.id,
        ownerId: user?.id,
        isExistedTeam: false,
      };
      const res = isStudent
        ? await topicService.create(commandStudent)
        : await topicService.create(commandLecture);

      // Cập nhật trạng thái loading

      if (res.status == 1) {
        toast.success(res.message, {
          action: {
            label: "Xem danh sách",
            onClick: () => router.push("/topic/request?tab=draft"),
          },
        });
        setTimeout(() => router.push("/topic/request?tab=draft"), 2000);
        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>Xác nhận gửi ý tưởng</span>
            </DialogTitle>
            <DialogDescription className="pt-2">
              Bạn có chắc chắn muốn gửi ý tưởng này không?
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
                  await onSubmit(form.getValues());
                } else {
                  await handleCreateDraft();
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
      <Form {...form}>
        <form className="space-y-8 p-1 md:p-6 flex justify-center">
          <Card className="w-full max-w-4xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold tracking-tight">
                Tạo ý tưởng mới
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Điền đầy đủ thông tin bên dưới để đăng ký ý tưởng dự án. Tất cả
                các trường đều bắt buộc trừ khi có ghi chú khác.
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

              {/* Profession & Specialty Section */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Thông tin Học thuật</h3>

                {!profileData?.data?.specialtyId ? (
                  <div className="space-y-2 rounded-md bg-destructive/10 p-4">
                    <Label className="text-sm font-medium">
                      Yêu cầu cập nhật Ngành và Chuyên ngành
                    </Label>
                    <p className="text-sm text-destructive">
                      * Vui lòng cập nhật{" "}
                      <Button
                        variant="link"
                        className="p-0 text-sm text-destructive hover:text-destructive h-auto"
                        asChild
                      >
                        <Link href="/settings">cài đặt</Link>
                      </Button>{" "}
                      với thông tin Ngành và Chuyên ngành của bạn trước khi tiếp
                      tục.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Ngành học</FormLabel>
                      <Select
                        value={profileData.data.specialty?.professionId}
                        disabled
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn ngành học" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionsData?.data?.results?.map((pro) => (
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
                          <FormLabel>Chuyên ngành</FormLabel>
                          <Select value={field.value} disabled>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                            <SelectContent>
                              {professionsData?.data?.results
                                ?.find(
                                  (p) =>
                                    p.id ===
                                    profileData?.data?.specialty?.professionId
                                )
                                ?.specialties?.map((spec) => (
                                  <SelectItem key={spec.id} value={spec.id!}>
                                    {spec.specialtyName}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Enterprise Name (conditionally shown) */}
              {isEnterpriseTopic && (
                <div className="space-y-4 rounded-lg border p-4">
                  <FormInput
                    form={form}
                    name="enterpriseName"
                    label="Tên Doanh nghiệp"
                    placeholder="Nhập tên doanh nghiệp tài trợ"
                    description="Tên công ty tài trợ cho dự án này"
                  />
                </div>
              )}

              {/* Topic Details Section */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Chi tiết Ý tưởng</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="englishName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tiếng Anh</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tên dự án bằng tiếng Anh"
                            {...field}
                            className="dark:bg-muted/50"
                          />
                        </FormControl>
                        <FormDescription>
                          Tên chính thức của dự án
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vietNameseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tiếng Việt</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tên dự án bằng tiếng Việt"
                            {...field}
                            className="dark:bg-muted/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="abbreviation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Viết tắt</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên viết tắt của dự án"
                          {...field}
                          className="dark:bg-muted/50"
                        />
                      </FormControl>
                      <FormDescription>Tối đa 20 ký tự</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả chi tiết về dự án của bạn..."
                          {...field}
                          className="min-h-[120px] dark:bg-muted/50"
                        />
                      </FormControl>
                      <FormDescription>Tối thiểu 10 ký tự</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Team & File Section */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Nhóm & Tài liệu</h3>

                {/* <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng thành viên</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn số lượng thành viên" />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5].map((option) => (
                          <SelectItem key={option} value={option.toString()}>
                            {option} thành viên
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Bao gồm cả bạn với vai trò trưởng nhóm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                            value={field.value}
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
                            <FormLabel>
                              Giảng viên hướng dẫn 2 (Tùy chọn)
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
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
                            value={field.value}
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
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }
                            className="dark:bg-muted/50"
                            accept={ALLOWED_EXTENSIONS.join(",")}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Định dạng chấp nhận: {ALLOWED_EXTENSIONS.join(", ")}{" "}
                        (tối đa 10MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Current User Info - Only for Students */}
              {isStudent && (
                <div className="rounded-lg border p-4 space-y-2">
                  <h3 className="text-lg font-medium">Thành viên Nhóm</h3>
                  <p className="text-sm text-muted-foreground">
                    Bạn sẽ là trưởng nhóm của dự án này
                  </p>
                  {(teamMembers?.length ?? 0) > 0 ? (
                    <>
                      {teamMembers?.map((member) => {
                        const userInTeam = member.user;
                        if (!userInTeam) return null;
                        return (
                          <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {userInTeam.email}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {userInTeam.lastName} {userInTeam.firstName}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {TeamMemberRole[member.role ?? 0]}
                            </span>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{user.email}</span>
                          <span className="text-xs text-muted-foreground">
                            {user.lastName} {user.firstName}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Trưởng nhóm
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                variant={"outline"}
                type="button"
                onClick={() => {
                  setDialogAction("draft");
                  setIsConfirmDialogOpen(true);
                }}
                disabled={isSubmitting}
                className="gap-2"
              >
                <FileArchive className="h-4 w-4" /> {/* Icon cho bản nháp */}
                Tạo bản nháp
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setDialogAction("submit");
                  setIsConfirmDialogOpen(true);
                }}
                disabled={isSubmitting}
                className="gap-2 border-primary text-primary hover:text-primary"
              >
                <Send className="h-4 w-4" /> {/* Icon cho nộp ý tưởng */}
                Nộp ý tưởng
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
