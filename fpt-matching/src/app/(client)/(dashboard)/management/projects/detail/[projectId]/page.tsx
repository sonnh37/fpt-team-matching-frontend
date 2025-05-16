"use client";
import { AlertMessage } from "@/components/_common/alert-message";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RootState } from "@/lib/redux/store";
import { formatDate } from "@/lib/utils";

import { projectService } from "@/services/project-service";
import { semesterService } from "@/services/semester-service";
import { TeamMemberRole } from "@/types/enums/team-member";

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { useSelector } from "react-redux";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const user = useSelector((state: RootState) => state.user.user);

  const {
    data: result,
    isLoading: isLoading,
    isError: isError,
  } = useQuery({
    queryKey: ["getProjectDetailById", projectId as string],
    queryFn: () => projectService.getById(projectId as string),
    refetchOnWindowFocus: false,
  });

  const {
    data: res_current_semester,
    isLoading: isLoadingStage,
    isError: isErrorStage,
    error: errorStage,
    refetch: refetchCurrentSemester,
  } = useQuery({
    queryKey: ["getCurrentSemester"],
    queryFn: () => semesterService.getCurrentSemester(),
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
  const isHasTopic = project?.topicId ? true : false;

  let availableSlots = res_current_semester?.data?.maxTeamSize ?? 5;
  availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);

  return (
    <div className="p-4">
      <div className="w-full flex flex-row gap-4 justify-between">
        <div className={"w-[90%] flex flex-col gap-2"}>
          <TypographyH3 className={"pl-2"}>Project Detail </TypographyH3>
          <Card>
            <CardHeader className={"flex flex-row justify-between"}>
              <CardTitle className="flex justify-between items-center">
                <div>
                  {project?.teamName} {project.teamCode}
                  <TypographyMuted>
                    Created at: {formatDate(project?.createdDate)}
                  </TypographyMuted>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Abbreviation & Vietnamese Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Abbreviations</p>
                  <p className="font-semibold italic">
                    {project?.topic?.abbreviation}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Vietnamese Title</p>
                  <p className="font-semibold italic">
                    {project?.topic?.vietNameseName}
                  </p>
                </div>
              </div>

              {/* Profession & Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Profession</p>
                  <p className="font-semibold italic">
                    {
                      project?.topic?.specialty?.profession
                        ?.professionName
                    }
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Specialty</p>
                  <p className="font-semibold italic">
                    {
                      project?.topic?.specialty
                        ?.specialtyName
                    }
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-500">Description</p>
                <p className="italic">
                  {project.topic?.description}
                </p>
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
                            <p className="font-semibold">
                              {member.user?.email}
                            </p>
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
                                  <a
                                    href={`/profile-detail/${member.user?.id}`}
                                  >
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
    </div>
  );
}
