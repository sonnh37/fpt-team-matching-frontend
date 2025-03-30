"use client";
import { useState, useEffect } from "react";
import { boolean, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IdeaCreateCommand } from "@/types/models/commands/idea/idea-create-command";
import { ideaService } from "@/services/idea-service";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { userService } from "@/services/user-service";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { useRouter } from "next/navigation";
import { LoadingComponent } from "@/components/_common/loading-page";
import { resolve } from "path";
import { projectService } from "@/services/project-service";
import { IdeaStatus } from "@/types/enums/idea";
import PageIsIdea from "../idea-is-exist/page";
import { Profession } from "@/types/profession";
import { professionService } from "@/services/profession-service";
import { profilestudentService } from "@/services/profile-student-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ErrorSystem from "@/components/_common/errors/error-system";
import { Label } from "@/components/ui/label";
import { TypographyP } from "@/components/_common/typography/typography-p";
import {
  FormInput,
  FormSelectObject,
  FormSwitch,
} from "@/lib/form-custom-shadcn";
import { useSelectorUser } from "@/hooks/use-auth";
import { semesterService } from "@/services/semester-service";
import { stageideaService } from "@/services/stage-idea-service";
// Các đuôi file cho phép
const ALLOWED_EXTENSIONS = [".doc", ".docx", ".pdf"];

const formSchema = z.object({
  //  inviteEmail: z.string().email({ message: "Invalid email format." }),
  englishName: z
    .string()
    .min(2, { message: "English Title must be at least 2 characters." }),
  maxTeamSize: z
    .number({ invalid_type_error: "Team size must be a number." })
    .gte(4, { message: "Team size must be at least 4." }),
  abbreviations: z
    .string()
    .max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietNamName: z
    .string()
    .min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  fileschema: z
    .custom<File>((val) => val instanceof File) // Xác định đây là kiểu File
    .refine(
      (file) => {
        const fileName = file.name.toLowerCase();
        return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      },
      {
        message: "File must be .doc, .docx, or .pdf",
      }
    ),
  specialtyId: z.string().optional(),
  enterpriseName: z
    .string()
    .min(2, { message: "Enterprise name must be at least 2 characters." })
    .optional(),
  isEnterpriseTopic: z.boolean().default(false),
});

const CreateProjectForm = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] =
    useState<Profession | null>(null);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isNotUpdateSettingYet, setIsNotUpdateSettingYet] = useState(false);
  const [showPageIsIdea, setShowPageIsIdea] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxTeamSize: 4,
    },
  });

  const query: UserGetAllQuery = {
    role: "Lecturer",
  };

  const { data: result } = useQuery({
    queryKey: ["getUsersByRole", query],
    queryFn: () => userService.fetchAll(query),
    refetchOnWindowFocus: false,
  });

  const users = result?.data ?? [];
  const user = useSelectorUser();
  if (!user) return;

  const isStudent = user?.userXRoles.some((m) => m.role?.roleName == "Student");
  const isLecturer = user?.userXRoles.some(
    (m) => m.role?.roleName == "Lecturer"
  );

  useEffect(() => {
    if (users.length > 0 && users[0].id !== undefined) {
      setSelectedUserId(users[0].id);
    }
  }, [users]);

  useEffect(() => {
    async function checkIdea() {
      try {
        const [profileRes, professionsRes] = await Promise.all([
          profilestudentService.fetchProfileByCurrentUser(),
          professionService.fetchAll(),
        ]);
        setProfessions(professionsRes.data ?? []);

        form.setValue("specialtyId", profileRes.data?.specialtyId);

        const profess = professionsRes.data?.find(
          (m) => m.id === profileRes.data?.specialty?.professionId
        );
        if (!profess) {
          setIsNotUpdateSettingYet(true);
        }
        setSelectedProfession(profess ?? null);

        const ideaExists = await ideaService.getIdeaByUser();
        const teamExist = await projectService.getProjectInfo();
        //check xem user co idea nao dang pending or Done khong
        const isPendingOrDone = ideaExists.data?.some(
          (m) => m.status !== IdeaStatus.Rejected
        );
        if ((ideaExists.data && isPendingOrDone) || teamExist.data) {
          if (isStudent) {
            setShowPageIsIdea(true);
          }
        }

        // #region Check semester and stage idea
        // const res_semester = await semesterService.fetchLatest();

        // const isBeforeEndDateInSemesterLatest = res_semester.data?.endDate
        //   ? new Date(res_semester.data?.endDate).getTime() > Date.now()
        //   : false;
        // if (isBeforeEndDateInSemesterLatest) {
        //   const res_stageIdea = await stageideaService.fetchLatest();

        //   const isInStageIdea =
        //     res_stageIdea.data?.startDate && res_stageIdea.data?.endDate
        //       ? Date.now() >=
        //           new Date(res_stageIdea.data.startDate).getTime() &&
        //         Date.now() <= new Date(res_stageIdea.data.endDate).getTime()
        //       : false;

        //   if (isInStageIdea) {
        //     // Đang trong giai đoạn được tạo idea
        //   } else {
        //     // toast.warning("Not in stage idea!");
        //     // setShowPageIsIdea(true);
        //   }
        // } else {
        //   toast.warning("Semester is ended!");
        //   setShowPageIsIdea(true);
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkIdea();
  }, []);

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorSystem />;

  //Tao idea
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isStudent) {
        const ideacreate: IdeaCreateCommand = {
          ...values,
          mentorId: selectedUserId ?? undefined,
          isEnterpriseTopic: false,
          enterpriseName: undefined,
        };

        const res = await ideaService.createIdeaByStudent(ideacreate);
        if (res.status == 1) {
          toast.success(res.message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowPageIsIdea(true);
        }
        return;
      }

      if (isLecturer) {
        const ideacreate: IdeaCreateCommand = {
          ...values,
          mentorId: undefined,
        };

        const res = await ideaService.createIdeaByLecturer(ideacreate);
        if (res.status == 1) {
          toast.success(res.message);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          setShowPageIsIdea(true);
        }
        return;
      }

      toast.error("You have not access for create Idea");
    } catch (e: any) {
      toast.error(e.toString());
    }
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    setSelectedUserId(userId); // Lưu ID
  };

  const isEnterpriseIdea = form.watch("isEnterpriseTopic");

  if (showPageIsIdea) return <PageIsIdea />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 p-4 bg-white shadow-md rounded-lg"
      >
        <div className="space-y-8 max-w-3xl mx-auto p-6 shadow-lg border rounded-xl">
          <h2 className="text-2xl font-semibold text-center">
            Create New Project
          </h2>
          <div className="space-y-4">
            {/* isEnterPrise */}
            {!isStudent && (
              <FormSwitch
                form={form}
                name="isEnterpriseTopic"
                description="Switch to enterprise idea"
                label="How Would You Classify This Project?"
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {isNotUpdateSettingYet ? (
                <div>
                  <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Profession
                  </Label>
                  <TypographyP className="text-red-600 !mt-0">
                    * Update your setting with profession and specialty
                  </TypographyP>
                </div>
              ) : (
                <>
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedProfession = professions?.find(
                          (cat) => cat.id === value
                        );
                        setSelectedProfession(selectedProfession ?? null);
                      }}
                      value={
                        selectedProfession ? selectedProfession.id : undefined
                      }
                      disabled={true}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {professions?.map((pro) => (
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
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              if (value) {
                                field.onChange(value);
                              }
                            }}
                            value={
                              field.value ??
                              form.watch("specialtyId") ??
                              undefined
                            }
                            disabled={true}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedProfession ? (
                                <>
                                  {selectedProfession?.specialties!.map(
                                    (spec) => (
                                      <SelectItem
                                        key={spec.id}
                                        value={spec.id!}
                                      >
                                        {spec.specialtyName}
                                      </SelectItem>
                                    )
                                  )}
                                </>
                              ) : null}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            {isEnterpriseIdea ? (
              <>
                <FormInput
                  form={form}
                  name="enterpriseName"
                  placeholder="What your idea enterprise?"
                  label="Enterprise title"
                />
              </>
            ) : null}

            {/* English Title */}
            <FormField
              control={form.control}
              name="englishName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Title</FormLabel>
                  <FormControl>
                    <Input placeholder="What's your idea?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Abbreviation */}
            <FormField
              control={form.control}
              name="abbreviations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abbreviation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the abbreviations for your title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vietnamese Title */}
            <FormField
              control={form.control}
              name="vietNamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vietnamese Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's your idea in Vietnamese"
                      {...field}
                    />
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* File */}
            <FormField
              control={form.control}
              name="fileschema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Upload</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TeamMember */}
            <FormField
              control={form.control}
              name="maxTeamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team size</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={"Select team size"} />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6].map((option) => (
                          <SelectItem key={option} value={option.toString()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {isStudent && (
                <FormItem>
                  <FormLabel>Mentor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const selectedUser = users?.find(
                        (cat) => cat.id === value
                      );
                      setSelectedUserId(selectedUser?.id ?? null);
                    }}
                    value={selectedUserId ? selectedUserId : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((pro) => (
                        <SelectItem key={pro.id} value={pro.id!}>
                          {pro.lastName} {pro.firstName} {", "} {pro.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            </div>

            {/* Team Members */}
            <div className="mb-4">
              <p className="text-sm font-medium">Team Members</p>
              <p className="text-gray-500 text-sm">Existed Members</p>
              {/* {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mt-2">
                <span className="text-sm">{member.email}</span>
                <span className="text-xs text-gray-500">{member.role}</span>
              </div>
            ))} */}
              <div className="flex items-center justify-between bg-gray-100 dark:bg-neutral-500 p-2 rounded-lg mt-2">
                <span className="text-sm">{user?.email}</span>
                <span className="text-xs text-gray-500">Owner</span>
              </div>
            </div>

            {/* Submit Button */}
          </div>
          <Button className="w-full">Create</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
