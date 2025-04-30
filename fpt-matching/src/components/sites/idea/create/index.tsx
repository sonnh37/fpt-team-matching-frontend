"use client";
import { useState, useEffect } from "react";
import { boolean, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IdeaCreateCommand } from "@/types/models/commands/idea/idea-create-command";
import { ideaService } from "@/services/idea-service";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { useRouter } from "next/navigation";
import { LoadingComponent } from "@/components/_common/loading-page";
import { resolve } from "path";
import { projectService } from "@/services/project-service";
import { IdeaStatus } from "@/types/enums/idea";
import { Profession } from "@/types/profession";
import { professionService } from "@/services/profession-service";
import { profilestudentService } from "@/services/profile-student-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorSystem from "@/components/_common/errors/error-system";
import { Label } from "@/components/ui/label";
import { TypographyP } from "@/components/_common/typography/typography-p";
import {
  FormInput,
  FormSelectObject,
  FormSwitch,
} from "@/lib/form-custom-shadcn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelectorUser } from "@/hooks/use-auth";
import { semesterService } from "@/services/semester-service";
import { stageideaService } from "@/services/stage-idea-service";
import { NoTeam } from "@/components/sites/team/no-team";
import { HasTeam } from "@/components/sites/team/has-team";
import { InvitationGetByTypeQuery } from "@/types/models/queries/invitations/invitation-get-by-type-query";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { invitationService } from "@/services/invitation-service";
import { InvitationGetByStatudQuery } from "@/types/models/queries/invitations/invitation-get-by-status-query";
import { AlertMessage } from "@/components/_common/alert-message";
import PageIsIdea from "@/app/(client)/(dashboard)/idea/idea-is-exist/page";
import { TeamMemberRole } from "@/types/enums/team-member";
import Link from "next/link";
import { fileUploadService } from "@/services/file-upload-service";
import { UserCheckMentorAndSubMentorQuery } from "@/types/models/queries/users/user-check-mentor-and-submentor-query";
// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  englishName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Anh" })
    .min(2, { message: "Tên tiếng Anh phải có ít nhất 2 ký tự" }),

  teamSize: z
    .number({
      required_error: "Vui lòng chọn số lượng thành viên",
      invalid_type_error: "Số lượng thành viên phải là số",
    })
    .gte(4, { message: "Số lượng thành viên tối thiểu là 4" }),

  abbreviations: z
    .string({ required_error: "Vui lòng nhập tên viết tắt" })
    .max(20, { message: "Tên viết tắt không được quá 20 ký tự" }),

  vietNamName: z
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

  mentorId: z.string({ required_error: "Vui lòng chọn giảng viên hướng dẫn" }),

  subMentorId: z.string().optional(),

  enterpriseName: z
    .string()
    .min(2, { message: "Tên doanh nghiệp phải có ít nhất 2 ký tự" })
    .optional(),

  isEnterpriseTopic: z.boolean().default(false),
});
export const CreateProjectForm = () => {
  const user = useSelectorUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamSize: 4,
    },
  });

  const isEnterpriseIdea = form.watch("isEnterpriseTopic");

  // Check user role
  const isStudent = user?.userXRoles.some(
    (m) => m.role?.roleName === "Student"
  );
  const isLecturer = user?.userXRoles.some(
    (m) => m.role?.roleName === "Lecturer"
  );

  // Fetch all necessary data in parallel
  const {
    data: res_stage,
    isLoading: isLoadingStage,
    error: errorStage,
  } = useQuery({
    queryKey: ["getBeforeSemester"],
    queryFn: () => semesterService.getBeforeSemester(),
    refetchOnWindowFocus: false,
  });

  const {
    data: resStage,
    isLoading: isLoadingCurrentStage,
    error: errorCurrentStage,
  } = useQuery({
    queryKey: ["getCurrentStageIdea"],
    queryFn: () => stageideaService.getCurrentStageIdea(),
    refetchOnWindowFocus: false,
  });

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
    enabled: !!isStudent, // Only fetch if student
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
    data: ideasData,
    isLoading: isLoadingIdeas,
    error: errorIdeas,
  } = useQuery({
    queryKey: ["getIdeaByUser"],
    queryFn: () => ideaService.getIdeaByUser(),
    enabled: !!isStudent, // Only fetch if student
    refetchOnWindowFocus: false,
  });

  const {
    data: currentSemesterData,
    isLoading: isLoadingCurrentSemester,
    error: errorCurrentSemester,
  } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
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

  // Derived state
  const isLockStageIdea = !resStage?.data;
  const isLock = res_stage?.data?.endDate
    ? new Date() <= new Date(res_stage.data.endDate)
    : false;

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

  // Check for active ideas
  const { data: hasActiveIdeas } = useQuery({
    queryKey: ["checkActiveIdeas"],
    queryFn: async () => {
      if (!ideasData?.data || !currentSemesterData?.data) return false;

      const ideasCurrentSemester = ideasData.data.filter((m) =>
        m.ideaVersions.some(
          (iv) => iv.stageIdea?.semesterId === currentSemesterData.data?.id
        )
      );

      return ideasCurrentSemester.some((m) => m.status !== IdeaStatus.Rejected);
    },
    enabled: !!ideasData?.data && !!currentSemesterData?.data,
    refetchOnWindowFocus: false,
  });

  // Loading and error states
  const isLoading =
    isLoadingStage ||
    isLoadingCurrentStage ||
    isLoadingProject ||
    isLoadingProfile ||
    isLoadingProfessions ||
    isLoadingIdeas ||
    isLoadingCurrentSemester ||
    isLoadingUsers ||
    isLoadingInvitations;

  console.log(
    "check_error",
    errorStage ||
      errorCurrentStage ||
      errorProject ||
      errorProfile ||
      errorProfessions ||
      errorIdeas ||
      errorCurrentSemester ||
      errorInvitations
  );

  const isError =
    errorStage ||
    errorCurrentStage ||
    errorProject ||
    errorProfile ||
    errorProfessions ||
    errorIdeas ||
    errorCurrentSemester ||
    errorInvitations;

  if (!user) return null;
  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;

  // Student-specific checks
  if (isStudent) {
    if (project) {
      const isProjectNoIdea = !project?.topicId;
      const isLeaderProject = project?.teamMembers.some(
        (m) => m.userId == user.id && m.role == TeamMemberRole.Leader
      );

      if (!isProjectNoIdea) {
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

  if (hasActiveIdeas && isStudent) return <PageIsIdea />;
  if (isLock) return <AlertMessage message="Chưa kết thúc kì hiện tại!" />;
  if (isLockStageIdea) return <AlertMessage message="Chưa tới đợt!" />;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Check mentor availability
      const mentorCheck =
        await userService.checkMentorAndSubMentorSlotAvailability({
          mentorId: values.mentorId,
          subMentorId: values.subMentorId,
        });

      if (!mentorCheck.data) {
        return toast.error(mentorCheck.message);
      }

      // Upload file
      const fileUpload = await fileUploadService.uploadFile(
        values.fileschema,
        "Idea"
      );
      if (fileUpload.status != 1) return toast.error(fileUpload.message);

      // Create idea based on user role
      const command: IdeaCreateCommand = {
        ...values,
        isEnterpriseTopic: isStudent ? false : values.isEnterpriseTopic,
        enterpriseName: isStudent ? undefined : values.enterpriseName,
        mentorId: isLecturer ? undefined : values.mentorId,
        file: fileUpload.data,
      };

      const res = isStudent
        ? await ideaService.createIdeaByStudent(command)
        : await ideaService.createIdeaByLecturer(command);

      if (res.status == 1) {
        toast.success(res.message);
        setTimeout(() => router.push("/ideas"), 2000);
        return;
      }

      toast.error(res.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-1 md:p-6 flex justify-center"
      >
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
            {isEnterpriseIdea && (
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

            {/* Idea Details Section */}
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
                  name="vietNamName"
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
                name="abbreviations"
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

              <FormField
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
                        {[4, 5, 6].map((option) => (
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
              />

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
                          <FormLabel>Giảng viên hướng dẫn 2</FormLabel>
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
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="dark:bg-muted/50"
                          accept={ALLOWED_EXTENSIONS.join(",")}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Định dạng chấp nhận: {ALLOWED_EXTENSIONS.join(", ")} (tối
                      đa 10MB)
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

          <CardFooter className="flex justify-end">
            <Button type="submit" className="w-full md:w-auto">
              Gửi Ý tưởng
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
