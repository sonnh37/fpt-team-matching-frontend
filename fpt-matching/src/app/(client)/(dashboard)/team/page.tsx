"use client";
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
import { formatDate } from "@/lib/utils";
import { projectService } from "@/services/project-service";
import { teammemberService } from "@/services/team-member-service";
import { IdeaStatus } from "@/types/enums/idea";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { TeamMemberRole } from "@/types/enums/team-member";
import { ProjectUpdateCommand } from "@/types/models/commands/projects/project-update-command";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Save, Trash, UserRoundPlus, Users, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateProjectTeam from "../idea/updateidea/page";
import { TeamMember } from "@/types/team-member";
import { useSelectorUser } from "@/hooks/use-auth";
import { ideaService } from "@/services/idea-service";
import { ProjectStatus } from "@/types/enums/project";
import { semesterService } from "@/services/semester-service";
import { AlertMessage } from "@/components/_common/alert-message";

export default function TeamInfo() {
  //lay thong tin tu redux luc dang nhap
  const user = useSelectorUser();
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const confirm = useConfirm();

  const { data: res_stage } = useQuery({
    queryKey: ["getBeforeSemester"],
    queryFn: () => semesterService.getBeforeSemester(),
    refetchOnWindowFocus: false,
  });

  const isLock =
    res_stage && res_stage.data?.endDate
      ? new Date() <= new Date(res_stage.data.endDate)
      : false;

  //goi api bang tanstack
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: async () => await projectService.getProjectInfo(),
    refetchOnWindowFocus: false,
  });

  const {
    data: ressultIdea,
    isLoading: isLoadingIdea,
    isError: isErrorIdea,
    error: errorIdea,
    refetch: refetchIdea,
  } = useQuery({
    queryKey: ["getIdeaInTeam", result?.data?.topic?.ideaVersion?.ideaId],
    queryFn: async () =>
      await ideaService.getById(result?.data?.topic?.ideaVersion?.ideaId),
    refetchOnWindowFocus: false,
    enabled: !!result?.data?.topic?.ideaVersion?.ideaId,
  });

  useEffect(() => {
    if (result?.data?.teamName) {
      setTeamName(result.data.teamName);
    }
  }, [result?.data?.teamName]);

  if (isLoading || isLoadingIdea) return <LoadingComponent />;
  if (isError || isErrorIdea) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  if (result?.status == -1) {
    if (isLock) return <AlertMessage message="Chưa kết thúc kì hiện tại!" />;

    return <NoTeam />;
  }

  const project = result?.data;
  const idea = ressultIdea?.data;
  if (!project) return <NoTeam />;
  const isLockProject =
    project.status == ProjectStatus.InProgress ? true : false;

  //check xem có file không và lấy ra file mới nhất
  const latestTopicVersion = (project.topic?.topicVersions ?? [])
    .filter((x) => x.createdDate)
    .sort(
      (a, b) =>
        new Date(b.createdDate!).getTime() - new Date(a.createdDate!).getTime()
    )[0];

  const handleSave = async () => {
    // Gọi API để lưu tên mới ở đây
    try {
      const command: ProjectUpdateCommand = {
        ...project,
        teamName: teamName,
      };
      const res = await projectService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        setIsEditing(false);
        return;
      }
      toast.success(res.message);
      setIsEditing(false);
      refetch();
    } catch (ex) {
      toast.error(ex as string);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTeamName(project.teamName ?? "");
    setIsEditing(false);
  };

  const infoMember = project?.teamMembers?.find(
    (member: TeamMember) => member.userId === user?.id
  );

  //check xem thang dang nhap coi no phai member va la leader khong
  const isLeader =
    result?.data?.teamMembers?.find(
      (member: TeamMember) => member.userId === user?.id
    )?.role === TeamMemberRole.Leader;

  const teamMembers = result?.data?.teamMembers ?? [];
  // Tách Leader ra trước
  const leaders = teamMembers.filter(
    (member: TeamMember) => member.role === TeamMemberRole.Leader
  );
  const others = teamMembers.filter(
    (member: TeamMember) => member.role !== TeamMemberRole.Leader
  );

  // Ghép lại, đảm bảo Leader luôn ở đầu
  const sortedMembers = [...leaders, ...others];

  const isHasTopic = project?.topicId ? true : false;

  let availableSlots = 6;
  if (!isHasTopic) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.topic?.ideaVersion?.teamSize ?? 0) -
      (project?.teamMembers?.length ?? 0);
  }

  const isLockTeamMember = availableSlots === 0;

  //Đây là form delete trả về true fa lse tái sử dụng được
  async function handleDelete() {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      confirmText: "Yes, delete it",
      cancelText: "No",
    });

    if (confirmed) {
      // Người dùng chọn Yes
      const data_ = await projectService.deletePermanent(project?.id as string);
      if (data_.status === 1) {
        refetch();
        toast.success("Bạn đã xóa nhóm");
      } else {
        toast.error("Fail");
      }
    }
  }

  async function handleLeaveTeam() {
    if (isLockProject) {
      toast.warning("This project is locked and cannot be leave.");
      return;
    }
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Bạn có muốn rời nhóm không ?",
      confirmText: "Có,tôi muốn",
      cancelText: "Không",
    });

    if (confirmed) {
      const data = await teammemberService.leaveTeam();
      if (data.status === 1) {
        toast.success("Bạn đã rời nhóm");
        refetch();
      } else {
        toast.error("Rời nhóm thất bại");
      }
    }
  }

  async function handleDeleteMember(id: string) {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Member",
      description: "Are you sure you want to delete your member?",
      confirmText: "Yes, delete it",
      cancelText: "No, cancel it",
    });

    if (confirmed) {
      const res = await teammemberService.deletePermanent(id);
      if (res.status != 1) {
        toast.error(res.message);
      }

      toast.success(res.message);
      refetch();
    } else {
    }
  }

  const invitationFromPersonalize = project.invitations.filter(
    (m) =>
      m.type == InvitationType.SentByStudent &&
      m.status == InvitationStatus.Pending
  );
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
                {infoMember && infoMember?.role === TeamMemberRole.Leader ? (
                  <>
                    <div className="flex items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            disabled={isLockTeamMember}
                            size="icon"
                            className="relative"
                          >
                            <Users />
                            {invitationFromPersonalize.length > 0 && (
                              <Badge
                                variant="destructive"
                                className="absolute right-1 top-1 h-4 w-4 translate-x-1/2 -translate-y-1/2 p-0 flex items-center justify-center"
                              >
                                {invitationFromPersonalize.length}
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
                            {project.id != undefined && (
                              <InvitationsInComingToLeaderTable
                                projectId={project.id}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            disabled={isLockTeamMember}
                            size={"icon"}
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
                          <div className="h-full overflow-y-auto">
                            <UpdateProjectTeam />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        disabled={isLockProject}
                        size={"icon"}
                        onClick={handleDelete}
                      >
                        <Trash />
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    disabled={isLockTeamMember}
                    onClick={handleLeaveTeam}
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
                                    handleDeleteMember(member?.id ?? "")
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

        {result?.data?.status == ProjectStatus.Pending &&
          result?.data?.topicId && (
            <div className="space-y-2">
              <TypographyH4>Xin đề tài từ giảng viên</TypographyH4>
              <Card>
                <CardContent className="flex mt-4 flex-col justify-center items-center gap-4">
                  <TypographyP>Xem những đề đang có của giảng viên</TypographyP>
                  <TypographyMuted>
                    Lưu ý: Khi nộp đơn xin đề tài nên có sự đồng ý của thành
                    viên trong nhóm
                  </TypographyMuted>

                  <Button asChild>
                    <Link href={"/idea/supervisors"}>Xem danh sách đề tài</Link>
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
                      <Link href="/team/rate">Đánh giá thành viên</Link>
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
