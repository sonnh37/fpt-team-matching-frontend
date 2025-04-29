"use client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuUsersRound } from "react-icons/lu";
import { TbUsersPlus } from "react-icons/tb";
import { TeamForm } from "@/components/sites/team/create";
import { ideaService } from "@/services/idea-service";
import { useQuery } from "@tanstack/react-query";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { IdeaStatus } from "@/types/enums/idea";
import ErrorSystem from "@/components/_common/errors/error-system";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoadingComponent } from "@/components/_common/loading-page";
import { invitationService } from "@/services/invitation-service";
import { InvitationStatus } from "@/types/enums/invitation";
import { InvitationGetByStatudQuery } from "@/types/models/queries/invitations/invitation-get-by-status-query";
import { AlertMessage } from "@/components/_common/alert-message";
export const NoTeam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let showCreateModal = searchParams.get("create") === "true";

  const query: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.Approved,
    isPagination: false,
  };

  const query_invitations: InvitationGetByStatudQuery = {
    status: InvitationStatus.Pending,
    isPagination: true,
    pageNumber: 1,
    pageSize: 100,
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getIdeaCurrentAccepted", query],
    queryFn: () => ideaService.getCurrentIdeaOfMeByStatus(query),
    refetchOnWindowFocus: false,
  });

  const {
    data: result_invitations,
    isLoading: isLoadingInvitations,
    isError: isErrorInvitations,
    error: error_invitations,
  } = useQuery({
    queryKey: ["getUserInvitationsByType", query_invitations],
    queryFn: async () =>
      await invitationService.getUserInvitationsStatus(query_invitations),
    refetchOnWindowFocus: false,
  });

  const invitationPendings = result_invitations?.data?.results ?? [];

  if (isLoading || isLoadingInvitations) return <LoadingComponent />;
  if (isError || isErrorInvitations) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  if (invitationPendings.length > 0)
    return (
      <AlertMessage
        message="You already have a request for some team"
        messageType="error"
      />
    );

  const hasAcceptedIdea = (result?.data?.length ?? 0) > 0;

  if (hasAcceptedIdea) {
    showCreateModal = false;
    router.replace("/team");
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      router.replace("/team?create=true");
    } else {
      router.replace("/team");
    }
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <div className="text-3xl text-red-500 pb-4 text-center">
          Bạn chưa có nhóm.Hãy tìm nhóm bạn đi nào.
        </div>

        <div className="w-full flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Dialog open={showCreateModal} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                    <Button disabled={hasAcceptedIdea}>
                      <TbUsersPlus /> Tạo nhóm
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <DialogTitle>Đề tài mới</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <TeamForm />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TooltipTrigger>
            {hasAcceptedIdea && (
              <TooltipContent>
                <p>Bạn đang trong quá trình kiểm duyệt idea,bạn không có quyền tạo nhóm lúc này.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
        <div className="w-full flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button variant={"default"} disabled={hasAcceptedIdea}>
                  <LuUsersRound /> Tìm thành viên
                </Button>
              </div>
            </TooltipTrigger>
            {hasAcceptedIdea && (
              <TooltipContent>
                <p>Bạn đang trong quá trình kiểm duyệt idea,bạn không có quyền thêm thành viên lúc này.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
