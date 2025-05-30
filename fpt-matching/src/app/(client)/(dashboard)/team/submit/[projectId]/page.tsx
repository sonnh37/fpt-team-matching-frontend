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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormInput, FormSwitch } from "@/lib/form-custom-shadcn";
import { projectService } from "@/services/project-service";
import { professionService } from "@/services/profession-service";
import { useQuery } from "@tanstack/react-query";
import {useCurrentRole, useCurrentSemester} from "@/hooks/use-current-role";
import { useSelectorUser } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { userService } from "@/services/user-service";
import { TeamMemberRole } from "@/types/enums/team-member";
import { toast } from "sonner";
import { useConfirm } from "@/components/_common/formdelete/confirm-context";


// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];


const formSchema = z.object({
  englishName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Anh" })
    .min(2, { message: "Tên tiếng Anh phải có ít nhất 2 ký tự" }),

  // teamSize: z
  //   .number({
  //     required_error: "Vui lòng chọn số lượng thành viên",
  //     invalid_type_error: "Số lượng thành viên phải là số",
  //   })
  //   .gte(4, { message: "Số lượng thành viên tối thiểu là 4" }),

  abbreviation: z
    .string({ required_error: "Vui lòng nhập tên viết tắt" })
    .max(20, { message: "Tên viết tắt không được quá 20 ký tự" }),

  vietNameseName: z
    .string({ required_error: "Vui lòng nhập tên tiếng Việt" })
    .min(2, { message: "Tên tiếng Việt phải có ít nhất 2 ký tự" }),

  description: z
    .string({ required_error: "Vui lòng nhập mô tả" })
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" }),

  fileschema: z
    .custom<File>((val) => val instanceof File, {
      message: "Vui lòng chọn tệp đính kèm",
    })
    .refine(
      (file) => {
        const fileName = file.name.toLowerCase();
        return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      },
      {
        message: "Chỉ chấp nhận tệp .doc, .docx hoặc .pdf",
      }
    ),

  specialtyId: z.string().optional(),

  mentorId: z
    .string({ required_error: "Vui lòng chọn giảng viên hướng dẫn" })
    .optional(),

  subMentorId: z.string().optional(),

  enterpriseName: z
    .string()
    .min(2, { message: "Tên doanh nghiệp phải có ít nhất 2 ký tự" })
    .optional(),

  isEnterpriseTopic: z.boolean().default(false),
});




const SubmitTopic = () => {
  const { projectId } = useParams();
  const role = useCurrentRole();
  const user = useSelectorUser();
  const currentSemester =  useCurrentSemester().currentSemester
  // Check user role
  const isStudent = role == "Student";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const query: UserGetAllQuery = {
    role: "Mentor",
    isPagination: false,
  };

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["getUsersByRole", query],
    queryFn: () => userService.getAll(query),
    refetchOnWindowFocus: false,
  });
  const {
    data: result_project,
    isLoading: isLoadingProject,
    error: errorProject,
  } = useQuery({
    queryKey: ["getProjectInfo"],
    queryFn: () => projectService.getById(projectId.toString()),
    enabled: !!isStudent, // Only fetch if student
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (result_project?.data && result_project?.data.topic) {
      const topic = result_project.data.topic;

      form.reset({
        mentorId: topic.mentorId ?? "",
        subMentorId: topic.subMentorId ?? "",
        englishName: topic.englishName ?? "",
        abbreviation: topic.abbreviation ?? "",
        vietNameseName: topic.vietNameseName ?? "",
        description: topic.description ?? "",
        specialtyId: topic.specialty?.id ?? "", // ID chuyên ngành
        // fileshcema: topic.fileUrl ?? "", // file không gán vì không có kiểu file trả về từ API
      });
    }
  }, [result_project?.data]);


  const mentor = usersData?.data?.results?.find((u) => u.id === result_project?.data?.topic?.mentorId);
  const subMentor = usersData?.data?.results?.find((u) => u.id === result_project?.data?.topic?.subMentorId);

  console.log(mentor, "test1")
  console.log(subMentor, "test2")
  const project = result_project?.data;
  const teamMembers = project?.teamMembers;

  const {
    data: professionsData,
    isLoading: isLoadingProfessions,
    error: errorProfessions,
  } = useQuery({
    queryKey: ["getAllProfessions"],
    queryFn: () => professionService.getAll(),
    refetchOnWindowFocus: false,
  });

  const confirm = useConfirm()
  const handleSubmit = async (projectId: string) => {

    const confirmed = await confirm({
      title: "Bạn có muốn nộp đơn này lên hệ thống",
      description: "Khi nộp nhóm bạn sẽ khóa lại",
      confirmText: "Có,đồng ý",
      cancelText: "Không,cảm ơn",
    });
    if (!currentSemester){
      toast.error("Không tìm thấy học kỳ trong Workspace")
      return
    }
    if ((project?.teamSize ?? 0) < currentSemester.minTeamSize) {
      toast.error("Nhóm chưa đủ số lượng thành viên");
      return
    }
    if ((project?.teamSize ?? 0) > currentSemester.maxTeamSize) {
      toast.error("Nhóm đã vượt quá số lượng thành viên");
      return
    }
    if (result_project?.data?.topicId) {
      toast.error("Nhóm chưa có đề tài");
      return
    }
    if (confirmed) {
      if (projectId) {
        const result = await projectService.submitBlockProjectByStudent(projectId);
        if (result?.status === 1) {
          toast.success("Nộp đề tài thành công");
          // TODO: Gọi lại data / chuyển trang nếu cần
        } else {
          toast.error(result?.message || "Có lỗi xảy ra khi nộp đề tài");
        }
      }
    }
  };



  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-1 md:p-6 flex justify-center"
      >
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Đơn nộp xác thực lại đề tài và nhóm
            </CardTitle>
            {/*<CardDescription className="text-muted-foreground">*/}
            {/*  Điền đầy đủ thông tin bên dưới để đăng ký ý tưởng dự án. Tất cả*/}
            {/*  các trường đều bắt buộc trừ khi có ghi chú khác.*/}
            {/*</CardDescription>*/}
          </CardHeader>

          <CardContent className="space-y-6">


            {/* Profession & Specialty Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-bold">Thông tin học thuật</h3>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Ngành học</FormLabel>
                  <Select
                    value={result_project?.data?.topic?.specialty?.professionId}
                    disabled
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn ngành học" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionsData?.data?.results?.map((pro) => (
                        <SelectItem key={pro.id} value={pro.id!}>
                          {pro.professionName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormField
                  control={form.control}
                  name="specialtyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chuyên ngành</FormLabel>
                      <Select value={field.value} disabled >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn chuyên ngành" />
                        </SelectTrigger>
                        <SelectContent>
                          {professionsData?.data?.results
                            ?.find(
                              (p) =>
                                p.id ===
                                result_project?.data?.topic?.specialty?.professionId
                            )
                            ?.specialties?.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id!}>
                                {spec.specialtyName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </div>

            {/* Enterprise Name (conditionally shown) */}
            {/* {isEnterpriseTopic && (
            <div className="space-y-4 rounded-lg border p-4">
              <FormInput
                form={form}
                name="enterpriseName"
                label="Tên Doanh nghiệp"
                placeholder="Nhập tên doanh nghiệp tài trợ"
                description="Tên công ty tài trợ cho dự án này"
              />
            </div>
          )} */}

            {/* Topic Details Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-bold">Chi tiết đề tài</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên tiếng Anh</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên dự án bằng tiếng Anh"
                          {...field}
                          className="dark:bg-muted/50"
                          readOnly
                        />
                      </FormControl>
                      {/*<FormDescription>*/}
                      {/*  Tên chính thức của dự án*/}
                      {/*</FormDescription>*/}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vietNameseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên tiếng Việt</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tên dự án bằng tiếng Việt"
                          {...field}
                          className="dark:bg-muted/50"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="abbreviation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viết tắt</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tên viết tắt của dự án"
                        {...field}
                        className="dark:bg-muted/50"
                        readOnly
                      />
                    </FormControl>
                    {/*<FormDescription>Tối đa 20 ký tự</FormDescription>*/}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về dự án của bạn..."
                        {...field}
                        className="min-h-[120px] dark:bg-muted/50"
                        readOnly
                      />
                    </FormControl>
                    {/*<FormDescription>Tối thiểu 10 ký tự</FormDescription>*/}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Team & File Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-bold">Nhóm & Tài liệu</h3>

              {/* Mentor Selection - Only for Students */}
              {isStudent && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mentorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giảng viên hướng dẫn</FormLabel>
                        <p>{mentor ? `${mentor.lastName} ${mentor.firstName} (${mentor.code})` : "Không có"}</p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subMentorId"
                    render={({ field }) => {
                      const mentorId = form.watch("mentorId");
                      const filteredUsers = usersData?.data?.results?.filter(
                        (user) => user.id !== mentorId
                      );

                      return (
                        <FormItem>
                          <FormLabel>
                            Giảng viên hướng dẫn 2 (Tùy chọn)
                          </FormLabel>
                          <p>{subMentor ? `${subMentor.lastName} ${subMentor.firstName} (${subMentor.code})` : "Không có"}</p>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}

              {/* File Upload */}
              <FormField
                control={form.control}
                name="fileschema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tài liệu Dự án</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {project?.topic?.fileUrl ? (
                          <a href={project?.topic?.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 border-b-2 border-blue-400">
                            Link file
                          </a>

                        ) : (
                          <div>Không có file</div>
                        )}

                      </div>
                    </FormControl>
                    {/*<FormDescription>*/}
                    {/*  Định dạng chấp nhận: {ALLOWED_EXTENSIONS.join(", ")} (tối*/}
                    {/*  đa 10MB)*/}
                    {/*</FormDescription>*/}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Current User Info - Only for Students */}
            {isStudent && (
              <div className="rounded-lg border p-4 space-y-2">
                <h3 className="text-lg font-bold">Thành viên Nhóm</h3>
                {/*<p className="text-sm text-muted-foreground">*/}
                {/*  Bạn sẽ là trưởng nhóm của dự án này*/}
                {/*</p>*/}
                <>
                  {teamMembers?.map((member, index) => {
                    const userInTeam = member.user;
                    if (!userInTeam || member.leaveDate != null) return null;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {userInTeam.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {userInTeam.lastName} {userInTeam.firstName}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {TeamMemberRole[member.role ?? 0]}
                        </span>
                      </div>
                    );
                  })}
                </>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              variant={"secondary"}
              type="button"
            >
              Hủy bỏ
            </Button>
            <Button type="button" onClick={() => handleSubmit(result_project?.data?.id ?? "")} className="w-full ml-2 md:w-auto">
              Nộp ý tưởng
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SubmitTopic;
