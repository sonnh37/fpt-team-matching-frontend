'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [userTeam, setUserTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Gọi API lấy thông tin team
  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    projectService
      .fetchById(teamId?.toString())
      .then((res) => {
        setTeamInfo(res?.data ?? null);
        setTeamMembers(res.data?.teamMembers || []);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [teamId]);

  const [isInvited, setIsInvited] = useState<boolean | null>(null);

  console.log("test", teamInfo?.id?.toString())

  useEffect(() => {
    
    const checkInvitation = async () => {
      if(teamInfo?.id?.toString()){
      const result = await invitationService.checkMemberProject(teamInfo?.id?.toString());
      setIsInvited(result);
      }
      setIsInvited(null);
    };

    checkInvitation();
  }, [teamInfo?.id]);


  const check = teamMembers.find(x => x.user?.email == user?.email);

  // Sắp xếp leader lên đầu
  const sortedMembers = [...teamMembers].sort((a, b) =>
    a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0
  );

  //  Tính số slot trống
  const availableSlots = (teamInfo?.teamSize ?? 0) - (teamMembers.length ?? 0);

  return (

    <div>
      <div className="flex flex-row">
        <div className="basic-3/5">
          <div className=" text-3xl ml-4 text-blue-600 font-sans " >Group Detail</div>
          <Card className="mt-5 p-6 bg-white shadow-lg rounded-lg ">
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                {/* Tiêu đề nhóm */}
                <div className="title">
                  <h2 className="text-xl font-semibold">{teamInfo?.name}</h2>
                  <p className="text-sm text-gray-500">Created at: {formatDate(teamInfo?.createdDate)}</p>
                </div>

                <div className="button-request">

                  {
                  (availableSlots > 0 && !check ) && (
                    isInvited ? (
                      <button className="bg-blue-500 text-xl p-2 hover:bg-blue-200">Cancel</button>
                    ) : (
                      <button className="bg-blue-500- text-xl p-2  hover:bg-blue-200">Request</button>
                    )
                  )
                  }
                </div>


              </div>

              {/* Abbreviation & Vietnamese Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Abbreviations</p>
                  <p className="font-semibold italic">{teamInfo?.idea?.abbreviations}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vietnamese Title</p>
                  <p className="font-semibold italic">{teamInfo?.idea?.vietNamName}</p>
                </div>
              </div>

              {/* Profession & Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Profession</p>
                  <p className="font-semibold italic">{teamInfo?.idea?.specialty?.profession?.professionName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Specialty</p>
                  <p className="font-semibold italic">{teamInfo?.idea?.specialty?.specialtyName}</p>
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
                  <p className="text-gray-500">Available Slot: {availableSlots}</p>
                </div>

                <div className="space-y-3 mt-2">
                  {sortedMembers.map((member, index) => {

                    const initials = `${member.user?.lastName?.charAt(0).toUpperCase() ?? ""
                      }`;


                    return (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 rounded-lg">
                            <AvatarImage src={member.user?.avatar!} alt={member.user?.email!} />
                            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold">{member.user?.email}</p>
                            <p className="text-sm text-gray-500">{member.user?.firstName}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {member.role === TeamMemberRole.Leader ? (
                            <p className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]} | Owner</p>

                          ) : (
                            <p className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]}</p>
                          )}
                          <div className="relative ml-3">

                            <DropdownMenu>
                              <DropdownMenuTrigger ><FontAwesomeIcon className="size-4" icon={faEllipsisVertical} /></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem><a href={`/profile-detail/${member.user?.id}`}>Xem profile</a></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    )
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
