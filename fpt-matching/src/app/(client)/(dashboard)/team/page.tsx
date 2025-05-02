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
  DialogDescription,
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
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import InviteUsersForm from "../idea/updateidea/page";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    if (
      res_current_semester?.data != undefined ||
      res_current_semester?.data != null
    )
      return <AlertMessage message="Chưa kết thúc kì hiện tại!" />;
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
                          <DialogDescription>
                            Thêm thành viên vào nhóm bằng email hoặc mã sinh
                            viên
                          </DialogDescription>
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
                          "Bạn đã xóa nhóm thành công"
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
                    disabled={isLockProject}
                    onClick={() =>
                      handleAction(
                        teammemberService.leaveTeam,
                        "Bạn đã rời nhóm thành công"
                      )
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
            {project.topic?.ideaVersion != null ? (
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
                        <CardTitle>Thông tin chung</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Viết tắt:</Label>
                          <p>
                            {project.topic.ideaVersion.abbreviations ||
                              "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Việt:</Label>
                          <p>
                            {project.topic.ideaVersion.vietNamName || "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Tên tiếng Anh:</Label>
                          <p>
                            {project.topic.ideaVersion.englishName || "Chưa có"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card thông tin bổ sung */}
                    <Card className="col-span-1">
                      <CardHeader className="pb-3">
                        <CardTitle>Chi tiết đề tài</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-1">
                          <Label>Mã đề tài:</Label>
                          <p>{project.topic.topicCode || "Chưa có"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label>Ngành:</Label>
                          <p>
                            {idea?.specialty?.profession?.professionName ||
                              "Chưa có"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label>Chuyên ngành:</Label>
                          <p>{idea?.specialty?.specialtyName || "Chưa có"}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card mô tả (full width) */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle>Mô tả đề tài</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-line">
                          {project.topic.ideaVersion.description ||
                            "Chưa có mô tả"}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Card thông tin khác */}
                    <Card className="md:col-span-2">
                      <CardHeader className="pb-3">
                        <CardTitle>Thông tin bổ sung</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Đề tài doanh nghiệp:</Label>
                            <p>
                              {project.topic.ideaVersion.idea?.isEnterpriseTopic
                                ? "Có"
                                : "Không"}
                            </p>
                          </div>
                          {project.topic.ideaVersion.idea
                            ?.isEnterpriseTopic && (
                            <div className="space-y-1">
                              <Label>Tên doanh nghiệp:</Label>
                              <p>
                                {project.topic.ideaVersion.enterpriseName ||
                                  "Chưa có"}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label>Người hướng dẫn:</Label>
                            <p>{idea?.mentor?.email || "Chưa có"}</p>
                          </div>
                          <div className="space-y-1">
                            <Label>Người hướng dẫn 2:</Label>
                            <p>{idea?.subMentor?.email || "Chưa có"}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Số lượng thành viên tối đa:</Label>
                          <p>
                            {project.topic.ideaVersion.teamSize || "Chưa có"}
                          </p>
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
                      href="/idea/supervisors"
                      className="text-primary font-semibold"
                    >
                      Xem danh sách đề tài từ giảng viên
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

              <div className="space-y-3">
                {sortedMembers.map((member: TeamMember, index) => {
                  const initials = `${
                    member.user?.lastName?.charAt(0).toUpperCase() || ""
                  }`;
                  const isLeaderInMembers =
                    member.role === TeamMemberRole.Leader;

                  return (
                    <Card
                      key={index}
                      className="hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border">
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
                            variant={
                              isLeaderInMembers ? "default" : "secondary"
                            }
                            className="min-w-[100px] justify-center"
                          >
                            {isLeaderInMembers ? "Trưởng nhóm" : "Thành viên"}
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
                              {isLeader && !isLeaderInMembers && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    handleAction(
                                      () =>
                                        teammemberService.deletePermanent(
                                          member.id ?? ""
                                        ),
                                      "Đã xóa thành viên thành công"
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa thành viên
                                </DropdownMenuItem>
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
        <Card className="rounded-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Đăng ký nhóm</CardTitle>
            <CardDescription>Nộp đăng ký đề tài chính thức</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Lưu ý: Đề tài cần được thống nhất bởi tất cả thành viên trước khi
              nộp
            </p>
            <Button className="w-full" asChild>
              <Link href="/team/submit">Nộp đề tài</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card xin đề tài từ GV (nếu có) */}
        {teamInfo?.data?.status === ProjectStatus.Pending &&
          teamInfo?.data?.topicId && (
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
                  <Link href="/idea/supervisors">Danh sách đề tài</Link>
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
            <p className="text-sm">
              Chỉ thực hiện sau Review 3 và trước ngày bảo vệ 1 tuần
            </p>
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
                  <Button className="w-full" asChild>
                    <Link href={`/team/rate/${project.id}`}>
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
