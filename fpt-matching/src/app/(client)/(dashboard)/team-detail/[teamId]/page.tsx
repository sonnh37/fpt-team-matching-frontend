"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographySmall } from "@/components/_common/typography/typography-small";
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
import { IdeaStatus } from "@/types/enums/idea";
import { TeamMemberRole } from "@/types/enums/team-member";
import { StudentInvitationCommand } from "@/types/models/commands/invitation/invitation-student-command";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { is } from "date-fns/locale";
import { Info, LoaderCircle, User as UserIcon } from "lucide-react";
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

  const { data: res_stage, isLoading: isLoadingSemester } = useQuery({
    queryKey: ["getBeforeSemester"],
    queryFn: () => semesterService.getBeforeSemester(),
    refetchOnWindowFocus: false,
  });

  const { data: res_current_semester, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
    refetchOnWindowFocus: false,
  });

  const isLock = useMemo(() => {
    const now = new Date();

    if (res_current_semester?.data && res_stage?.data) {
      const beforeSemesterEndDate = new Date(res_stage.data.endDate ?? 0);
      const currentSemesterStartDate = new Date(res_current_semester.data.startDate ?? 0);
      
      // Kiểm tra nếu hiện tại nằm giữa endDate của kì trước và startDate của kì hiện tại
      return now > beforeSemesterEndDate && now < currentSemesterStartDate;
    }

    // Nếu có currentSemester → KHÔNG KHÓA (đang trong kì hiện tại)
    if (res_current_semester?.data) {
      return true;
    }

    // Nếu không có currentSemester nhưng có beforeSemester
    if (res_stage?.data) {
      const beforeSemesterEndDate = new Date(res_stage.data.endDate ?? 0);
      return now > beforeSemesterEndDate; // KHÓA nếu đã qua endDate
    }

    // Nếu không có cả currentSemester và beforeSemester → KHÓA
    return true;
  }, [res_stage?.data, res_current_semester?.data]);

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

  console.log("check_isLock", isLock)
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

  const requestJoinTeam = async (id: string) => {
    setIsLoading(true);

    try {
      // Kiểm tra size idea có lớn hơn số thành viên hiện tại không
      if (availableSlots <= 0) {
        toast.error("Nhóm đã đủ thành viên.Bạn không thể xin vào");
        return;
      }

      const ideacreate: StudentInvitationCommand = {
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

  if (isLoadingIdeaCurrent || isLoadingTeam || isLoadingSemester || isLoadingCurrent)
    return <LoadingComponent />;
  if (isErrorIdeaCurrent || isErrorTeam) return <ErrorSystem />;

  return (
    <div className="container pt-4 max-w-4xl">
      <div className="space-y-3">
        <div className="flex gap-3 items-center">
          {canJoinTeam && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {isInvited ? (
                    <Button
                      variant="destructive"
                      onClick={() => cancelRequest(project?.id || "")}
                      className="gap-2"
                    >
                      Cancel Request
                    </Button>
                  ) : (
                    !isLock && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button disabled={hasPendingIdea} className="gap-2">
                              <TbUsersPlus className="h-4 w-4" />
                              Tham gia
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Tham gia {project?.teamName || "this team"}?
                              </DialogTitle>
                              <DialogDescription>
                                Đây là yêu cầu về việc tham gia nhóm
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              {project?.leader && (
                                <div className="flex items-center gap-2 text-sm">
                                  <UserIcon className="h-4 w-4 opacity-70" />
                                  <span>
                                    Nhóm trưởng:{" "}
                                    {project.leader.firstName ||
                                      project.leader.email}
                                  </span>
                                </div>
                              )}

                              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                                <Info className="h-4 w-4 mt-0.5 text-blue-600" />
                                <TypographySmall className="text-blue-700">
                                  Yêu cầu này sẽ được gửi đến nhóm trưởng của
                                  bạn. Họ sẽ xem xét lời yêu cầu này.
                                </TypographySmall>
                              </div>
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">
                                  Hủy
                                </Button>
                              </DialogClose>
                              <Button
                                type="submit"
                                onClick={() =>
                                  requestJoinTeam(project?.id || "")
                                }
                                className="gap-2"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <LoaderCircle className="animate-spin" />
                                    Đang xử lý...
                                  </>
                                ) : (
                                  <>
                                    <TbUsersPlus />
                                    Xác định tham gia
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )
                  )}
                </div>
              </TooltipTrigger>
              {hasPendingIdea && (
                <TooltipContent>
                  <p>
                    Bạn có một ý tưởng đang chờ xử lý nên không thể yêu cầu tham
                    gia nhóm.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{project?.teamName}</CardTitle>
                <CardDescription className="mt-1">
                  Được tạo ngày: {formatDate(project?.createdDate)}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                Còn {availableSlots} slot{availableSlots !== 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="  space-y-6">
            {/* Idea Information */}
            {isHasTopic && ideaVersion && (
              <>
                <Separator />
                <div>
                  <h4 className="text-lg font-semibold mb-4">Đề tài</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Abbreviations */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Viết tắt
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion.abbreviations || "-"}
                      </TypographyP>
                    </div>

                    {/* Vietnamese Name */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tiếng Việt
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion.vietNamName || "-"}
                      </TypographyP>
                    </div>

                    {/* English Name */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tiếng Anh
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion.englishName || "-"}
                      </TypographyP>
                    </div>

                    {/* Idea Code */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mã đề tài
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {topic?.topicCode || "-"}
                      </TypographyP>
                    </div>

                    {/* Ngành */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Ngành
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {idea?.specialty?.profession?.professionName || "-"}
                      </TypographyP>
                    </div>

                    {/* Chuyên ngành */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Chuyên ngành
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {idea?.specialty?.specialtyName || "-"}
                      </TypographyP>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-1 md:col-span-2">
                      <TypographySmall className="text-muted-foreground">
                        Mô tả
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion.description || "-"}
                      </TypographyP>
                    </div>

                    {/* File */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tệp đính kèm
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion.file ? (
                          <a
                            href={ideaVersion.file}
                            className="text-blue-500 underline"
                            target="_blank"
                          >
                            Xem file
                          </a>
                        ) : (
                          "-"
                        )}
                      </TypographyP>
                    </div>

                    {/* Enterprise */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Đề tài doanh nghiệp
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {idea?.isEnterpriseTopic ? "Có" : "Không"}
                      </TypographyP>
                    </div>

                    {idea?.isEnterpriseTopic && (
                      <div className="space-y-1">
                        <TypographySmall className="text-muted-foreground">
                          Tên doanh nghiệp
                        </TypographySmall>
                        <TypographyP className="p-0">
                          {ideaVersion.enterpriseName || "-"}
                        </TypographyP>
                      </div>
                    )}

                    {/* Mentor & SubMentor */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mentor
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {idea?.mentor?.email || "-"}
                      </TypographyP>
                    </div>

                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mentor phụ
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {idea?.subMentor?.email || "-"}
                      </TypographyP>
                    </div>

                    {/* Trạng thái */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Trạng thái
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {IdeaStatus[idea?.status ?? 0] || "-"}
                      </TypographyP>
                    </div>

                    {/* Số lượng thành viên tối đa */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Số lượng thành viên tối đa
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {ideaVersion?.teamSize || "-"}
                      </TypographyP>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Team Members */}
            <Separator />
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Các thành viên nhóm
              </h4>
              <div className="space-y-3">
                {sortedMembers.map((member, index) => {
                  const initials = `${
                    member.user?.lastName?.charAt(0).toUpperCase() || ""
                  }`;
                  const isLeader = member.role === TeamMemberRole.Leader;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage
                            src={member.user?.avatar}
                            alt={member.user?.email}
                          />
                          <AvatarFallback className="rounded-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">
                            {member.user?.firstName} {member.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.user?.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={isLeader ? "default" : "secondary"}>
                          {TeamMemberRole[member.role ?? 0]}
                          {isLeader && " (Owner)"}
                        </Badge>

                        <DropdownMenu>
                          <DropdownMenuTrigger className="hover:bg-gray-100 p-1 rounded">
                            <FontAwesomeIcon
                              className="size-4 text-gray-500"
                              icon={faEllipsisVertical}
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <a
                                href={`/profile-detail/${member.user?.id}`}
                                className="w-full"
                              >
                                View Profile
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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
