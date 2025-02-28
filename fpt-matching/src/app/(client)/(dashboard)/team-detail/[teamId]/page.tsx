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

export default function TeamInfoDetail() {
  const { teamId } = useParams();
  console.log("sonngu", teamId);

  // Lấy thông tin user từ Redux store
  const user = useSelector((state: RootState) => state.user.user);

  // 🛠️ ✅ Gọi API lấy thông tin team bằng useQuery (đúng cách)
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getTeamInfo", teamId], // `teamId` vào key để caching đúng
    queryFn: () => projectService.fetchById(teamId?.toString() ?? ""), // ✅ Phải là một function
    refetchOnWindowFocus: false,
    enabled: !!teamId, // ✅ Chỉ chạy query nếu có `teamId`
  });

  // Nếu đang load hoặc có lỗi thì return sớm
  if (isLoading) return <LoadingComponent />;
  if (isError || !result?.data) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  // 🛠️ ✅ Gọi API lấy team member của user (Đúng cách)
  const { data: result1 } = useQuery({
    queryKey: ["getTeammemberById", user?.id], // Định danh dữ liệu đúng
    queryFn: () => teammemberService.fetchById(user?.id ?? ""),
    refetchOnWindowFocus: false,
    enabled: !!user?.id, // ✅ Chỉ chạy nếu `user?.id` tồn tại
  });

  // 🛠️ ✅ Kiểm tra `hasTeam` đúng cách
  const hasTeam = !!result1?.data; // ✅ Chuyển đổi thành boolean

  // 🛠️ ✅ Xử lý logic sắp xếp
  const sortedMembers = result.data.teamMembers
    ?.slice()
    .sort((a, b) => (a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0));

  // 🛠️ ✅ Tính số slot trống
  const availableSlots = (result.data.teamSize ?? 0) - (result.data.teamMembers?.length ?? 0)

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
                  <h2 className="text-xl font-semibold">{result.data.name}</h2>
                  <p className="text-sm text-gray-500">Created at: {formatDate(result.data.createdDate)}</p>
                </div>

                <div className="button-request"> 
               
               { availableSlots>0  ?(
               <button>Request</button>):(
                <button>Cancel</button>)

               }
                </div>
  
          
              </div>

              {/* Abbreviation & Vietnamese Title */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Abbreviations</p>
                  <p className="font-semibold italic">{result.data.idea?.abbreviations}</p>
                </div>
                <div>
                  <p className="text-gray-500">Vietnamese Title</p>
                  <p className="font-semibold italic">{result.data.idea?.vietNamName}</p>
                </div>
              </div>

              {/* Profession & Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Profession</p>
                  <p className="font-semibold italic">{result.data.idea?.specialty?.profession?.professionName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Specialty</p>
                  <p className="font-semibold italic">{result.data.idea?.specialty?.specialtyName}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-500">Description</p>
                <p className="italic">{result.data?.idea?.description}</p>
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
                                      <DropdownMenuItem>View profile</DropdownMenuItem>
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
