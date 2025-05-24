"use client";
import { TopicApprovalStatus } from "@/app/(client)/(dashboard)/topic/idea-is-exist/page";
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
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  englishName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Anh" })
    .min(2, { message: "Tên tiếng Anh phải có ít nhất 2 ký tự" }),

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
const steps = [
  { id: "info", title: "Thông tin cơ bản" },
  { id: "mentor", title: "Giảng viên hướng dẫn" },
  { id: "document", title: "Tài liệu đính kèm" },
  { id: "review", title: "Xem lại và gửi" },
];

export const CreateProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"submit" | "draft">("submit");
  const role = useCurrentRole();
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
    }
  }

  const activeTopic =
    topicsData?.data?.find(
      (t) =>
        t.status === TopicStatus.ManagerApproved &&
        t.project?.id && 
        t.isExistedTeam
    ) ??
    topicsData?.data?.find(
      (t) =>
        t.status &&
        ![
          TopicStatus.Draft,
          TopicStatus.ManagerRejected,
          TopicStatus.MentorRejected,
        ].includes(t.status)
    );

  console.log("check_active topic", activeTopic);

  if (activeTopic && isStudent) {
    return <TopicApprovalStatus topic={activeTopic} isStudent={isStudent} />;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Hiển thị confirm dialog trước khi submit
    const confirmSubmit = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <Card className="w-[380px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Xác nhận gửi ý tưởng</span>
              </CardTitle>
              <CardDescription className="pt-2">
                Bạn có chắc chắn muốn gửi ý tưởng này không?
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t);
                }}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Chắc chắn
              </Button>
            </CardFooter>
          </Card>
        ),
        {
          duration: Infinity, // Không tự động đóng
        }
      );
    });

    if (!confirmSubmit) return;

    try {
      // Hiển thị loading khi bắt đầu xử lý
      const loadingToastId = toast.loading("Đang xử lý yêu cầu...", {
        duration: Infinity,
      });

      // Check mentor availability
      const mentorCheck =
        await userService.checkMentorAndSubMentorSlotAvailability({
          mentorId: isStudent ? values.mentorId : user?.id,
          subMentorId: values.subMentorId,
        });

      if (!mentorCheck.data) {
        toast.dismiss(loadingToastId);
        return toast.error(mentorCheck.message);
      }

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Topic"
      );
      if (fileUpload.status != 1) {
        toast.dismiss(loadingToastId);
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

      // Cập nhật trạng thái loading
      toast.dismiss(loadingToastId);

      if (res.status == 1) {
        toast.success(res.message, {
          action: {
            label: "Xem danh sách",
            onClick: () => router.push("/topic/request"),
          },
        });
        setTimeout(() => router.push("/topic/request"), 2000);
        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  }

  async function handleCreateDraft() {
    const values = form.getValues();
    // Hiển thị confirm dialog trước khi submit
    const confirmSubmit = await new Promise((resolve) => {
      toast.custom(
        (t) => (
          <Card className="w-[380px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Xác nhận tạo bản nháp ý tưởng</span>
              </CardTitle>
              <CardDescription className="pt-2">
                Bạn có chắc chắn muốn tạo bản nháp này không?
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  resolve(false);
                  toast.dismiss(t);
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  resolve(true);
                  toast.dismiss(t);
                }}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Chắc chắn
              </Button>
            </CardFooter>
          </Card>
        ),
        {
          duration: Infinity, // Không tự động đóng
        }
      );
    });

    if (!confirmSubmit) return;

    try {
      // Hiển thị loading khi bắt đầu xử lý
      const loadingToastId = toast.loading("Đang xử lý yêu cầu...", {
        duration: Infinity,
      });

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Topic"
      );
      if (fileUpload.status != 1) {
        toast.dismiss(loadingToastId);
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
      toast.dismiss(loadingToastId);

      if (res.status == 1) {
        toast.success(res.message, {
          action: {
            label: "Xem danh sách",
            onClick: () => router.push("/topic/create?tab=drafts"),
          },
        });
        setTimeout(() => router.push("/topic/create?tab=drafts"), 2000);
        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    }
  }

  const handleNext = async () => {
    // Validate từng bước
    const fieldsToValidate =
      {
        0: ["englishName", "vietNameseName", "abbreviation", "description"],
        1: isStudent ? ["mentorId"] : [],
        2: ["fileschema"],
      }[currentStep] || [];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleAction = (type: "submit" | "draft") => {
    setActionType(type);
    setIsConfirmDialogOpen(true);
  };

  const executeAction = async () => {
    setIsConfirmDialogOpen(false);
    setIsSubmitting(true);

    try {
      const values = form.getValues();
      const isDraft = actionType === "draft";

      if (!isDraft) {
        const mentorCheck =
          await userService.checkMentorAndSubMentorSlotAvailability({
            mentorId: isStudent ? values.mentorId : user?.id,
            subMentorId: values.subMentorId,
          });

        if (mentorCheck.status != 1) {
          throw new Error(mentorCheck.message);
        }
      }

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Topic"
      );
      if (fileUpload.status != 1) {
        throw new Error(fileUpload.message);
      }

      // Prepare command
      const command: TopicCreateCommand = {
        ...values,
        isEnterpriseTopic: isStudent ? false : values.isEnterpriseTopic,
        enterpriseName: isStudent ? undefined : values.enterpriseName,
        mentorId: isLecturer ? undefined : values.mentorId,
        fileUrl: fileUpload.data,
        type: isStudent ? TopicType.Student : TopicType.Lecturer,
        status: isDraft
          ? TopicStatus.Draft
          : isStudent
          ? TopicStatus.MentorPending
          : TopicStatus.ManagerPending,
        semesterId: currentSemester?.id,
        ownerId: user?.id,
        isExistedTeam: false,
      };

      const res = isDraft
        ? await topicService.create(command)
        : isStudent
        ? await topicService.submitTopicToMentorByStudent(command)
        : await topicService.submitTopicOfLecturerByLecturer(command);

      if (res.status == 1) {
        toast.success(res.message, {
          action: {
            label: "Xem danh sách",
            onClick: () =>
              router.push(
                isDraft ? "/topic/create?tab=drafts" : "/topic/request"
              ),
          },
        });
        router.push(isDraft ? "/topic/create?tab=drafts" : "/topic/request");
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8 p-1 md:p-6 flex justify-center">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Tạo đề tài mới
            </CardTitle>
            <div className="flex justify-center my-4">
              <div className="flex items-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      className={`rounded-full h-10 w-10 p-0 ${
                        index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : index < currentStep
                          ? "bg-green-500 text-white"
                          : "bg-muted"
                      } ${
                        index > currentStep
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={() => {
                        // Chỉ cho phép chọn các bước đã hoàn thành hoặc bước hiện tại
                        if (index <= currentStep) {
                          setCurrentStep(index);
                        }
                      }}
                      disabled={index > currentStep} // Vô hiệu hóa nút cho các bước chưa hoàn thành
                    >
                      {index < currentStep ? <Check size={16} /> : index + 1}
                    </Button>
                    {index < steps.length - 1 && (
                      <div className="h-1 w-8 bg-muted"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <CardDescription>{steps[currentStep].title}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <>
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
                        với thông tin Ngành và Chuyên ngành của bạn trước khi
                        tiếp tục.
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
              </>
            )}

            {currentStep === 1 && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Giảng viên hướng dẫn</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isStudent
                    ? "Chọn giảng viên sẽ hướng dẫn dự án của bạn"
                    : "Thêm giảng viên đồng hướng dẫn (nếu có)"}
                </p>

                {isStudent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="mentorId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Giảng viên hướng dẫn</FormLabel>
                            {field.value && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="text-destructive h-auto p-0"
                                onClick={() =>
                                  form.setValue("mentorId", undefined)
                                }
                              >
                                Xóa lựa chọn
                              </Button>
                            )}
                          </div>
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
                            <div className="flex justify-between items-center">
                              <FormLabel>
                                Giảng viên hướng dẫn 2 (Tùy chọn)
                              </FormLabel>
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="link"
                                  size="sm"
                                  className="text-destructive h-auto p-0"
                                  onClick={() =>
                                    form.setValue("subMentorId", undefined)
                                  }
                                >
                                  Xóa lựa chọn
                                </Button>
                              )}
                            </div>
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
                              {!mentorId
                                ? "Vui lòng chọn giảng viên chính trước"
                                : "Chọn giảng viên sẽ hướng dẫn dự án của bạn"}
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
                          <div className="flex justify-between items-center">
                            <FormLabel>Giảng viên 2 (Tùy chọn)</FormLabel>
                            {field.value && (
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="text-destructive h-auto p-0"
                                onClick={() =>
                                  form.setValue("subMentorId", undefined)
                                }
                              >
                                Xóa lựa chọn
                              </Button>
                            )}
                          </div>
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

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Bạn có thể bỏ qua bước này
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Nếu chưa chọn được giảng viên, bạn có thể tạo bản nháp
                        và cập nhật sau, ngược lại bạn không thể tạo bản nháp vì
                        đã chọn giảng viên. Tuy nhiên, bạn cần chọn giảng viên
                        trước khi nộp chính thức.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Tài liệu đính kèm</h3>

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
            )}

            {/* Current User Info - Only for Students */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Thông tin đề tài</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tên tiếng Anh
                      </p>
                      <p>{form.watch("englishName")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tên tiếng Việt
                      </p>
                      <p>{form.watch("vietNameseName")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tên viết tắt
                      </p>
                      <p>{form.watch("abbreviation")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mô tả</p>
                      <p className="whitespace-pre-line">
                        {form.watch("description")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Giảng viên hướng dẫn</h3>
                  {form.watch("mentorId") ? (
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {
                          usersData?.data?.results?.find(
                            (u) => u.id === form.watch("mentorId")
                          )?.email
                        }
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa chọn giảng viên
                    </p>
                  )}
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-medium">Tài liệu đính kèm</h3>
                  <p>{form.watch("fileschema")?.name || "Chưa có tệp"}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              type="button"
              disabled={currentStep === 0 || isSubmitting}
            >
              <ChevronLeft className="h-4 w-4" /> Quay lại
            </Button>

            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Tiếp tục <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => handleAction("draft")}
                    disabled={
                      isSubmitting ||
                      (isStudent && Boolean(form.watch("mentorId"))) ||
                      (isLecturer && Boolean(form.watch("subMentorId")))
                    }
                  >
                    {isSubmitting ? "Đang xử lý..." : "Lưu bản nháp"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleAction("submit")}
                    disabled={
                      isSubmitting || (isStudent && !form.watch("mentorId"))
                    }
                  >
                    {isSubmitting ? "Đang xử lý..." : "Gửi đề tài"}
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span>
                {actionType === "submit"
                  ? "Xác nhận gửi đề tài"
                  : "Xác nhận tạo bản nháp"}
              </span>
            </DialogTitle>
            <DialogDescription className="pt-4">
              {actionType === "submit" ? (
                <>
                  <p className="font-medium mb-2">
                    Bạn sắp gửi đề tài với thông tin sau:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li className="font-medium">
                      Tên đề tài:{" "}
                      <span className="font-normal">
                        {form.watch("englishName")}
                      </span>
                    </li>
                    <li className="font-medium">
                      Giảng viên hướng dẫn:{" "}
                      <span className="font-normal">
                        {form.watch("mentorId")
                          ? usersData?.data?.results?.find(
                              (u) => u.id === form.watch("mentorId")
                            )?.email
                          : "Chưa chọn"}
                      </span>
                    </li>
                    {form.watch("subMentorId") && (
                      <li className="font-medium">
                        Giảng viên đồng hướng dẫn:{" "}
                        <span className="font-normal">
                          {
                            usersData?.data?.results?.find(
                              (u) => u.id === form.watch("subMentorId")
                            )?.email
                          }
                        </span>
                      </li>
                    )}
                    <li className="text-yellow-600 font-medium">
                      ⚠️ Lưu ý quan trọng: Khi nộp chính thức, đề tài sẽ thuộc
                      quyền quản lý của giảng viên hướng dẫn. Bạn sẽ không thể
                      chỉnh sửa thông tin đề tài sau khi nộp.
                    </li>
                  </ul>
                  <p className="mt-3 text-yellow-600">
                    Sau khi gửi, bạn không thể chỉnh sửa thông tin đề tài.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium mb-2">
                    Bạn sắp tạo bản nháp với thông tin sau:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tên đề tài: {form.watch("englishName")}</li>
                    {form.watch("mentorId") && (
                      <li>
                        Giảng viên:{" "}
                        {
                          usersData?.data?.results?.find(
                            (u) => u.id === form.watch("mentorId")
                          )?.email
                        }
                      </li>
                    )}
                    {form.watch("subMentorId") && (
                      <li className="font-medium">
                        Giảng viên đồng hướng dẫn:{" "}
                        <span className="font-normal">
                          {
                            usersData?.data?.results?.find(
                              (u) => u.id === form.watch("subMentorId")
                            )?.email
                          }
                        </span>
                      </li>
                    )}
                  </ul>
                  <p className="mt-3 text-yellow-600">
                    Bạn có thể tiếp tục chỉnh sửa bản nháp sau này.
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Hủy bỏ
            </Button>
            <Button onClick={executeAction} disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Form>
  );
};
