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
import UpdateProjectTeam
  from "../idea/updateidea/page";
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
import { useRouter } from "next/navigation"
import { teammemberService } from "@/services/team-member-service";
import ErrorSystem from "@/components/_common/errors/error-system";
import PageNoTeam from "./page-no-team/page";
import { useEffect } from "react";


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
  const router = useRouter()
  //lay thong tin tu redux luc dang nhap
  const user = useSelector((state: RootState) => state.user.user)
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


  // Query để lấy thông tin thành viên
  const {
    data: infoMember,
  } = useQuery({
    queryKey: ["getTeamMember"],
    queryFn: teammemberService.getteammemberbyuserid,
    refetchOnWindowFocus: false,
  });



  if (isLoading) return <LoadingComponent />;
  if (!result || isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  if (result?.status != 1) {
    return router.push("/team/page-no-team");
  }





  //check xem thang dang nhap coi no phai member va la leader khong
  const checkRole = result?.data?.teamMembers?.find(member => member.userId === user?.id)?.role === TeamMemberRole.Leader;
  // sap xep lai member
  // const sortedMembers = result?.data?.teamMembers
  //   ?.slice() // Tạo bản sao để tránh thay đổi dữ liệu gốc
  //   .sort((a, b) => {
  //     if (a.role === TeamMemberRole.Leader && b.role !== TeamMemberRole.Leader) {
  //       return -1; // `a` là Leader, đưa lên đầu
  //     }
  //     if (b.role === TeamMemberRole.Leader && a.role !== TeamMemberRole.Leader) {
  //       return 1; // `b` là Leader, đưa lên đầu
  //     }
  //     return 0; // Giữ nguyên thứ tự
  //   });


    const teamMembersss = result?.data?.teamMembers ?? [];
  // Tách Leader ra trước
  const leaders = teamMembersss.filter(member => member.role === TeamMemberRole.Leader);
  const others = teamMembersss.filter(member => member.role !== TeamMemberRole.Leader);

  // Ghép lại, đảm bảo Leader luôn ở đầu
  const sortedMembers = [...leaders, ...others];



  const availableSlots = (result?.data?.teamSize ?? 0) - (result?.data?.teamMembers?.length ?? 0);
  // mot check saooo t hua lam



  //Đây là form delete trả về true false tái sử dụng được
  const confirm = useConfirm()
  async function handleDelete() {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      confirmText: "Yes, delete it",
      cancelText: "No",
    })

    if (confirmed) {
      // Người dùng chọn Yes
      toast("Item deleted!")
      // Thực hiện xóa
    } else {
      // Người dùng chọn No
      toast("User canceled!")
    }
  }

  async function handleLeaveTeam() {
    // Gọi confirm để mở dialog
    const confirmed = await confirm({
      title: "Delete Item",
      description: "Bạn có muốn rời nhóm không ?",
      confirmText: "Có,tôi muốn",
      cancelText: "Không",
    })

    if (confirmed) {
      const data = await teammemberService.leaveTeam();
      if(data.status === 1){
      toast("Bạn đã rời nhóm")
      refetch();
      
      }else{
        toast("Rời nhóm thất bại")
      }
      // Thực hiện xóa
    } else {
      // Người dùng chọn No
      toast("User canceled!")
    }
  }

  async function handleDeleteMember(id: string) {
    console.log("testid", id)
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
    })

    if (confirmed) {
      teammemberService.deletePermanent(id)
      // Người dùng chọn Yes
      toast("Member is deleted!")
      // Thực hiện xóa
    } else {
      // Người dùng chọn No
      toast("User canceled!")
    }
  }




  return (


    <div className="flex flex-row max-h-max">
      <div className="w-4/5">
        <div className=" text-3xl ml-4 text-blue-600 font-sans " >My Group</div>
        <Card className="mt-5 p-6 bg-white shadow-lg rounded-lg ">
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              {/* Tiêu đề nhóm */}
              <div className="title">
                <h2 className="text-xl font-semibold">{result?.data?.teamName}</h2>
                <p className="text-sm text-gray-500">Created at: {formatDate(result?.data?.createdDate)}</p>
              </div>

              {infoMember?.data && infoMember?.data?.role === TeamMemberRole.Leader ?  (
                <div className="button0act flex ml-4">
                  <Modal>
                    <ModalTrigger className='border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-purple-700 hover:text-white'>
                      <button className="w-full text-gray-70 focus:outline-none focus:shadow-outline text-start">
                        +Update Idea
                      </button>
                    </ModalTrigger>

                    <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[70%] overflow-auto'>
                      <ModalContent>
                        <UpdateProjectTeam />
                      </ModalContent>
                    </ModalBody>
                  </Modal>

                  <button
                    className="border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-purple-700 hover:text-white rounded-md"
                    onClick={handleDelete}
                  >
                    +Delete Idea
                  </button>
                </div>
              ):(

                <div className="button0act flex ml-4">
                <button
                    className="border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-red-700 hover:text-white rounded-md"
                    onClick={handleLeaveTeam}
                  >
                    Rời nhóm
                  </button>
               </div>
              )}


            </div>

            {/* Abbreviation & Vietnamese Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Abbreviations</p>
                <p className="font-semibold italic">{result?.data?.idea?.abbreviations}</p>
              </div>
              <div>
                <p className="text-gray-500">Vietnamese Title</p>
                <p className="font-semibold italic">{result?.data?.idea?.vietNamName}</p>
              </div>
            </div>

            {/* Profession & Specialty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Profession</p>
                <p className="font-semibold italic">{result?.data?.idea?.specialty?.profession?.professionName}</p>
              </div>
              <div>
                <p className="text-gray-500">Specialty</p>
                <p className="font-semibold italic">{result?.data?.idea?.specialty?.specialtyName}</p>
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
                <p className="text-gray-500">Available Slot: {availableSlots}</p>
              </div>

              {
                // user?.email == member.user?.email &&
                checkRole ? (
                  <div className="space-y-3 mt-2">
                    {sortedMembers?.map((member, index) => {

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
                              {user?.email == member.user?.email ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger ><FontAwesomeIcon className="size-4" icon={faEllipsisVertical} /></DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <a href={`/profile-detail/${member.user?.id}`}>Xem profile</a>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (

                                <DropdownMenu>
                                  <DropdownMenuTrigger ><FontAwesomeIcon className="size-4" icon={faEllipsisVertical} /></DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleDeleteMember(member?.id ?? "")}>Xóa thành viên</DropdownMenuItem>
                                    <DropdownMenuItem>  <a href={`/profile-detail/${member.user?.id}`}>Xem profile</a></DropdownMenuItem>
                                    <DropdownMenuItem>Phân chức leader</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    {sortedMembers.map((member, index) => {
                      const initials = `${member.user?.lastName?.charAt(0).toUpperCase() ?? ""}`;
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
                )}

            </div>
          </CardContent>
        </Card>
      </div>
      <div className=" w-1/5">
        <div className=" text-2xl ml-4 text-blue-600 font-sans " >Register Group</div>
        <div className="h-full w-full">
          <Card className="mt-5 ml-2 p-1 pt-6 bg-white shadow-lg rounded-lg  max-w">
            <CardContent className="flex flex-col justify-center items-center space-y-3">
              <div className=" text-blue-600 font-bold"> Submit Registation </div>
              <div className=" font-bold text-sm"> NOTICE: Registration request will be informed to other members</div>
              <a href="/team/submit" className="bg-blue-600 text-white p-2">Submit</a>
            </CardContent>
          </Card>
          <div className=" text-2xl my-4 ml-2 text-blue-600 font-sans " >Request to the project</div>
          <Card className="mt-5 ml-2 p-1 pt-6 bg-white shadow-lg rounded-lg  ">
            <CardContent className="flex flex-col justify-center items-center space-y-3">
              <div className=" text-blue-600 font-bold"> Any request </div>
              <div className=" font-bold text-sm"> NOTICE: Registration request will be informed to other members</div>
              <button className="bg-blue-600 text-white p-2">Submit</button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>


  );
}
