"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { LoadingComponent } from "@/components/_common/loading-page";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSelectorUser } from "@/hooks/use-auth";
import { cn, formatDate } from "@/lib/utils";
import { projectService } from "@/services/project-service";
import { teammemberService } from "@/services/team-member-service";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
import { ProjectStatus } from "@/types/enums/project";
import {
  MentorConclusionOptions,
  TeamMemberRole,
  TeamMemberStatus,
} from "@/types/enums/team-member";
import { ProjectUpdateCommand } from "@/types/models/commands/projects/project-update-command";
import { TeamMember } from "@/types/team-member";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  MoreVertical,
  Pencil,
  Save,
  Trash,
  Trash2,
  User,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import InviteUsersForm from "../topic/updateidea/page";
import { useCurrentSemester } from "@/hooks/use-current-role";

export default function TeamInfo() {
  const user = useSelectorUser();
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const confirm = useConfirm();
  const {currentSemester} = useCurrentSemester();

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

  // Combine loading and error states
  const isLoading = isLoadingTeam || isLoadingCurrentSemester;
  const isError = isErrorTeam || isErrorCurrentSemester;

  useEffect(() => {
    if (teamInfo?.data?.teamName) {
      setTeamName(teamInfo.data.teamName);
    }
  }, [teamInfo?.data?.teamName]);

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", errorTeam);
    return <ErrorSystem />;
  }

  if (teamInfo?.status == -1) {
    return <NoTeam />;
  }

  const project = currentSemesterTeam?.data ?? teamInfo?.data;
  if (!project) return <NoTeam />;

  const isLockProject = project.status !== ProjectStatus.Forming;
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
  let sortedMembers = [...(project.teamMembers ?? [])].sort((a, b) =>
    a.role === TeamMemberRole.Leader
      ? -1
      : b.role === TeamMemberRole.Leader
      ? 1
      : 0
  );
  sortedMembers = sortedMembers.filter(x => x.leaveDate == null)

  const isHasTopic = !!project.topicId;
  const availableSlots = (currentSemester?.maxTeamSize ?? 0) - (project.teamSize ?? 0)

  const isLockTeamMember = project?.status !== ProjectStatus.Forming;

  const handleAction = async (
    action: () => Promise<any>,
    successMessage: string
  ) => {
    const confirmed = await confirm({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn xác nhận form này này?",
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
    <div className="grid grid-cols-1 lg:grid-cols-4 p-4 gap-6">
      {/* Main Content - Chiếm 3/4 màn hình lớn */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              {/* Phần tên nhóm */}
              <div className="space-y-2">
                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <Input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full sm:w-72 text-lg font-semibold"
                      placeholder="Nhập tên nhóm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={!teamName.trim()}
                        className="gap-1"
                      >
                        <Save className="h-4 w-4" />
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      {project.teamName ?? "Chưa đặt tên"}
                    </h2>
                    {isLeader && (
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLockProject}
                        onClick={() => setIsEditing(true)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Ngày tạo: {formatDate(project?.createdDate)}
                </p>
              </div>

              {/* Các action button */}
              <div className="flex flex-wrap gap-2 justify-end">
                {currentUserMember?.role === TeamMemberRole.Leader ? (
                  <div className="flex items-center gap-2">
                    {/* Nút yêu cầu tham gia */}
                    <Dialog>
                      <DialogTrigger asChild>

                        <Button
                          variant="outline"
                          disabled={isLockTeamMember}
                          size="sm"
                          className="relative"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Yêu cầu
                          {pendingInvitations.length > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center p-0"
                            >
                              {pendingInvitations.length}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl h-[80vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Yêu cầu tham gia nhóm</DialogTitle>
                          <DialogDescription>
                            Danh sách các thành viên đang yêu cầu tham gia nhóm
                            của bạn
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          {project.id && (
                            <InvitationsInComingToLeaderTable
                              projectId={project.id}
                            />
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Nút thêm thành viên */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          disabled={isLockTeamMember}
                          size="sm"
                          className="gap-1"
                        >
                          <UserRoundPlus className="h-4 w-4" />
                          Thêm thành viên
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Mời thành viên mới</DialogTitle>
                        </DialogHeader>
                        <div className="p-4">
                          <InviteUsersForm />
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Nút xóa nhóm */}
                    <Button
                      variant="ghost"
                      disabled={isLockTrash}
                      size="sm"
                      onClick={() =>
                        handleAction(
                          () =>
                            projectService.deletePermanent(project.id ?? ""),
                          "Đã xóa nhóm"
                        )
                      }
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    disabled={isLockTeamMember}
                    onClick={() =>
                      handleAction(teammemberService.leaveTeam, "Đã rời nhóm")
                    }
                    className="text-destructive border-destructive hover:text-destructive"
                  >
                    Rời nhóm
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* Thông tin đề tài */}
            {project.topic?.topicVersions != null ? (
              <>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground">
                    Thông tin đề tài
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card thông tin cơ bản */}
                    <Card className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle>Thông tin chung</CardTitle>
                        <Separator />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Viết tắt:</Label>
                          <p>{project.topic.abbreviation || "Chưa có"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Việt:</Label>
                          <p>{project.topic.vietNameseName || "Chưa có"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Anh:</Label>
                          <p>{project.topic.englishName || "Chưa có"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card thông tin bổ sung */}
                    <Card className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle>Chi tiết đề tài</CardTitle>
                        <Separator />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Mã đề tài:</Label>
                          <p>{project.topic.topicCode || "Chưa có"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label>Ngành:</Label>
                          <p>
                            {project.topic?.specialty?.profession
                              ?.professionName || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Chuyên ngành:</Label>
                          <p>
                            {project.topic?.specialty?.specialtyName ||
                              "Chưa có"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card mô tả (full width) */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle>Mô tả đề tài</CardTitle>
                        <Separator />
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">
                          {project.topic.description || "Chưa có mô tả"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Card thông tin khác */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle>Thông tin bổ sung</CardTitle>
                        <Separator />
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Đề tài doanh nghiệp:</Label>
                            <p>
                              {project.topic.isEnterpriseTopic ? "Có" : "Không"}
                            </p>
                          </div>
                          {project.topic?.isEnterpriseTopic && (
                            <div className="space-y-1">
                              <Label>Tên doanh nghiệp:</Label>
                              <p>{project.topic.enterpriseName || "Chưa có"}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Giảng viên hướng dẫn:</Label>
                            <p>{project.topic.mentor?.email || "Chưa có"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label>Giảng viên hướng dẫn 2:</Label>
                            <p>
                              {project.topic?.subMentor?.email || "Chưa có"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Số lượng thành viên tối đa:</Label>
                          <p>{project.teamSize || "Chưa có"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tệp đính kèm:</Label>
                          {project.topic?.topicVersions?.length > 0 &&
                          latestTopicVersion?.fileUpdate ? (
                            <Button variant="link" className="px-0" asChild>
                              <a
                                target="_blank"
                                href={latestTopicVersion.fileUpdate}
                              >
                                Xem file đính kèm
                              </a>
                            </Button>
                          ) : (
                            <p>Chưa có file</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            ) : (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Chưa có đề tài!</AlertTitle>
                <AlertDescription>
                  Nhóm của bạn chưa đăng ký đề tài.{" "}
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link
                      href="/topic/supervisors"
                      className="text-primary font-semibold"
                    >
                      <div className="font-bold text-black">
                        {" "}
                        Xem danh sách đề tài từ giảng viên
                      </div>
                    </Link>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Danh sách thành viên */}
            <Separator className="my-6" />

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Thành viên nhóm
                </h3>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  Còn {availableSlots} vị trí trống
                </Badge>
              </div>

              <div className="grid gap-4">
                {sortedMembers.map((member: TeamMember) => {
                  const initials = `${
                    member.user?.lastName?.charAt(0).toUpperCase() || ""
                  }`;
                  const joinDate = formatDate(member.joinDate);
                  const leaveDate = formatDate(member.leaveDate);
                  // Role mapping
                  const roleMap = {
                    [TeamMemberRole.Member]: {
                      text: "Thành viên",
                      variant: "secondary",
                    },
                    [TeamMemberRole.Leader]: {
                      text: "Trưởng nhóm",
                      variant: "default",
                    },
                    [TeamMemberRole.Mentor]: {
                      text: "Mentor",
                      variant: "default",
                    },
                    [TeamMemberRole.SubMentor]: {
                      text: "Phụ mentor",
                      variant: "outline",
                    },
                  };
                  const roleInfo =
                    member.role !== undefined
                      ? roleMap[member.role]
                      : { text: "Không xác định", variant: "secondary" };

                  // Status mapping
                  const statusMap = {
                    [TeamMemberStatus.Pending]: {
                      text: "Đang chờ",
                      variant: "outline",
                    },
                    [TeamMemberStatus.InProgress]: {
                      text: "Đang thực hiện",
                      variant: "default",
                    },
                    [TeamMemberStatus.Pass1]: {
                      text: "Đạt lần 1",
                      variant: "info",
                    },
                    [TeamMemberStatus.Pass2]: {
                      text: "Đạt lần 2",
                      variant: "info",
                    },
                    [TeamMemberStatus.Fail1]: {
                      text: "Không đạt lần 1",
                      variant: "destructive",
                    },
                    [TeamMemberStatus.Fail2]: {
                      text: "Không đạt lần 2",
                      variant: "destructive",
                    },
                  };
                  const statusInfo =
                    member.status !== undefined
                      ? statusMap[member.status]
                      : { text: "Không xác định", variant: "outline" };

                  // Mentor conclusion mapping
                  const mentorConclusionMap = {
                    [MentorConclusionOptions.Agree_to_defense]: {
                      text: "Đồng ý bảo vệ",
                      variant: "success",
                    },
                    [MentorConclusionOptions.Revised_for_the_second_defense]: {
                      text: "Chỉnh sửa bảo vệ lần 2",
                      variant: "warning",
                    },
                    [MentorConclusionOptions.Disagree_to_defense]: {
                      text: "Không đồng ý bảo vệ",
                      variant: "destructive",
                    },
                  };
                  const mentorConclusionInfo =
                    member.mentorConclusion !== undefined
                      ? mentorConclusionMap[member.mentorConclusion]
                      : null;

                  return (
                    <Card
                      key={member.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row gap-4 p-4">
                        {/* Avatar and basic info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <Avatar className="h-12 w-12 flex-shrink-0">
                            <AvatarImage
                              src={member.user?.avatar}
                              alt={member.user?.email}
                            />
                            <AvatarFallback className="font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <h4 className="font-medium truncate">
                                  {member.user?.lastName}{" "}
                                  {member.user?.firstName}
                                </h4>
                                <p className="text-sm text-muted-foreground truncate">
                                  {member.user?.email}
                                </p>
                              </div>
                              <div className="text-sm mt-1 text-muted-foreground whitespace-nowrap">
                                Ngày tham gia: {joinDate}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Badge variant={roleInfo.variant as any}>
                                {roleInfo.text}
                              </Badge>
                              {member.status !== TeamMemberStatus.Pending &&
                                member.status !==
                                  TeamMemberStatus.InProgress && (
                                  <Badge
                                    variant={statusInfo.variant as any}
                                    className={cn(
                                      statusInfo.variant === "info"
                                        ? "bg-green-500 text-white dark:text-black hover:bg-green-600"
                                        : ""
                                    )}
                                  >
                                    {statusInfo.text}
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Actions and additional info */}
                        <div className="flex flex-col items-end gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8"
                              >
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
                              {member.role !== TeamMemberRole.Leader &&
                                isLeader &&
                                !isLockTeamMember && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive focus:bg-destructive/10"
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
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Xóa thành viên
                                    </DropdownMenuItem>
                                  </>
                                )}
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

      {/* Sidebar - Chiếm 1/4 màn hình lớn */}

      <div className="lg:col-span-1 space-y-6">
        {/* Card đăng ký nhóm */}
        {project.status == ProjectStatus.Forming ?
            (
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Đăng ký nhóm</CardTitle>
              <CardDescription>Nộp đăng ký đề tài chính thức</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Lưu ý: Đề tài cần được thống nhất bởi tất cả thành viên trước
                khi nộp và sẽ không được thay đổi tên nhóm
              </p>
              {project.topicId &&
              (availableSlots == 0 || availableSlots == 1) ? (
                <Link href={`/team/submit/${project.id}`}>
                  <Button className="w-full">Nộp</Button>
                </Link>
              ) : (
                <Button className="w-full" disabled>
                  {" "}
                  Chưa đủ điều kiện
                </Button>
              )}
            </CardContent>
          </Card>
        ) : null}

        {/* Card xin đề tài từ GV (nếu có) */}
        {!teamInfo?.data?.topicId && (
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Xin đề tài từ GV</CardTitle>
              <CardDescription>
                Đề xuất đề tài từ giảng viên hướng dẫn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Cần có sự đồng ý của tất cả thành viên trong nhóm
              </p>
              <Button className="w-full" asChild>
                <Link href="/topic/supervisors">Danh sách đề tài</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Card đánh giá thành viên */}
        <Card className="rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Đánh giá thành viên</CardTitle>
            <CardDescription>
              Đánh giá quá trình làm việc của các thành viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">Chỉ thực hiện sau Review 3</p>
            {(() => {
              const review3 = project.reviews?.find((x) => x.number === 3);
              if (!review3?.reviewDate) {
                return (
                  <Button disabled className="w-full">
                    Chưa đến thời gian đánh giá
                  </Button>
                );
              }

              const reviewDate = new Date(review3.reviewDate);
              const adjustedReviewDate = new Date(
                reviewDate.getTime() +
                  reviewDate.getTimezoneOffset() * 60 * 1000
              );
              const currentDate = new Date();

              if (adjustedReviewDate < currentDate) {
                return (
                  <Button disabled={!isLeader} className="w-full" asChild>
                    <Link href={`/team/rate?projectId=${project.id}`}>
                      Đánh giá thành viên
                    </Link>
                  </Button>
                );
              }

              return (
                <Button disabled className="w-full">
                  Chưa đến thời gian đánh giá
                </Button>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
