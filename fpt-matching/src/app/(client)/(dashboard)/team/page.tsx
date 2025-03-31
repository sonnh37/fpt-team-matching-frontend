"use client";
import ErrorSystem from "@/components/_common/errors/error-system";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { NoTeam } from "@/components/sites/team/no-team";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RootState } from "@/lib/redux/store";
import { projectService } from "@/services/project-service";
import { teammemberService } from "@/services/team-member-service";
import { TeamMemberRole } from "@/types/enums/team-member";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Save, Trash, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import UpdateProjectTeam from "../idea/updateidea/page";
import InvitationsInComingToLeaderTable from "@/components/sites/team/request-join-team-incoming";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageContainer from "@/components/layouts/page-container";
import { useEffect, useState } from "react";
import { ProjectCreateCommand } from "@/types/models/commands/projects/project-create-command";
import { ProjectUpdateCommand } from "@/types/models/commands/projects/project-update-command";
import { useCurrentRole } from "@/hooks/use-current-role";
import { Badge } from "@/components/ui/badge";
import { InvitationStatus, InvitationType } from "@/types/enums/invitation";
// const groupData = {
//   title: "FPT Team Matching - Social networking for students project teams",
//   createdAt: "1/2/2025 7:25:37 PM",
//   abbreviation: "FPT Team Matching",
//   vietnameseTitle: "FPT Team Matching - Mạng xã hội dành cho các nhóm dự án của sinh viên",
//   profession: "Information Technology",
//   specialty: "Software Engineering",
//   description:
//     "FPT Team Matching is a platform designed to help FPTU students connect with teams and find collaborators for academic or personal projects. It supports both academic teams (for projects in the final terms) and external teams (for personal, lecturer-led, or extracurricular projects). The system aims to simplify team formation and promote collaboration by matching students with relevant projects based on their skills and interests.",
//   keywords: ["Networking", "Collaboration", "Academic", "Project"],
//   members: [
//     { email: "thubttse171984@fpt.edu.vn", name: "thubttse171984", role: "Owner | Leader", avatar: "B" },
//     { email: "loctlse172111@fpt.edu.vn", name: "loctlse172111", role: "Member", avatar: "" },
//     { email: "sonnhse172092@fpt.edu.vn", name: "sonnhse172092", role: "Member", avatar: "N" },
//     { email: "quancmse172093@fpt.edu.vn", name: "quancmse172093", role: "Member", avatar: "C" },
//   ],
//   maxMembers: 5,
// };

export default function TeamInfo() {
  const router = useRouter();
  //lay thong tin tu redux luc dang nhap
  const user = useSelector((state: RootState) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  const [teamName, setTeamName] = useState("");
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  //goi api bang tanstack
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (result?.data?.teamName) {
      setTeamName(result.data.teamName);
    }
  }, [result?.data?.teamName]);

  if (isLoading) return <LoadingComponent />;
  if (!result || isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  if (result?.status == -1) {
    return <NoTeam />;
  }

  const project = result?.data;
  if (!project) return <NoTeam />;

  const handleSave = async () => {
    // Gọi API để lưu tên mới ở đây
    try {
      const command: ProjectUpdateCommand = {
        ...project,
        teamName: teamName,
      };
      const res = await projectService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        setIsEditing(false);
        return;
      }
      toast.success(res.message);
      setIsEditing(false);
      refetch();
    } catch (ex) {
      toast.error(ex as string);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTeamName(project.teamName ?? "");
    setIsEditing(false);
  };

  const infoMember = project?.teamMembers?.find(
    (member) => member.userId === user?.id
  );

  //check xem thang dang nhap coi no phai member va la leader khong
  const isLeader =
    result?.data?.teamMembers?.find((member) => member.userId === user?.id)
      ?.role === TeamMemberRole.Leader;

  console.log("check_isleader", isLeader);

  const teamMembers = result?.data?.teamMembers ?? [];
  // Tách Leader ra trước
  const leaders = teamMembers.filter(
    (member) => member.role === TeamMemberRole.Leader
  );
  const others = teamMembers.filter(
    (member) => member.role !== TeamMemberRole.Leader
  );

  // Ghép lại, đảm bảo Leader luôn ở đầu
  const sortedMembers = [...leaders, ...others];

  const availableSlots =
    (result?.data?.teamSize ?? 0) - (result?.data?.teamMembers?.length ?? 0);
  //Đây là form delete trả về true false tái sử dụng được
  async function handleDelete() {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      confirmText: "Yes, delete it",
      cancelText: "No",
    });

    if (confirmed) {
      // Người dùng chọn Yes
      const data = await teammemberService.deletePermanent(
        leaders[0].id as string
      );
      if (data.status === 1) {
        const data_ = await projectService.deletePermanent(
          project?.id as string
        );
        if (data_.status === 1) {
          refetch();
          toast.success("Bạn đã xóa nhóm");
        } else {
          toast.error("Fail");
        }
      } else {
        toast.error("Fail");
      }
    }
  }

  async function handleLeaveTeam() {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Bạn có muốn rời nhóm không ?",
      confirmText: "Có,tôi muốn",
      cancelText: "Không",
    });

    if (confirmed) {
      const data = await teammemberService.leaveTeam();
      if (data.status === 1) {
        toast.success("Bạn đã rời nhóm");
        refetch();
      } else {
        toast.error("Rời nhóm thất bại");
      }
    }
  }

  async function handleDeleteMember(id: string) {
    console.log("testid", id);
    if (!id) {
      toast("Invalid member ID!");
      return;
    }
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Member",
      description: "Are you sure you want to delete your member?",
      confirmText: "Yes, delete it",
      cancelText: "No, cancel it",
    });

    if (confirmed) {
      const res = await teammemberService.deletePermanent(id);
      if (res.status != 1) {
        toast.error(res.message);
      }

      toast.success(res.message);
      refetch();
    } else {
    }
  }

  const invitationFromPersonalize = project.invitations.filter(
    (m) =>
      m.type == InvitationType.SentByStudent &&
      m.status == InvitationStatus.Pending
  );
  return (
    <div className="grid grid-cols-4 p-4 gap-4">
      <div className="col-span-3 space-y-2">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-64"
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!teamName.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Lưu
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <TypographyH3>{project.teamName ?? "No name"}</TypographyH3>
                {isLeader ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
          {infoMember && infoMember?.role === TeamMemberRole.Leader ? (
            <>
              {project.ideaId != null ? (
                <>
                  <div className="flex items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="relative"
                        >
                          <Users />
                          {invitationFromPersonalize.length > 0 && (
                            <Badge
                              variant="destructive"
                              className="absolute right-1 top-1 h-4 w-4 translate-x-1/2 -translate-y-1/2 p-0 flex items-center justify-center"
                            >
                              {invitationFromPersonalize.length}
                            </Badge>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-fit">
                        <DialogHeader>
                          <DialogTitle>Request incoming</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <InvitationsInComingToLeaderTable />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size={"icon"}>
                          <Pencil />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:min-w-[60%] pt-12 sm:max-w-fit h-[90vh] max-h-[90vh]">
                        <div className="h-full overflow-y-auto">
                          <UpdateProjectTeam />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size={"icon"}
                      onClick={handleDelete}
                    >
                      <Trash />
                    </Button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Button variant="destructive" onClick={handleLeaveTeam}>
              Rời nhóm
            </Button>
          )}
        </div>
        <Card>
          <CardContent className="mt-4 space-y-4">
            {project.ideaId != null ? (
              <>
                {/* Abbreviation & Vietnamese Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Abbreviations</p>
                    <p className="font-semibold italic">
                      {result?.data?.idea?.abbreviations}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Vietnamese Title</p>
                    <p className="font-semibold italic">
                      {result?.data?.idea?.vietNamName}
                    </p>
                  </div>
                </div>

                {/* Profession & Specialty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Profession</p>
                    <p className="font-semibold italic">
                      {
                        result?.data?.idea?.specialty?.profession
                          ?.professionName
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Specialty</p>
                    <p className="font-semibold italic">
                      {result?.data?.idea?.specialty?.specialtyName}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-500">Description</p>
                  <p className="italic">{result?.data?.idea?.description}</p>
                </div>
                {/* Members */}
                <div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Members</p>
                    <p className="text-gray-500">
                      Available Slot: {availableSlots}
                    </p>
                  </div>

                  {
                    // user?.email == member.user?.email &&
                    isLeader ? (
                      <div className="space-y-3 mt-2">
                        {sortedMembers?.map((member, index) => {
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
                                  {user?.email == member.user?.email ? (
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
                                            href={`/social/blog/profile-social/${member.user?.id}`}
                                          >
                                            Xem profile
                                          </a>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger>
                                        <FontAwesomeIcon
                                          className="size-4"
                                          icon={faEllipsisVertical}
                                        />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteMember(member?.id ?? "")
                                          }
                                        >
                                          Xóa thành viên
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          {" "}
                                          <a
                                            href={`/social/blog/profile-social/${member.user?.id}`}
                                          >
                                            Xem profile
                                          </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          Phân chức leader
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
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
                                        View profile
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  }
                </div>
              </>
            ) : (
              <>
                <TypographyP className="text-red-600">
                  Not have idea yet.{" "}
                  <Button variant="link" className="p-0 m-0" asChild>
                    <Link
                      className="text-red-600 font-semibold"
                      href="/idea/supervisors"
                    >
                      Click hear to view list idea from lecturer
                    </Link>
                  </Button>
                </TypographyP>
                {/* Members */}
                <div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Members</p>
                    <p className="text-gray-500">
                      Available Slot: {availableSlots}
                    </p>
                  </div>

                  {
                    // user?.email == member.user?.email &&
                    isLeader ? (
                      <div className="space-y-3 mt-2">
                        {sortedMembers?.map((member, index) => {
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
                                  {user?.email == member.user?.email ? (
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
                                            href={`/social/blog/profile-social/${member.user?.id}`}
                                          >
                                            Xem profile
                                          </a>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger>
                                        <FontAwesomeIcon
                                          className="size-4"
                                          icon={faEllipsisVertical}
                                        />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleDeleteMember(member?.id ?? "")
                                          }
                                        >
                                          Xóa thành viên
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          {" "}
                                          <a
                                            href={`/social/blog/profile-social/${member.user?.id}`}
                                          >
                                            Xem profile
                                          </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          Phân chức leader
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
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
                                        View profile
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  }
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 space-y-4">
        <div className="space-y-2">
          <TypographyH4>Register group</TypographyH4>
          <Card className="">
            <CardContent className="flex mt-4 flex-col justify-center items-center gap-1">
              <TypographyP>Submit Registation</TypographyP>
              <TypographyMuted>
                NOTICE: Registration request will be informed to other members
              </TypographyMuted>
              <Button asChild>
                <Link href={"/team/submit"}>Submit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <TypographyH4> Request to the project</TypographyH4>

          <Card>
            <CardContent className="flex mt-4 flex-col justify-center items-center gap-1">
              <TypographyP>Any request</TypographyP>
              <TypographyMuted>
                NOTICE: Registration request will be informed to other members
              </TypographyMuted>
              <Button asChild>
                <Link href={"/team/submit"}>Submit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
