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
// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  //  inviteEmail: z.string().email({ message: "Invalid email format." }),
  englishName: z
    .string()
    .min(2, { message: "English Title must be at least 2 characters." }),
  maxTeamSize: z
    .number({ invalid_type_error: "Team size must be a number." })
    .gte(4, { message: "Team size must be at least 4." }),
  abbreviations: z
    .string()
    .max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietNamName: z
    .string()
    .min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  fileschema: z
    .custom<File>((val) => val instanceof File) // Xác định đây là kiểu File
    .refine(
      (file) => {
        const fileName = file.name.toLowerCase();
        return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      },
      {
        message: "File must be .doc, .docx, or .pdf",
      }
    ),
  specialtyId: z.string().optional(),
  enterpriseName: z
    .string()
    .min(2, { message: "Enterprise name must be at least 2 characters." })
    .optional(),
  isEnterpriseTopic: z.boolean().default(false),
});

export const CreateProjectForm = () => {
  const user = useSelectorUser();
  if (!user) return;
  const isStudent = user?.userXRoles.some((m) => m.role?.roleName == "Student");
  const isLecturer = user?.userXRoles.some(
    (m) => m.role?.roleName == "Lecturer"
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isNotUpdateSettingYet, setIsNotUpdateSettingYet] = useState(false);
  const [showPageIsIdea, setShowPageIsIdea] = useState(false);
  const router = useRouter();
  const query: UserGetAllQuery = {
    role: "Lecturer",
    isPagination: false,
  };

  const query_invitations: InvitationGetByStatudQuery = {
    status: InvitationStatus.Pending,
    pageNumber: 1,
    pageSize: 100,
    isPagination: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxTeamSize: 4,
    },
  });

  const isEnterpriseIdea = form.watch("isEnterpriseTopic");

  const {
    data: result_project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getProjectInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  const project = result_project?.data;

  const {
    data: result_invitations,
    isLoading: isLoadingInvitations,
    isError: isErrorInvitations,
    error: error_invitations,
  } = useQuery({
    queryKey: ["getUserInvitationsByType", query_invitations],
    queryFn: async () =>
      await invitationService.getUserInvitationsStatus(query_invitations),
    refetchOnWindowFocus: false,
  });

  const invitationPendings = result_invitations?.data?.results ?? [];

  const { data: result } = useQuery({
    queryKey: ["getUsersByRole", query],
    queryFn: () => userService.fetchAll(query),
    refetchOnWindowFocus: false,
  });

  const users = result?.data?.results ?? [];

  useEffect(() => {
    if (users.length > 0 && users[0].id !== undefined) {
      setSelectedUserId(users[0].id);
    }
  }, [users]);

  useEffect(() => {
    async function checkIdea() {
      try {
        const [profileRes, professionsRes] = await Promise.all([
          profilestudentService.fetchProfileByCurrentUser(),
          professionService.fetchAll(),
        ]);
        setProfessions(professionsRes.data?.results ?? []);

        form.setValue("specialtyId", profileRes.data?.specialtyId);

        const profess = professionsRes.data?.results?.find(
          (m) => m.id === profileRes.data?.specialty?.professionId
        );
        if (!profess) {
          setIsNotUpdateSettingYet(true);
        }
        setSelectedProfession(profess ?? null);

        // Lấy tất cả idea các kì của user đã tạo
        const ideaExists = await ideaService.getIdeaByUser();
        //check xem user co idea nao dang pending or Done khong
        const isPendingOrDone = ideaExists.data?.some(
          (m) =>
            m.status === IdeaStatus.Pending || m.status === IdeaStatus.Approved
        );

        if (isPendingOrDone) {
          if (isStudent) {
            setShowPageIsIdea(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkIdea();
  }, []);

  if (!user) return null;
  if (isLoadingProject || isLoadingInvitations || isLoading)
    return <LoadingComponent />;
  if (isErrorProject || isErrorInvitations || isLoading) return <ErrorSystem />;

  if (isStudent) {
    // * project is existed
    if (project) {
      // ** project has not idea
      const isProjectNoIdea =
        project?.ideaId == undefined || project.ideaId == null;

      // ** if project has idea => not create idea
      if (!isProjectNoIdea) {
        return (
          <AlertMessage
            message="You already have an idea associated with this project. Creating a new idea is not allowed."
            messageType="error"
          />
        );
      }

      // ** if project has no idea and the user login is not leader project => not create idea
      const isLeaderProject = project?.teamMembers.some(
        (m) => m.userId == user.id && m.role == TeamMemberRole.Leader
      );
      if (!isLeaderProject) {
        return (
          <AlertMessage
            message="You are not the leader of the project. Only the leader can create an idea."
            messageType="error"
          />
        );
      }

      // ** if project has no idea and the user login is leader project => create idea
    } else {
      // * if project has not and request for some team => not create idea
      if (invitationPendings.length > 0)
        return (
          <AlertMessage
            message="You have pending invitations for a team. Creating a new idea is not allowed."
            messageType="error"
          />
        );
    }
  }

  if (showPageIsIdea) return <PageIsIdea />;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("check_values", values);
      // submit file cloudinary
      const res_ = await fileUploadService.uploadFile(
        values.fileschema,
        "Idea"
      );
      if (res_.status != 1) return toast.error(res_.message);
      // end

      if (isStudent) {
        const command: IdeaCreateCommand = {
          ...values,
          mentorId: selectedUserId ?? undefined,
          isEnterpriseTopic: false,
          enterpriseName: undefined,
          file: res_.data,
        };

        const res = await ideaService.createIdeaByStudent(command);
        if (res.status == 1) {
          toast.success(res.message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowPageIsIdea(true);
          return;
        }
        toast.error(res.message);
        return;
      }

      if (isLecturer) {
        const ideacreate: IdeaCreateCommand = {
          ...values,
          mentorId: undefined,
          file: res_.data,
        };

        const res = await ideaService.createIdeaByLecturer(ideacreate);
        if (res.status == 1) {
          toast.success(res.message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowPageIsIdea(true);
          return;
        }
        toast.error(res.message);
        return;
      }

      toast.error("You have not access for create Idea");
    } catch (e: any) {
      toast.error(e.toString());
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
              Tạo Ý Tưởng Mới
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Điền đầy đủ thông tin bên dưới để đăng ký ý tưởng dự án. Tất cả
              các trường đều bắt buộc trừ khi có ghi chú khác.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Enterprise Toggle */}
            {!isStudent && (
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

              {isNotUpdateSettingYet ? (
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
                      onValueChange={(value) => {
                        const selectedProfession = professions?.find(
                          (cat) => cat.id === value
                        );
                        setSelectedProfession(selectedProfession ?? null);
                      }}
                      value={
                        selectedProfession ? selectedProfession.id : undefined
                      }
                      disabled={true}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn ngành học" />
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
                        <FormLabel>Chuyên ngành</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={true}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxTeamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng thành viên</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
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

                {isStudent && (
                  <FormItem>
                    <FormLabel>Giảng viên hướng dẫn</FormLabel>
                    <Select
                      onValueChange={(value) => setSelectedUserId(value)}
                      value={selectedUserId ?? undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn giảng viên hướng dẫn" />
                      </SelectTrigger>
                      <SelectContent>
                        {users?.map((user) => (
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
              </div>

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

            {/* Current User Info */}
            <div className="rounded-lg border p-4 space-y-2">
              <h3 className="text-lg font-medium">Thành viên Nhóm</h3>
              <p className="text-sm text-muted-foreground">
                Bạn sẽ là trưởng nhóm của dự án này
              </p>
              <div className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.email}</span>
                    <span className="text-xs text-muted-foreground">
                      {user?.lastName} {user?.firstName}
                    </span>
                  </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Trưởng nhóm
                </span>
              </div>
            </div>
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
