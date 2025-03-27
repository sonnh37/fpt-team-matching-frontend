"use client";
import { useEffect, useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project-service";
import { TeamMemberRole } from "@/types/enums/team-member";
import { invitationService } from "@/services/invitation-service";
import { ideaService } from "@/services/idea-service";
import { UpdateCommand } from "@/types/models/commands/_base/base-command";
import { IdeaUpdateCommand } from "@/types/models/commands/idea/idae-update-command";
import { toast } from "sonner";
import { TeamInvitationCommand } from "@/types/models/commands/invitation/invitation-team-command";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { userService } from "@/services/user-service";



const formSchema = z.object({
  englishTitle: z.string().min(2, { message: "English Title must be at least 2 characters." }),
  abbreviation: z.string().max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietnameseTitle: z.string().min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),

})


const UpdateProjectTeam = () => {

  const user = useSelector((state: RootState) => state.user.user);
  const [email, setEmailInvite] = useState<string>("");
  const [MessageInvite, setMessage] = useState<string>("");

  console.log(email, "check email")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishTitle: "",
      abbreviation: "",
      vietnameseTitle: "",
      description: "",
    },
  })
  //goi api bang tanstack
  const {
    data: result,
    refetch

  } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (result?.data) {
      form.reset({
        englishTitle: result.data?.idea?.englishName || "",
        abbreviation: result.data?.idea?.abbreviations || "",
        vietnameseTitle: result.data?.idea?.vietNamName || "",
        description: result.data?.idea?.description || "",
      });
    }
  }, [result?.data, form.reset]);



  // sap xep lai member
  const sortedMembers = result?.data?.teamMembers
    ?.slice() // Tạo bản sao để tránh thay đổi dữ liệu gốc
    .sort((a, b) => (a.role === TeamMemberRole.Leader ? -1 : b.role === TeamMemberRole.Leader ? 1 : 0));

  const availableSlots = (result?.data?.teamSize ?? 0) - (result?.data?.teamMembers?.length ?? 0);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const haha: IdeaUpdateCommand = {
      englishName: values?.englishTitle,
      abbreviations: values?.abbreviation,
      vietNamName: values?.vietnameseTitle,
      description: values?.description
    }


    const result = await ideaService.update(haha);
    if (result?.status === 1) {
      toast("Bạn đã chỉnh sửa thành công")
    }
    console.log("test", result);
  }

  // Team mời thành viên
  const handleInvite = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email người dùng để mời")
      return
    }
    if (availableSlots === 0) {
      toast.error("Hiện tại nhóm đã đủ thành viên")
      return
    }
    const query1: UserGetAllQuery = {
      email: email
    }
    // check email người dùng
    const receiver = await userService.fetchAll(query1);
    console.log("checkUser1", receiver)
    if (receiver.status === 1 && receiver.data) {
      const idReceiver = receiver.data[0].id;
      // check project coi leader nó team không
      const prj = await projectService.getProjectInfo();

      // if (prj.status !== 200) {
      //   toast("Người dùng đã có project hoặc trong team khác")
      //   return
      // }

      const query: TeamInvitationCommand = {
        receiverId: idReceiver ?? "",
        projectId: prj.data?.id ?? "",
        content: "Muốn mời bạn vào nhóm!"
      }
      console.log(query, "checkUser2")
      const result = await invitationService.sendByTeam(query);
      console.log("checkUser3", result)
      if (result.status === 200) {
        toast("Chúc mừng bạn đã gửi lời mời thành công");
        setEmailInvite(""); // Reset email lại để mời tiếp
      } else {
        toast(result.message || "Gửi lời mời thất bại");
        setEmailInvite(""); // Reset email dù có lỗi
        setMessage(result?.message ?? "")
      }
    } else {
      toast("Nguời dùng không tồn tại");
    }


  };

  return (
    <Form  {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 bg-white shadow-md rounded-lg">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Update Group Detail</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium">Profession *</p>
              <p className="text-gray-700">{result?.data?.idea?.specialty?.profession?.professionName} (K15 trở đi)</p>
            </div>
            <div>
              <p className="text-sm font-medium">Specialty *</p>
              <p className="text-gray-700">{result?.data?.idea?.specialty?.specialtyName}</p>
            </div>
          </div>

          {/* English Title */}
          <FormField
            control={form.control}
            name="englishTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>English Title</FormLabel>
                <FormControl>
                  <Input placeholder="What's your idea? "  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abbreviation */}
          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abbreviation</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the abbreviations for your title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vietnamese Title */}
          <FormField
            control={form.control}
            name="vietnameseTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vietnamese Title</FormLabel>
                <FormControl>
                  <Input placeholder="What's your idea in Vietnamese" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="h-40 mb-16">
                <FormLabel>Description</FormLabel>
                <FormControl >
                  <Textarea className="h-full" placeholder="Describe your project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Team Members */}
          <div className="mb-4 mt-4">
            <p className="text-sm font-medium">Team Members</p>
            <p className="text-gray-500 text-sm">Existed Members</p>
            {sortedMembers?.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2">
                <span className="text-sm">{member.user?.email}</span>
                {member.role === TeamMemberRole.Leader ? (
                  <span className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]} | Owner</span>

                ) : (
                  <span className="text-sm text-gray-500">{TeamMemberRole[member.role ?? 0]}</span>
                )}
              </div>
            ))}
          </div>



          <div className="space-y-2">
            <FormItem>
              <label className="text-sm font-medium">Invite Email</label>
              <p className="text-gray-500 text-xs mb-2">
                You can only invite students whose specialties are allowed to work on the same thesis topic as yours in this term.
              </p>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Example@fpt.edu.vn"
                    value={email} // Gán giá trị từ state
                    onChange={(e) => setEmailInvite(e.target.value)} // Cập nhật state khi nhập
                  />
                  <Button type="button" onClick={handleInvite}>Invite</Button>
                </div>
              </FormControl>
              <h3>{MessageInvite}</h3>
            </FormItem>
          </div>
          {/* Submit Button */}
          <button type="submit" className="w-full bg-purple-400 text-white mt-6 p-3 rounded-lg hover:bg-purple-500 transition">
            Update Idea
          </button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProjectTeam;
