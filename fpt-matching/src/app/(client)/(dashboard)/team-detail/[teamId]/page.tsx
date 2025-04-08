"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { formatDate } from "@/lib/utils";
import { TeamMemberRole } from "@/types/enums/team-member";
import { useParams } from "next/navigation";
import { teammemberService } from "@/services/team-member-service";
import { useEffect, useState } from "react";
import { invitationService } from "@/services/invitation-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StudentInvitationCommand } from "@/types/models/commands/invitation/invitation-student-command";
import Loader from "@/components/_common/waiting-icon/page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { Button } from "@/components/ui/button";
import { TbUsersPlus } from "react-icons/tb";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import { useSelectorUser } from "@/hooks/use-auth";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, User as UserIcon } from "lucide-react";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team-member";
import { TypographyP } from "@/components/_common/typography/typography-p";

export default function TeamInfoDetail() {
  const { teamId } = useParams();
  if (!teamId) return null;
  const user = useSelectorUser();
  const roleCurrent = useCurrentRole();

  const query: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.Pending,
  };

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
    data: teamInfo,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
  } = useQuery({
    queryKey: ["project", teamId],
    queryFn: () =>
      projectService.fetchById(teamId!.toString()).then((res) => res.data),
    enabled: !!teamId,
  });

  // Query: Thông tin user hiện tại đã có project chưa
  const { data: teamUserLogin } = useQuery({
    queryKey: ["myProject"],
    queryFn: () => projectService.getProjectInfo().then((res) => res.data),
  });

  // Query: Kiểm tra xem user đã gửi yêu cầu vào team chưa
  const { data: isInvited } = useQuery({
    queryKey: ["checkInvite", teamInfo?.id],
    queryFn: () =>
      invitationService
        .checkMemberProject((teamInfo?.id ?? "").toString())
        .then((res) => res.data),
    enabled: !!teamInfo?.id,
  });

  const teamMembers = teamInfo?.teamMembers?.filter((x) => !x.isDeleted) ?? [];
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

  const hasIdea = !!teamInfo?.idea;
  const maxTeamSize = hasIdea ? teamInfo.idea?.maxTeamSize ?? 6 : 6;
  const currentTeamSize = teamMembers.length;
  const availableSlots = Math.max(0, maxTeamSize - currentTeamSize);

  const hasPendingIdea = (result_idea_current?.data?.length ?? 0) > 0;
  const canJoinTeam =
    availableSlots > 0 &&
    roleCurrent === "Student" &&
    !isCurrentUserInTeam &&
    !teamUserLogin;

  const requestJoinTeam = async (id: string) => {
    if (availableSlots <= 0) {
      toast.error("Team is full. Cannot send request.");
      return;
    }

    const invitation: StudentInvitationCommand = {
      projectId: id,
      content: "I would like to join your team",
    };

    try {
      const result = await invitationService.sendByStudent(invitation);
      if (result?.status === 1) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to send join request");
    }
  };

  const cancelRequest = async (projectId: string) => {
    try {
      const result = await invitationService.cancelInvite(projectId);
      if (result.status === 1) {
        toast.success("Request cancelled successfully");
      } else {
        toast.error("Failed to cancel request");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling the request");
    }
  };

  if (isLoadingIdeaCurrent || isLoadingTeam) return <LoadingComponent />;
  if (isErrorIdeaCurrent || isErrorTeam) return <ErrorSystem />;

  return (
    <div className="container pt-4 max-w-4xl">
      <div className="space-y-3">
        <div className="flex">
          <TypographyH3>Team Details</TypographyH3>
          {canJoinTeam && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  {isInvited ? (
                    <Button
                      variant="destructive"
                      onClick={() => cancelRequest(teamInfo?.id || "")}
                      className="gap-2"
                    >
                      Cancel Request
                    </Button>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button disabled={hasPendingIdea} className="gap-2">
                          <TbUsersPlus className="h-4 w-4" />
                          Join Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Join {teamInfo?.teamName || "this team"}?
                          </DialogTitle>
                          <DialogDescription>
                            You're about to send a join request to this team
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {teamInfo?.leader && (
                            <div className="flex items-center gap-2 text-sm">
                              <UserIcon className="h-4 w-4 opacity-70" />
                              <span>
                                Team Leader:{" "}
                                {teamInfo.leader.firstName ||
                                  teamInfo.leader.email}
                              </span>
                            </div>
                          )}

                          {teamInfo?.description && (
                            <TypographyMuted className="text-sm italic">
                              "{teamInfo.description}"
                            </TypographyMuted>
                          )}

                          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                            <Info className="h-4 w-4 mt-0.5 text-blue-600" />
                            <TypographySmall className="text-blue-700">
                              Your request needs approval from the team leader
                              before you can join.
                            </TypographySmall>
                          </div>
                        </div>

                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            type="submit"
                            onClick={() => requestJoinTeam(teamInfo?.id || "")}
                            className="gap-2"
                          >
                            <TbUsersPlus />
                            Confirm Join
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </TooltipTrigger>
              {hasPendingIdea && (
                <TooltipContent>
                  <p>
                    You have a pending idea, so you cannot request to join a
                    team.
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
                <CardTitle className="text-2xl">{teamInfo?.teamName}</CardTitle>
                <CardDescription className="mt-1">
                  Created on {formatDate(teamInfo?.createdDate)}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {availableSlots} slot{availableSlots !== 1 ? "s" : ""} available
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Team Description */}
            {teamInfo?.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h4>
                <p className="text-gray-700">{teamInfo.description}</p>
              </div>
            )}

            {/* Idea Information */}
            {teamInfo?.idea && (
              <>
                <Separator />
                <div>
                  <h4 className="text-lg font-semibold mb-4">Project Idea</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Abbreviations */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Viết tắt
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.abbreviations || "-"}
                      </TypographyP>
                    </div>

                    {/* Vietnamese Name */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tiếng Việt
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.vietNamName || "-"}
                      </TypographyP>
                    </div>

                    {/* English Name */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tiếng Anh
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.englishName || "-"}
                      </TypographyP>
                    </div>

                    {/* Idea Code */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mã đề tài
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.ideaCode || "-"}
                      </TypographyP>
                    </div>

                    {/* Ngành */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Ngành
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.specialty?.profession?.professionName ||
                          "-"}
                      </TypographyP>
                    </div>

                    {/* Chuyên ngành */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Chuyên ngành
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.specialty?.specialtyName || "-"}
                      </TypographyP>
                    </div>

                    {/* Mô tả */}
                    <div className="space-y-1 md:col-span-2">
                      <TypographySmall className="text-muted-foreground">
                        Mô tả
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.description || "-"}
                      </TypographyP>
                    </div>

                    {/* File */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Tệp đính kèm
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.file ? (
                          <a
                            href={teamInfo.idea.file}
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
                        {teamInfo.idea.isEnterpriseTopic ? "Có" : "Không"}
                      </TypographyP>
                    </div>

                    {teamInfo.idea.isEnterpriseTopic && (
                      <div className="space-y-1">
                        <TypographySmall className="text-muted-foreground">
                          Tên doanh nghiệp
                        </TypographySmall>
                        <TypographyP className="p-0">
                          {teamInfo.idea.enterpriseName || "-"}
                        </TypographyP>
                      </div>
                    )}

                    {/* Mentor & SubMentor */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mentor
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.mentor?.email || "-"}
                      </TypographyP>
                    </div>

                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Mentor phụ
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.subMentor?.email || "-"}
                      </TypographyP>
                    </div>

                    {/* Trạng thái */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Trạng thái
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.status || "-"}
                      </TypographyP>
                    </div>

                    {/* Số lượng thành viên tối đa */}
                    <div className="space-y-1">
                      <TypographySmall className="text-muted-foreground">
                        Số lượng thành viên tối đa
                      </TypographySmall>
                      <TypographyP className="p-0">
                        {teamInfo.idea.maxTeamSize || "-"}
                      </TypographyP>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Team Members */}
            <Separator />
            <div>
              <h4 className="text-lg font-semibold mb-4">Team Members</h4>
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
