"use client";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {LuUsersRound} from "react-icons/lu";
import {TbUsersPlus} from "react-icons/tb";
import {TeamForm} from "@/components/sites/team/create";
import {topicService} from "@/services/topic-service";
import {useQuery} from "@tanstack/react-query";
import {TopicGetCurrentByStatusQuery} from "@/types/models/queries/topics/topic-get-current-by-status";
import {TopicStatus} from "@/types/enums/topic";
import ErrorSystem from "@/components/_common/errors/error-system";
import {LoadingComponent} from "@/components/_common/loading-page";
import {invitationService} from "@/services/invitation-service";
import {InvitationStatus} from "@/types/enums/invitation";
import {InvitationGetByStatudQuery} from "@/types/models/queries/invitations/invitation-get-by-status-query";
import {AlertMessage} from "@/components/_common/alert-message";
import {useCurrentSemester} from "@/hooks/use-current-role";
import {SemesterStatus} from "@/types/enums/semester";

export const NoTeam = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let showCreateModal = searchParams.get("create") === "true";
  const semester = useCurrentSemester().currentSemester;
  const query: TopicGetCurrentByStatusQuery = {
    statusList: [
        TopicStatus.ManagerApproved
    ],
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
    queryKey: ["getTopicCurrentAccepted", query],
    queryFn: () => topicService.getCurrentTopicOfMeByStatus(query),
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
        message="Bạn đã có yêu cầu cho một số đội"
        messageType="error"
      />
    );


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
        {
          semester?.status == SemesterStatus.Preparing ? (
              <>
                <div className="text-3xl text-red-500 pb-4 text-center">
                  Bạn chưa có nhóm.
                </div>

                <div className="w-full flex justify-center">
                  <Dialog open={showCreateModal} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                      <Button>
                        <TbUsersPlus /> Tạo nhóm
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="">
                      <DialogHeader>
                        <DialogTitle>Nhóm mới</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <TeamForm />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="w-full flex justify-center">
                  <div>
                    <Button variant={"default"} onClick={() => router.push("/")}>
                      <LuUsersRound /> Tìm nhóm
                    </Button>
                  </div>
                </div>
              </>
          ) : (
              <div className="text-3xl text-red-500 pb-4 text-center">
                Chưa đến thời gian tạo nhóm
              </div>
          )
        }
      </div>
    </div>
  );
};
