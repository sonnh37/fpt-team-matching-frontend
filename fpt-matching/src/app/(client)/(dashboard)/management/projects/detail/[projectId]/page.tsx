"use client";
import { AlertMessage } from "@/components/_common/alert-message";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TypographySmall } from "@/components/_common/typography/typography-small";
import Loader from "@/components/_common/waiting-icon/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";
import { ideaService } from "@/services/idea-service";
import { invitationService } from "@/services/invitation-service";
import { projectService } from "@/services/project-service";
import { IdeaStatus } from "@/types/enums/idea";
import { TeamMemberRole } from "@/types/enums/team-member";
import { StudentInvitationCommand } from "@/types/models/commands/invitation/invitation-student-command";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { Project } from "@/types/project";
import { TeamMember } from "@/types/team-member";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TbUsersPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    data: result,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["getProjectDetailById", projectId as string],
    queryFn: () => projectService.fetchById(projectId as string),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;
  if (!result?.data)
    return (
      <AlertMessage message={result?.message as string} messageType="warning" />
    );

  const project = result?.data;

  // Sắp xếp leader lên đầu
  const sortedMembers = [...project.teamMembers].sort((a, b) =>
    a.role === TeamMemberRole.Leader
      ? -1
      : b.role === TeamMemberRole.Leader
      ? 1
      : 0
  );

  //  Tính số slot trống
  const isExistedIdea = project?.idea ? true : false;

  let availableSlots = 6;
  if (!isExistedIdea) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.teamSize ?? 0) - (project.teamMembers.length ?? 0);
  }

  return (
    <div className="p-4">
      <div className="space-y-4 w-[80%]">
        <TypographyH3>Project Detail </TypographyH3>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>
                {project?.teamName} {project.teamCode}
                <TypographyMuted>
                  Created at: {formatDate(project?.createdDate)}
                </TypographyMuted>
              </div>
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Abbreviation & Vietnamese Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Abbreviations</p>
                <p className="font-semibold italic">
                  {project?.idea?.abbreviations}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Vietnamese Title</p>
                <p className="font-semibold italic">
                  {project?.idea?.vietNamName}
                </p>
              </div>
            </div>

            {/* Profession & Specialty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Profession</p>
                <p className="font-semibold italic">
                  {project?.idea?.specialty?.profession?.professionName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Specialty</p>
                <p className="font-semibold italic">
                  {project?.idea?.specialty?.specialtyName}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-500">Description</p>
              <p className="italic">{project?.idea?.description}</p>
            </div>

            {/* Members */}
            <div>
              <div className="flex justify-between">
                <p className="text-gray-500">Members</p>
                <p className="text-gray-500">
                  Available Slot: {availableSlots}
                </p>
              </div>

              <div className="space-y-3 mt-2">
                {sortedMembers.map((member, index) => {
                  const initials = `${
                    member.user?.lastName?.charAt(0).toUpperCase() ?? ""
                  }`;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 rounded-lg">
                          <AvatarImage
                            src={member.user?.avatar!}
                            alt={member.user?.email!}
                          />
                          <AvatarFallback className="rounded-lg">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{member.user?.email}</p>
                          <p className="text-sm text-gray-500">
                            {member.user?.firstName}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {member.role === TeamMemberRole.Leader ? (
                          <p className="text-sm text-gray-500">
                            {TeamMemberRole[member.role ?? 0]} | Owner
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {TeamMemberRole[member.role ?? 0]}
                          </p>
                        )}
                        <div className="relative ml-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <FontAwesomeIcon
                                className="size-4"
                                icon={faEllipsisVertical}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <a href={`/profile-detail/${member.user?.id}`}>
                                  Xem profile
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
