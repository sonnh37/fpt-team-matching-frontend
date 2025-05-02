"use client";
import { AlertMessage } from "@/components/_common/alert-message";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import { NoTeam } from "@/components/sites/team/no-team";
import InvitationsInComingToLeaderTable from "@/components/sites/team/request-join-team-incoming";
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
  DialogContent,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSelectorUser } from "@/hooks/use-auth";
import { formatDate } from "@/lib/utils";
import { ideaService } from "@/services/idea-service";
import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { teammemberService } from "@/services/team-member-service";
import { IdeaStatus } from "@/types/enums/idea";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { ProjectStatus } from "@/types/enums/project";
import { TeamMemberRole } from "@/types/enums/team-member";
import { ProjectUpdateCommand } from "@/types/models/commands/projects/project-update-command";
import { TeamMember } from "@/types/team-member";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Save, Trash, UserRoundPlus, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import InviteUsersForm from "../idea/updateidea/page";

export default function TeamInfo() {
  const user = useSelectorUser();
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const confirm = useConfirm();

  const {
    data: res_current_semester,
    isLoading: isLoadingStage,
    isError: isErrorStage,
    error: errorStage,
  } = useQuery({
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
  const {
    data: teamInfo,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    error: errorTeam,
    refetch: refetchTeam,
  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: () => projectService.getProjectInfo(),
    refetchOnWindowFocus: false,
  });

  const {
    data: currentSemesterTeam,
    isLoading: isLoadingCurrentSemester,
    isError: isErrorCurrentSemester,
    refetch: refetchTeamInCurrentSemester,
  } = useQuery({
    queryKey: ["getTeamInfoCurrentSemester"],
    queryFn: () => projectService.getProjectInSemesterCurrentInfo(),
    refetchOnWindowFocus: false,
  });

  const ideaId = teamInfo?.data?.topic?.ideaVersion?.ideaId;
  const {
    data: idea,
    isLoading: isLoadingIdea,
    isError: isErrorIdea,
  } = useQuery({
    queryKey: ["getIdeaInTeam", ideaId],
    queryFn: () => ideaService.getById(ideaId).then((res) => res.data),
    refetchOnWindowFocus: false,
    enabled: !!ideaId,
  });

  // Combine loading and error states
  const isLoading =
    isLoadingStage ||
    isLoadingTeam ||
    isLoadingIdea ||
    isLoadingCurrentSemester;
  const isError =
    isErrorStage || isErrorTeam || isErrorIdea || isErrorCurrentSemester;

  useEffect(() => {
    if (teamInfo?.data?.teamName) {
      setTeamName(teamInfo.data.teamName);
    }
  }, [teamInfo?.data?.teamName]);

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", errorTeam || errorStage);
    return <ErrorSystem />;
  }

  if (teamInfo?.status === -1) {
    if (!hasCurrentSemester) return <AlertMessage message="Chưa kết thúc kì hiện tại!" />;
    return <NoTeam />;
  }

  const project = currentSemesterTeam?.data ?? teamInfo?.data;
  if (!project) return <NoTeam />;

  const isLockProject = project.status === ProjectStatus.InProgress;
  const isLockTrash = project.topicId != undefined || project.topicId != null;
  const latestTopicVersion = (project.topic?.topicVersions ?? []).sort(
    (a, b) =>
      new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime()
  )[0];

  const handleSave = async () => {
    try {
      const command: ProjectUpdateCommand = {
        ...project,
        teamName: teamName,
      };
      const res = await projectService.update(command);

      if (res.status !== 1) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setIsEditing(false);
      refetchTeam();
      refetchTeamInCurrentSemester();
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTeamName(project.teamName ?? "");
    setIsEditing(false);
  };

  const currentUserMember = project.teamMembers?.find(
    (member: TeamMember) => member.userId === user?.id
  );
  const isLeader = currentUserMember?.role === TeamMemberRole.Leader;

  // Sort members with leaders first
  const sortedMembers = [...(project.teamMembers ?? [])].sort((a, b) =>
    a.role === TeamMemberRole.Leader
      ? -1
      : b.role === TeamMemberRole.Leader
      ? 1
      : 0
  );

  const isHasTopic = !!project.topicId;
  const availableSlots = isHasTopic
    ? (project.topic?.ideaVersion?.teamSize ?? 0) -
      (project.teamMembers?.length ?? 0)
    : 6 - (project.teamMembers?.length ?? 0);

  const isLockTeamMember = availableSlots === 0;

  const handleAction = async (
    action: () => Promise<any>,
    successMessage: string
  ) => {
    const confirmed = await confirm({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn thực hiện hành động này?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
    });

    if (confirmed) {
      try {
        const res = await action();
        if (res.status === 1) {
          toast.success(successMessage);
          refetchTeam();
          refetchTeamInCurrentSemester();
        } else {
          toast.error(res.message || "Thao tác thất bại");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi");
      }
    }
  };

  const pendingInvitations =
    project.invitations?.filter(
      (m) =>
        m.type === InvitationType.SentByStudent &&
        m.status === InvitationStatus.Pending
    ) ?? [];

  return (
    <div className="grid grid-cols-4 p-4 gap-4">
      <div className="col-span-3 space-y-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-64"
                      />
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!teamName.trim()}
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Lưu
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <TypographyH3>
                        {project.teamName ?? "Unknown"}
                      </TypographyH3>
                      {isLeader ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLockProject}
                          onClick={() => setIsEditing(true)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="mt-1">
                  Ngày tạo {formatDate(project?.createdDate)}
                </CardDescription>
              </div>

              <div className="flex gap-3 items-center">
                {currentUserMember?.role === TeamMemberRole.Leader ? (
                  <div className="flex items-center gap-1">
                    {/* Invitations Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          disabled={isLockTeamMember}
                          size="icon"
                          className="relative"
                        >
                          <Users />
                          {pendingInvitations.length > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute right-1 top-1 h-4 w-4 translate-x-1/2 -translate-y-1/2 p-0 flex items-center justify-center"
                            >
                              {pendingInvitations.length}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-fit h-[80%] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Những yêu cầu tham gia vào nhóm
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {project.id && (
                            <InvitationsInComingToLeaderTable
                              projectId={project.id}
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Add Member Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          disabled={isLockTeamMember}
                          size="icon"
                        >
                          <UserRoundPlus />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:min-w-[60%] sm:max-w-fit h-fit">
                        <DialogHeader>
                          <DialogTitle>Thêm thành viên</DialogTitle>
                          <CardDescription>
                            Thêm thành viên vào nhóm của bạn
                          </CardDescription>
                        </DialogHeader>
                        <div className="h-full p-2 overflow-y-auto overflow-visible">
                          <InviteUsersForm />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete Team Button */}
                    <Button
                      variant="ghost"
                      disabled={isLockTrash}
                      size="icon"
                      onClick={() =>
                        handleAction(
                          () =>
                            projectService.deletePermanent(project.id ?? ""),
                          "Bạn đã xóa nhóm"
                        )
                      }
                    >
                      <Trash />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    disabled={isLockProject}
                    onClick={() =>
                      handleAction(
                        teammemberService.leaveTeam,
                        "Bạn đã rời nhóm"
                      )
                    }
                  >
                    Rời nhóm
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-6">
              {project.topic?.ideaVersion != null ? (
                <>
                  {/* Idea Information */}
                  {project?.topic.ideaVersion.idea && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Đề tài của nhóm
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Abbreviations */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Viết tắt
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {project.topic.ideaVersion.abbreviations || "-"}
                            </TypographyP>
                          </div>

                          {/* Vietnamese Name */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Tiếng Việt
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {project.topic.ideaVersion.vietNamName || "-"}
                            </TypographyP>
                          </div>

                          {/* English Name */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Tiếng Anh
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {project.topic.ideaVersion.englishName || "-"}
                            </TypographyP>
                          </div>

                          {/* Idea Code */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Mã đề tài
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {project.topic.topicCode || "-"}
                            </TypographyP>
                          </div>

                          {/* Ngành */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Ngành
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {idea?.specialty?.profession?.professionName ||
                                "-"}
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
                              {project.topic.ideaVersion.description || "-"}
                            </TypographyP>
                          </div>

                          {/* File */}
                          <div className="space-y-1">
                            <TypographySmall className="text-muted-foreground">
                              Tệp đính kèm
                            </TypographySmall>
                            <TypographyP className="p-0">
                              {project.topic?.topicVersions?.length > 0 &&
                              latestTopicVersion?.fileUpdate ? (
                                <a
                                  className="text-blue-500 underline"
                                  target="_blank"
                                  href={latestTopicVersion.fileUpdate}
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
                              {project.topic.ideaVersion.idea.isEnterpriseTopic
                                ? "Có"
                                : "Không"}
                            </TypographyP>
                          </div>

                          {project.topic.ideaVersion.idea.isEnterpriseTopic && (
                            <div className="space-y-1">
                              <TypographySmall className="text-muted-foreground">
                                Tên doanh nghiệp
                              </TypographySmall>
                              <TypographyP className="p-0">
                                {project.topic.ideaVersion.enterpriseName ||
                                  "-"}
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
                              {project.topic.ideaVersion.teamSize || "-"}
                            </TypographyP>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <TypographyP className="text-red-600">
                    Not have idea yet.{" "}
                    <Button variant="link" className="p-0 m-0" asChild>
                      <Link
                        className="text-red-600 font-semibold"
                        href="/idea/supervisors"
                      >
                        Click hear to view list idea from lecturer
                      </Link>
                    </Button>
                  </TypographyP>
                </>
              )}
              {/* Team Members */}
              <Separator />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold">Team Members</h4>
                  <Badge variant="outline" className="text-sm">
                    {availableSlots} slot{availableSlots !== 1 ? "s" : ""}{" "}
                    available
                  </Badge>
                </div>
                <div className="space-y-3">
                  {sortedMembers.map((member: TeamMember, index) => {
                    const initials = `${
                      member.user?.lastName?.charAt(0).toUpperCase() || ""
                    }`;
                    const isLeaderInMembers =
                      member.role === TeamMemberRole.Leader;

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
                          <Badge
                            variant={
                              isLeaderInMembers ? "default" : "secondary"
                            }
                          >
                            {TeamMemberRole[member.role ?? 0]}
                            {isLeaderInMembers && " (Owner)"}
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
                              {isLeader && !isLeaderInMembers && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction(
                                      () =>
                                        teammemberService.deletePermanent(
                                          member.id ?? ""
                                        ),
                                      "Đã xóa thành viên"
                                    )
                                  }
                                >
                                  Xóa thành viên
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 space-y-4">
        <div className="space-y-2">
          <TypographyH4>Đăng ký nhóm</TypographyH4>
          <Card className="">
            <CardContent className="flex mt-4 flex-col justify-center items-center gap-1">
              <TypographyP>Nộp đăng ký đề tài</TypographyP>
              <TypographyMuted>
                Lưu ý: Đề tài được nộp nên được thông qua bởi các thành viên
                trong nhóm,nếu nộp thì sẽ không còn chỉnh sửa nữa
              </TypographyMuted>
              <Button className={"mt-8 min-w-40"} asChild>
                <Link href={"/team/submit"}>Nộp đề tài</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {teamInfo?.data?.status === ProjectStatus.Pending &&
          teamInfo?.data?.topicId && (
            <div className="space-y-2 mt-4">
              <TypographyH4>Xin đề tài từ giảng viên</TypographyH4>
              <Card>
                <CardContent className="flex mt-4 flex-col justify-center items-center gap-4">
                  <TypographyP>Xem những đề đang có của giảng viên</TypographyP>
                  <TypographyMuted>
                    Lưu ý: Khi nộp đơn xin đề tài nên có sự đồng ý của thành
                    viên trong nhóm
                  </TypographyMuted>
                  <Button asChild>
                    <Link href="/idea/supervisors">Xem danh sách đề tài</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

        <div className="space-y-2">
          <TypographyH4>Đánh giá thành viên nhóm</TypographyH4>
          <Card>
            <CardContent className="flex mt-4 flex-col justify-center items-center gap-4">
              <TypographyP>Đánh giá quá trình làm thành viên</TypographyP>
              <TypographyMuted>
                Lưu ý: Chỉ được đánh giá sau ngày review 3, và phải nộp trước
                ngày bảo vệ 1 tuần
              </TypographyMuted>
              {(() => {
                const review3 = project.reviews?.find((x) => x.number === 3);

                if (!review3?.reviewDate) {
                  return <Button disabled={true}>Đánh giá thành viên</Button>;
                }

                const reviewDate = new Date(review3.reviewDate);
                const adjustedReviewDate = new Date(
                  reviewDate.getTime() +
                    reviewDate.getTimezoneOffset() * 60 * 1000
                );
                const currentDate = new Date();

                if (adjustedReviewDate < currentDate) {
                  return (
                    <Button>
                      <Link href={`/team/rate/${project.id}`}>Đánh giá thành viên</Link>
                    </Button>
                  );
                }

                return <Button disabled={true}>Đánh giá thành viên</Button>;
              })()} 
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
