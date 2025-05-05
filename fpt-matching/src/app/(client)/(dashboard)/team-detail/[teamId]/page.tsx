"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { formatDate } from "@/lib/utils";
import { ideaService } from "@/services/idea-service";
import { invitationService } from "@/services/invitation-service";
import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { stageideaService } from "@/services/stage-idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { TeamMemberRole } from "@/types/enums/team-member";
import { InvitationStudentCreatePendingCommand } from "@/types/models/commands/invitation/invitation-student-command";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { is } from "date-fns/locale";
import {
  CalendarDays,
  FileText,
  Info,
  Loader2,
  LoaderCircle,
  MoreVertical,
  Send,
  User,
  User as UserIcon,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { teamId } = useParams();
  if (!teamId) return null;
  const user = useSelectorUser();
  const roleCurrent = useCurrentRole();
  const [isLoading, setIsLoading] = useState(false);

  const query: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.Pending,
    isPagination: false,
  };

  const queryClient = useQueryClient();

  const { data: res_current_semester, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  const hasCurrentSemester = useMemo(() => {
    if (
      res_current_semester?.data == undefined ||
      res_current_semester.data == null
    ) {
      // Đang chưa vô kì nhưng vô đợt hoặc chưa vô đợt
      return false;
    }
    return true;
  }, [res_current_semester?.data]);

  // Query: Idea của user
  const {
    data: result_idea_current,
    isLoading: isLoadingIdeaCurrent,
    isError: isErrorIdeaCurrent,
  } = useQuery({
    queryKey: ["getIdeaCurrentAccepted", query],
    queryFn: () => ideaService.getCurrentIdeaOfMeByStatus(query),
    refetchOnWindowFocus: false,
  });

  // Query: Thông tin project
  const {
    data: project,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
  } = useQuery({
    queryKey: ["project", teamId],
    queryFn: () =>
      projectService.getById(teamId!.toString()).then((res) => res.data),
    enabled: !!teamId,
  });

  const { data: idea } = useQuery({
    queryKey: ["project", project?.topic?.ideaVersion?.ideaId],
    queryFn: () =>
      ideaService
        .getById(project?.topic?.ideaVersion?.ideaId)
        .then((res) => res.data),
    enabled: !!project?.topic?.ideaVersion?.ideaId,
    refetchOnWindowFocus: false,
  });

  // Query: Thông tin user hiện tại đã có project chưa
  const { data: teamUserLogin } = useQuery({
    queryKey: ["myProject"],
    queryFn: () => projectService.getProjectInfo().then((res) => res.data),
  });

  // Query: Kiểm tra xem user đã gửi yêu cầu vào team chưa
  const { data: isInvited } = useQuery({
    queryKey: ["checkInvite", project?.id],
    queryFn: () =>
      invitationService
        .checkMemberProject((project?.id ?? "").toString())
        .then((res) => res.data),
    enabled: !!project?.id,
  });

  const teamMembers = project?.teamMembers?.filter((x) => !x.isDeleted) ?? [];
  const isCurrentUserInTeam = teamMembers.some(
    (x) => x.user?.email === user?.email
  );
  const sortedMembers = [...teamMembers].sort((a, b) =>
    a.role === TeamMemberRole.Leader
      ? -1
      : b.role === TeamMemberRole.Leader
        ? 1
        : 0
  );

  const isHasTopic = !!project?.topic;
  const topic = project?.topic;
  const ideaVersion = project?.topic?.ideaVersion;
  const maxTeamSize = isHasTopic
    ? project.topic?.ideaVersion?.teamSize ?? 6
    : 6;
  const currentTeamSize = teamMembers.length;
  const availableSlots = Math.max(0, maxTeamSize - currentTeamSize);

  const hasPendingIdea = (result_idea_current?.data?.length ?? 0) > 0;
  const canJoinTeam =
    availableSlots > 0 &&
    roleCurrent === "Student" &&
    !isCurrentUserInTeam &&
    !teamUserLogin;

    const role = useCurrentRole()

  const requestJoinTeam = async (id: string) => {
    setIsLoading(true);

    if(role !== "Student"){
      toast.error("Bạn không có quyền xin vào nhóm ")
      return
    }
    try {
      // Kiểm tra size idea có lớn hơn số thành viên hiện tại không
      if (availableSlots <= 0) {
        toast.error("Nhóm đã đủ thành viên.Bạn không thể xin vào");
        return;
      }

      const ideacreate: InvitationStudentCreatePendingCommand = {
        projectId: id,
        content: "Muốn tham gia vào nhóm bạn",
      };
      const result = await invitationService.sendByStudent(ideacreate);

      if (result?.status === 1) {
        toast.success(result.message);
        queryClient.refetchQueries({ queryKey: ["checkInvite"] });
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình gửi yêu cầu tham gia nhóm.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRequest = async (projectId: string) => {
    const result = await invitationService.cancelInvite(projectId);
    if (result.status === 1) {
      // Hiển thị loading page
      toast.success("Bạn đã hủy thành công");
      queryClient.refetchQueries({ queryKey: ["checkInvite"] });
    } else {
      toast("Bạn đã hủy không thành công");
    }
  };

  if (isLoadingIdeaCurrent || isLoadingTeam || isLoadingCurrent)
    return <LoadingComponent />;
  if (isErrorIdeaCurrent || isErrorTeam) return <ErrorSystem />;

  return (
    <div className="container pt-6 max-w-4xl">
      <div className="space-y-6">
        {/* Phần button tham gia nhóm */}
        {canJoinTeam && (
          <div className="flex justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {isInvited ? (
                    <Button
                      variant="outline"
                      onClick={() => cancelRequest(project?.id || "")}
                      className="gap-2 border-destructive text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      Hủy yêu cầu
                    </Button>
                  ) : (
                    !hasCurrentSemester && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            disabled={hasPendingIdea}
                            className="gap-2"
                            variant="default"
                          >
                            <Users className="h-4 w-4" />
                            Yêu cầu tham gia
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-lg">
                              Yêu cầu tham gia nhóm
                            </DialogTitle>
                            <DialogDescription>
                              Bạn đang yêu cầu tham gia nhóm:{" "}
                              <span className="font-semibold">
                                {project?.teamName || "này"}
                              </span>
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            {project?.leader && (
                              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={project.leader.avatar} />
                                  <AvatarFallback>
                                    {project.leader.lastName?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {project.leader.lastName}{" "}
                                    {project.leader.firstName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {project.leader.email}
                                  </p>
                                  <Badge variant="secondary" className="mt-1">
                                    Trưởng nhóm
                                  </Badge>
                                </div>
                              </div>
                            )}

                            <Alert className="border-blue-200 bg-blue-50">
                              <Info className="h-4 w-4 text-blue-600" />
                              <AlertDescription className="text-blue-700">
                                Yêu cầu sẽ được gửi đến trưởng nhóm để xét
                                duyệt.
                              </AlertDescription>
                            </Alert>
                          </div>

                          <DialogFooter>
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Quay lại
                              </Button>
                            </DialogClose>
                            <Button
                              type="submit"
                              onClick={() => requestJoinTeam(project?.id || "")}
                              className="gap-2"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4" />
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4" />
                                  Gửi yêu cầu
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )
                  )}
                </div>
              </TooltipTrigger>
              {hasPendingIdea && (
                <TooltipContent side="bottom" className="max-w-[300px]">
                  <p className="text-sm">
                    Bạn không thể yêu cầu tham gia nhóm khi có ý tưởng đang chờ
                    duyệt.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        )}

        {/* Card thông tin chính */}
        <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {project?.teamName || "Nhóm chưa có tên"}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    <Users className="h-3 w-3 mr-1" />
                    {sortedMembers.length}/{ideaVersion?.teamSize || "?"} thành
                    viên
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    <CalendarDays className="h-3 w-3 inline mr-1" />
                    Tạo ngày: {formatDate(project?.createdDate)}
                  </p>
                </div>
              </div>

              {availableSlots > 0 && (
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Còn {availableSlots} chỗ trống
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Thông tin đề tài */}
            {isHasTopic && ideaVersion && (
              <>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    Thông tin đề tài
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card thông tin cơ bản */}
                    <Card className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Thông tin chung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Viết tắt:</Label>
                          <p className="font-medium">
                            {ideaVersion.abbreviations || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Việt:</Label>
                          <p className="font-medium">
                            {ideaVersion.vietNamName || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Anh:</Label>
                          <p className="font-medium">
                            {ideaVersion.englishName || "Chưa có"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card thông tin bổ sung */}
                    <Card className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Chi tiết đề tài
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Mã đề tài:</Label>
                          <p className="font-medium">
                            {topic?.topicCode || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Ngành:</Label>
                          <p className="font-medium">
                            {idea?.specialty?.profession?.professionName ||
                              "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Chuyên ngành:</Label>
                          <p className="font-medium">
                            {idea?.specialty?.specialtyName || "Chưa có"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card mô tả (full width) */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Mô tả đề tài
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line text-foreground">
                          {ideaVersion.description || "Chưa có mô tả"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Card thông tin khác */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Thông tin bổ sung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Đề tài doanh nghiệp:</Label>
                            <p className="font-medium">
                              {idea?.isEnterpriseTopic ? "Có" : "Không"}
                            </p>
                          </div>
                          {idea?.isEnterpriseTopic && (
                            <div className="space-y-1">
                              <Label>Tên doanh nghiệp:</Label>
                              <p className="font-medium">
                                {ideaVersion.enterpriseName || "Chưa có"}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Mentor:</Label>
                            <p className="font-medium">
                              {idea?.mentor?.email || "Chưa có"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label>Mentor phụ:</Label>
                            <p className="font-medium">
                              {idea?.subMentor?.email || "Chưa có"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Số lượng thành viên tối đa:</Label>
                          <p className="font-medium">
                            {ideaVersion.teamSize || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tệp đính kèm:</Label>
                          {ideaVersion.file ? (
                            <Button
                              variant="link"
                              className="px-0 h-auto"
                              asChild
                            >
                              <a
                                href={ideaVersion.file}
                                target="_blank"
                                className="text-primary font-medium"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Xem tài liệu đề tài
                              </a>
                            </Button>
                          ) : (
                            <p className="font-medium">Không có file</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {/* Danh sách thành viên */}
            <Separator className="my-6" />
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                Thành viên nhóm
              </h3>

              <div className="space-y-3">
                {sortedMembers.map((member, index) => {
                  const initials = `${member.user?.lastName?.charAt(0).toUpperCase() || ""
                    }`;
                  const isLeader = member.role === TeamMemberRole.Leader;

                  return (
                    <Card
                      key={index}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 border">
                            <AvatarImage
                              src={member.user?.avatar}
                              alt={member.user?.email}
                            />
                            <AvatarFallback className="font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">
                              {member.user?.lastName} {member.user?.firstName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.user?.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Badge
                            variant={isLeader ? "default" : "secondary"}
                            className="min-w-[100px] justify-center"
                          >
                            {isLeader ? "Trưởng nhóm" : "Thành viên"}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/profile-detail/${member.user?.id}`}
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Xem hồ sơ
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
