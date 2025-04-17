"use client";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
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
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { BusinessResult } from "@/types/models/responses/business-result";
import { User } from "@/types/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const formSchema = z.object({
  englishTitle: z
    .string()
    .min(2, { message: "English Title must be at least 2 characters." }),
  abbreviation: z
    .string()
    .max(20, { message: "Abbreviation must be less than 20 characters." }),
  vietnameseTitle: z
    .string()
    .min(2, { message: "Vietnamese Title must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
});

const UpdateProjectTeam = () => {
  const [email, setEmailInvite] = useState<string>("");
  const [MessageInvite, setMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [open, setOpen] = useState(false);
  const query: UserGetAllQuery = {
    email: debouncedSearchQuery,
    pageSize: 5,
    pageNumber: 1,
    isPagination: true,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      englishTitle: "",
      abbreviation: "",
      vietnameseTitle: "",
      description: "",
    },
  });

  const { data: matchingUsers = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) return [];

      try {
        const response = await userService.getAll(query);
        // Kiểm tra nhiều cấp độ để đảm bảo không bị lỗi
        return response?.status === 1 ? response.data?.results ?? [] : [];
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    enabled: debouncedSearchQuery.length > 0,
  });

  console.log("checking", matchingUsers);

  //goi api bang tanstack
  const { data: result, refetch } = useQuery({
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
    .sort((a, b) =>
      a.role === TeamMemberRole.Leader
        ? -1
        : b.role === TeamMemberRole.Leader
        ? 1
        : 0
    );

  const project = result?.data;
  const IsExistedIdea = project?.idea ? true : false;

  let availableSlots = 6;
  if (!IsExistedIdea) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.idea?.maxTeamSize ?? 0) - (project?.teamMembers.length ?? 0);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const haha: IdeaUpdateCommand = {
      englishName: values?.englishTitle,
      abbreviations: values?.abbreviation,
      vietNamName: values?.vietnameseTitle,
      description: values?.description,
    };

    const result = await ideaService.update(haha);
    if (result?.status === 1) {
      toast("Bạn đã chỉnh sửa thành công");
    }
    console.log("test", result);
  }

  // Team mời thành viên
  const handleInvite = useCallback(
    async (emailToInvite: string) => {
      if (!emailToInvite) {
        toast.error("Please enter a user email to invite");
        return;
      }
      if (availableSlots === 0) {
        toast.error("The team currently has enough members");
        return;
      }

      try {
        const receiver = await userService.getByEmail(emailToInvite);

        if (receiver.status === 1 && receiver.data) {
          const idReceiver = receiver.data.id;
          const prj = await projectService.getProjectInfo();

          const invitation: TeamInvitationCommand = {
            receiverId: idReceiver,
            projectId: prj.data?.id ?? "",
            content: "Muốn mời bạn vào nhóm!",
          };

          const result = await invitationService.sendByTeam(invitation);
          if (result.status == 1) {
            toast.success("Chúc mừng bạn đã gửi lời mời thành công");
            setEmailInvite("");
            setMessage("");
          } else {
            toast.error(result.message || "Failed to send invitation");
            setMessage(result?.message ?? "");
          }
        } else {
          toast("Nguời dùng không tồn tại");
        }
      } catch (error) {
        toast.error("An error occurred while sending the invitation");
        console.error("Invitation error:", error);
      }
    },
    [availableSlots]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Group Detail
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium">Profession *</p>
              <p className="text-gray-700 dark:text-primary-foreground">
                {result?.data?.idea?.specialty?.profession?.professionName} (K15
                trở đi)
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Specialty *</p>
              <p className="text-gray-700 dark:text-primary-foreground">
                {result?.data?.idea?.specialty?.specialtyName}
              </p>
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
                  <Input placeholder="What's your idea? " {...field} />
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
            name="vietnameseTitle"
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
              <FormItem className="h-40 mb-16">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="h-full"
                    placeholder="Describe your project"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Team Members */}
          <div className="mb-4 mt-4">
            <p className="text-sm font-medium">
              Team Members{" "}
              <Badge variant={"secondary"}>{sortedMembers?.length}</Badge>
            </p>
            <p className="text-gray-500 dark:text-primary-foreground text-sm">
              Existed Members
            </p>
            {sortedMembers?.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 dark:bg-slate-900 p-2 rounded-lg mt-2"
              >
                <span className="text-sm">{member.user?.email}</span>
                {member.role === TeamMemberRole.Leader ? (
                  <span className="text-sm text-gray-500 dark:text-primary-foreground">
                    {TeamMemberRole[member.role ?? 0]} | Owner
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-primary-foreground">
                    {TeamMemberRole[member.role ?? 0]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <FormItem>
              <label className="text-sm font-medium">Invite Email</label>
              <p className="text-gray-500 text-xs mb-2">
                Start typing to search for matching users. You can only invite
                students whose specialties are allowed to work on the same
                thesis topic.
              </p>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="example@fpt.edu.vn"
                          value={email}
                          onChange={(e) => {
                            setEmailInvite(e.target.value);
                            setSearchQuery(e.target.value); // Đồng bộ giá trị tìm kiếm
                            if (e.target.value.length > 0) setOpen(true);
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => handleInvite(email)}
                          disabled={isSearching}
                        >
                          Invite
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0 py-2"
                      // align="start" // Căn chỉnh theo cạnh trigger
                      side="top" // Luôn hiển thị phía trên
                      sideOffset={8} // Khoảng cách với trigger
                      avoidCollisions={true} // Tránh va chạm với các phần tử khác
                      collisionPadding={0}
                    >
                      <Command shouldFilter={false}>
                        {" "}
                        {/* Tắt filter mặc định */}
                        <CommandInput
                          className="focus-visible:ring-0"
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                          placeholder="Search users..."
                        />
                        <CommandList>
                          <CommandEmpty>No users found</CommandEmpty>
                          <CommandGroup>
                            {matchingUsers?.length > 0 ? (
                              matchingUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={user.email}
                                  onSelect={() => {
                                    setEmailInvite(user.email ?? "");
                                    setOpen(false);
                                  }}
                                >
                                  {user.email}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem disabled>
                                Start typing to search
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              {MessageInvite && (
                <p className="text-sm text-muted-foreground mt-1">
                  {MessageInvite}
                </p>
              )}
            </FormItem>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="mt-8 text-center">
            Update Idea
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateProjectTeam;
