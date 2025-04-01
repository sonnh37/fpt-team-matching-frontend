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
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  ModalClose,
} from "@/components/ui/animated-modal";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import ErrorSystem from "@/components/_common/errors/error-system";
import { format } from "path";
import { formatDate } from "@/lib/utils";
import { TeamMemberRole } from "@/types/enums/team-member";
import { teardownHeapProfiler } from "next/dist/build/swc";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useParams } from "next/navigation";
import { teammemberService } from "@/services/team-member-service";
import { useEffect, useState } from "react";
import { TeamMember } from "@/types/team-member";
import { Project } from "@/types/project";
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
import { boolean } from "zod";
import { StudentInvitationCommand } from "@/types/models/commands/invitation/invitation-student-command";
import Loader from "@/components/_common/waiting-icon/page";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, User } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ideaService } from "@/services/idea-service";
import { IdeaStatus } from "@/types/enums/idea";
import { IdeaGetCurrentByStatusQuery } from "@/types/models/queries/ideas/idea-get-current-by-status";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { TypographySmall } from "@/components/_common/typography/typography-small";

export default function TeamInfoDetail() {
  // const { teamId } = useParams();
  // console.log("sonngu", teamId);

  // // Lấy thông tin user từ Redux store
  // const user = useSelector((state: RootState) => state.user.user);

  // //  Gọi API lấy thông tin team bằng useQuery (đúng cách)
  // const {
  //   data: result,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["getTeamInfo", teamId], // `teamId` vào key để caching đúng
  //   queryFn: () => projectService.fetchById(teamId?.toString() ?? ""), //
  //   refetchOnWindowFocus: false,
  //   enabled: !!teamId, // ✅ Chỉ chạy query nếu có `teamId`
  // });

  // // Nếu đang load hoặc có lỗi thì return sớm
  // if (isLoading) return <LoadingComponent />;
  // if (isError || !result?.data) {
  //   console.error("Error fetching:", error);
  //   return <ErrorSystem />;
  // }

  // //  Gọi API lấy team member của user (Đúng cách)
  // const { data: result1 } = useQuery({
  //   queryKey: ["getTeammemberById", user?.id], // Định danh dữ liệu đúng
  //   queryFn: () => teammemberService.fetchById(user?.id ?? ""),
  //   refetchOnWindowFocus: false,
  //   enabled: !!user?.id, // ✅ Chỉ chạy nếu `user?.id` tồn tại
  // });

  // //  Kiểm tra `hasTeam` đúng cách
  // const hasTeam = !!result1?.data; // ✅ Chuyển đổi thành boolean

  // Xử lý logic sắp xếp
  //   const sortedMembers = result.data.teamMembers
  //   ?.slice()
  //   .sort((a, b) => (a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0));

  // //Tính số slot trống
  // const availableSlots = (result.data.teamSize ?? 0) - (result.data.teamMembers?.length ?? 0)

  const { teamId } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  //  State lưu dữ liệu từ API
  const [teamInfo, setTeamInfo] = useState<Project | null>(null);
  const [teamUserLogin, setTeamUser] = useState<Project | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const query: IdeaGetCurrentByStatusQuery = {
    status: IdeaStatus.Pending,
  };

  const {
    data: result_idea_current,
    isLoading: isLoadingIdeaCurrent,
    isError: isErrorIdeaCurrent,
  } = useQuery({
    queryKey: ["getIdeaCurrentAccepted", query],
    queryFn: () => ideaService.getCurrentIdeaOfMeByStatus(query),
    refetchOnWindowFocus: false,
  });

  //  Gọi API lấy thông tin team
  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    projectService
      .fetchById(teamId?.toString())
      .then((res) => {
        setTeamInfo(res?.data ?? null);
        const activeTeamMembers =
          res?.data?.teamMembers.filter((x) => !x.isDeleted) ?? [];
        setTeamMembers(activeTeamMembers);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [teamId]);

  const [isInvited, setIsInvited] = useState<boolean | null>();

  const checkInvitation = async () => {
    if (teamInfo?.id) {
      const result = await invitationService.checkMemberProject(
        teamInfo?.id?.toString()
      );
      setIsInvited(result?.data || null);
      console.log("test1", result?.data);
    }
  };

  useEffect(() => {
    checkInvitation();
  }, [teamInfo?.id]);

  useEffect(() => {
    const checkProjectUserLogin = async () => {
      const result = await projectService.getProjectInfo();
      setTeamUser(result?.data || null);
      console.log("co team roi", result?.data);
    };
    checkProjectUserLogin();
  }, []);

  //gọi ra coi nó có trong team prj này không
  const check = teamMembers.find((x) => x.user?.email == user?.email);

  // Sắp xếp leader lên đầu
  const sortedMembers = [...teamMembers].sort((a, b) =>
    a.role === TeamMemberRole.Leader
      ? -1
      : b.role === TeamMemberRole.Leader
      ? 1
      : 0
  );

  //  Tính số slot trống
  const IsExistedIdea = teamInfo?.idea ? true : false;

  let availableSlots = 6;
  if (!IsExistedIdea) {
    availableSlots = availableSlots - (teamInfo?.teamMembers?.length ?? 0);
  } else {
    availableSlots = (teamInfo?.teamSize ?? 0) - (teamMembers.length ?? 0);
  }

  const requestJoinTeam = async (id: string) => {
    setOpen(false);
    const ideacreate: StudentInvitationCommand = {
      projectId: id,
      content: "Muốn tham gia vào nhóm bạn",
    };
    const result = await invitationService.sendByStudent(ideacreate);

    if (result?.status === 1) {
      setLoading(true);

      // Đợi 2 giây rồi reload trang
      setTimeout(() => {
        setLoading(false);
        checkInvitation();
        toast.success(result.message);
      }, 2000);
    } else {
      toast.success(result.message);
    }
  };

  const cancelRequest = async (teamInfoId: string) => {
    const result = await invitationService.cancelInvite(teamInfoId);
    if (result.status === 1) {
      // Hiển thị loading page
      setLoading(true);

      // Đợi 2 giây rồi reload trang
      setTimeout(() => {
        setLoading(false); // Tắt loading (tuỳ chọn)
        checkInvitation();
        toast.success("Bạn đã hủy thành công");
      }, 2000);
    } else {
      toast("Bạn đã hủy không thành công");
    }
  };

  if (isLoadingIdeaCurrent) return <LoadingComponent />;
  if (isErrorIdeaCurrent) return <ErrorSystem />;

  const hasPendingIdea = (result_idea_current?.data?.length ?? 0) > 0;
  return (
    <div className="p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}

      <div className="space-y-4 w-[60%]">
        <TypographyH3>Group Detail</TypographyH3>
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>
                {teamInfo?.teamName}
                <TypographyMuted>
                  Created at: {formatDate(teamInfo?.createdDate)}
                </TypographyMuted>
              </div>
              {
                //check xem con slot khong va no khog co trong team nay va no khong co team vo nao khac roi
                availableSlots > 0 &&
                  !check &&
                  !teamUserLogin && // nếu như ko có project
                  //Check xem da gui moi chua
                  (isInvited ? (
                    <Button
                      variant={"destructive"}
                      onClick={() => cancelRequest(teamInfo?.id || "")}
                    >
                      Cancel
                    </Button>
                  ) : (
                    // <button className="bg-blue-500- text-xl p-2 bg-blue-500  hover:bg-blue-200" onChange={() => requestJoinTeam()}>Request</button>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button
                                disabled={hasPendingIdea}
                                className="gap-2"
                              >
                                <TbUsersPlus className="h-4 w-4" />
                                Join Team
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Join {teamInfo?.teamName || "this team"}?
                                </DialogTitle>
                                <DialogDescription>
                                  You're about to send a join request
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 pb-4">
                                <div className="flex space-y-2">
                                  {teamInfo?.leader && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <User className="h-4 w-4 opacity-70" />
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

                                  <TypographySmall>Your request needs approval from the team
                                  leader before you can join.</TypographySmall>
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
                                  onClick={() =>
                                    requestJoinTeam(teamInfo?.id || "")
                                  }
                                >
                                  <TbUsersPlus />
                                  Confirm Join
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TooltipTrigger>
                      {hasPendingIdea && (
                        <TooltipContent>
                            <TypographyLarge>
                            You have a pending idea, so you cannot request to join a team.
                            </TypographyLarge>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))
              }
            </CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Abbreviation & Vietnamese Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Abbreviations</p>
                <p className="font-semibold italic">
                  {teamInfo?.idea?.abbreviations}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Vietnamese Title</p>
                <p className="font-semibold italic">
                  {teamInfo?.idea?.vietNamName}
                </p>
              </div>
            </div>

            {/* Profession & Specialty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Profession</p>
                <p className="font-semibold italic">
                  {teamInfo?.idea?.specialty?.profession?.professionName}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Specialty</p>
                <p className="font-semibold italic">
                  {teamInfo?.idea?.specialty?.specialtyName}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-500">Description</p>
              <p className="italic">{teamInfo?.idea?.description}</p>
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
