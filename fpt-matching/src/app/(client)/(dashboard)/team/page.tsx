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
import ErrorSystem from "@/components/_common/errors/error-system";
import { format } from "path";
import { formatDate } from "@/lib/utils";
import { TeamMemberRole } from "@/types/enums/team-member";
import { teardownHeapProfiler } from "next/dist/build/swc";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

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
  //lay thong tin tu redux luc dang nhap
  const user = useSelector((state: RootState) => state.user.user)
  //goi api bang tanstack
  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }
  if (!result || !result.data) {
    return <ErrorSystem />;
  }

  //check xem thang dang nhap coi no phai member va la leader khong
  const checkRole = result?.data?.teamMembers?.find(member => member.userId === user?.id)?.role === TeamMemberRole.Leader;
  // sap xep lai member
  const sortedMembers = result?.data?.teamMembers
    ?.slice() // Tạo bản sao để tránh thay đổi dữ liệu gốc
    .sort((a, b) => (a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0));

  const availableSlots = (result?.data?.teamSize ?? 0) - (result?.data?.teamMembers?.length ?? 0);
  // mot check saooo t hua lam


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


  return (

    <div>
      <div className="flex flex-row">
        <div className="basic-3/5">
          <div className=" text-3xl ml-4 text-blue-600 font-sans " >My Group</div>
          <Card className="mt-5 p-6 bg-white shadow-lg rounded-lg ">
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                {/* Tiêu đề nhóm */}
                <div className="title">
                  <h2 className="text-xl font-semibold">{result.data.name}</h2>
                  <p className="text-sm text-gray-500">Created at: {formatDate(result.data.createdDate)}</p>
                </div>
                <div className="button0act flex ml-4">
                  <Modal>
                    <ModalTrigger className='border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-purple-700 hover:text-white'>
                      <button className="  w-full text-gray-70 focus:outline-none focus:shadow-outline text-start ">
                        +Update Idea
                      </button>

                    </ModalTrigger>

                    <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[70%] overflow-auto'>
                      <ModalContent>
                        <UpdateProjectTeam />
                      </ModalContent>x
                    </ModalBody>

                  </Modal>
                  <button className="border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-purple-700 hover:text-white  rounded-md" onClick={handleDelete}>
                    +Delete idea
                  </button>

                  {/* <Modal>
                <ModalTrigger className='border-purple-400 border-4 p-1 mr-3 text-sm hover:bg-purple-700 hover:text-white'>
                  <button className="  w-full text-gray-70 focus:outline-none focus:shadow-outline text-start ">
                   +Delete Idea
                  </button>

                </ModalTrigger>

                <ModalBody className='min-h-[60%] max-h-[90%] md:max-w-[70%] overflow-auto'>
                  <ModalContent>
                   <CreateProjectForm />
                  </ModalContent>x
                </ModalBody>

              </Modal> */}

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

                {
                  // user?.email == member.user?.email &&
                  checkRole ? (
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
                                <p className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]} | Origin</p>

                              ) : (
                                <p className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]}</p>
                              )}
                              <div className="relative ml-3">
                                {user?.email == member.user?.email ? (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger ><FontAwesomeIcon className="size-4" icon={faEllipsisVertical} /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem>View profile</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (

                                  <DropdownMenu>
                                    <DropdownMenuTrigger ><FontAwesomeIcon className="size-4" icon={faEllipsisVertical} /></DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem>Xóa thành viên</DropdownMenuItem>
                                      <DropdownMenuItem>Xem profile</DropdownMenuItem>
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
                      {result.data.teamMembers.map((member, index) => {
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
                                <p className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]} | Origin</p>

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
        <div className=" basis-2/5">
          <div className=" text-2xl ml-4 text-blue-600 font-sans " >Register Group</div>
          <Card className="mt-5 ml-2 p-1 pt-6 bg-white shadow-lg rounded-lg ">
            <CardContent className="flex flex-col justify-center items-center space-y-3">
              <div className=" text-blue-600 font-bold"> Submit Registation </div>
              <div className=" font-bold text-sm"> NOTICE: Registration request will be informed to other members</div>
              <button className="bg-blue-600 text-white">Submit</button>
            </CardContent>
          </Card>
          <div className=" text-2xl my-4 ml-2 text-blue-600 font-sans " >Request to the project</div>
          <Card className="mt-5 ml-2 p-1 pt-6 bg-white shadow-lg rounded-lg  ">
            <CardContent className="flex flex-col justify-center items-center space-y-3">
              <div className=" text-blue-600 font-bold"> Any request </div>
              <div className=" font-bold text-sm"> NOTICE: Registration request will be informed to other members</div>
              <button className="bg-blue-600 text-white">Submit</button>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
