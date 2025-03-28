"use client";
import { Card, CardContent } from "@/components/ui/card";
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
import UpdateProjectTeam from "../idea/updateidea/page";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { LoadingComponent } from "@/components/_common/loading-page";
import { format } from "path";
import { formatDate } from "@/lib/utils";
import { TeamMemberRole } from "@/types/enums/team-member";
import { teardownHeapProfiler } from "next/dist/build/swc";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { TypographyLarge } from "@/components/_common/typography/typography-large";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { useRouter } from "next/navigation";
import { teammemberService } from "@/services/team-member-service";
import ErrorSystem from "@/components/_common/errors/error-system";
import PageNoTeam from "./page-no-team/page";
import { useEffect } from "react";
import { TypographyLead } from "@/components/_common/typography/typography-lead";
import { TypographyH3 } from "@/components/_common/typography/typography-h3";
import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/_common/typography/typography-muted";
import Link from "next/link";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";

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

  if (isLoading) return <LoadingComponent />;
  if (!result || isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  if (result?.status == -1) {
    return <PageNoTeam />;
  }

  const project = result?.data;
  if (!project) return <PageNoTeam />;

  const infoMember = project?.teamMembers?.find(
    (member) => member.userId === user?.id
  );

  //check xem thang dang nhap coi no phai member va la leader khong
  const checkRole =
    result?.data?.teamMembers?.find((member) => member.userId === user?.id)
      ?.role === TeamMemberRole.Leader;

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
  const confirm = useConfirm();
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
      toast.success("Item deleted!");
      // Thực hiện xóa
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
      teammemberService.deletePermanent(id);
      // Người dùng chọn Yes
      toast("Member is deleted!");
      // Thực hiện xóa
    } else {
      // Người dùng chọn No
      toast("User canceled!");
    }
  }

  return (
    <div className="grid grid-cols-3 p-4 gap-4">
      <div className="col-span-2 space-y-2">
        <div className="flex w-full justify-between items-center">
          <TypographyH3>Team Information</TypographyH3>
          {infoMember && infoMember?.role === TeamMemberRole.Leader ? (
            <>
              {project.ideaId != null ? (
                <>
                  <div className="flex items-center">
                    <Modal>
                      <ModalTrigger className="=">
                        <Button variant="outline">Cập nhật Idea</Button>
                      </ModalTrigger>

                      <ModalBody className="min-h-[60%] max-h-[90%] md:max-w-[70%] overflow-auto">
                        <ModalContent>
                          <UpdateProjectTeam />
                        </ModalContent>
                      </ModalBody>
                    </Modal>
                  </div>
                </>
              ) : (
                <></>
              )}

              <Button variant="destructive" onClick={handleDelete}>
                Xóa nhóm
              </Button>
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
                    checkRole ? (
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
                                            href={`/profile-detail/${member.user?.id}`}
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
                                            href={`/profile-detail/${member.user?.id}`}
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
                  <Link
                    className="border-b-2 border-red-600"
                    href="/idea/supervisors"
                  >
                    Click hear to view list idea from lecturer
                  </Link>
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
                    checkRole ? (
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
                                            href={`/profile-detail/${member.user?.id}`}
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
                                            href={`/profile-detail/${member.user?.id}`}
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
