"use client";
import { AlertMessage } from "@/components/_common/alert-message";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";


import { RootState } from "@/lib/redux/store";

import { projectService } from "@/services/project-service";
import { TeamMemberRole } from "@/types/enums/team-member";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { TeamInfoCard } from "@/components/_common/project-card-detail";
import { useSelector } from "react-redux";
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

  let availableSlots = res_current_semester?.data?.maxTeamSize ?? 5;
  availableSlots = availableSlots - (project?.teamSize ?? 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 p-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <TeamInfoCard project={project} availableSlots={availableSlots} />
      </div>
    </div>
  );
}
