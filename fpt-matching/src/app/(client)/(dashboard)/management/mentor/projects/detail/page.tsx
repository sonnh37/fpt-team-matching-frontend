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
import { TeamMemberRole } from "@/types/enums/team-member";

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { useSelector } from "react-redux";
import { TeamInfoCard } from "@/components/_common/project-card-detail";
import { semesterService } from "@/services/semester-service";

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
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
    <div className="grid grid-cols-1 lg:grid-cols-4 p-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <TeamInfoCard project={project} availableSlots={availableSlots} />
      </div>
    </div>
  );
}
