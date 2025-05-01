"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { InvitationTeamCreatePendingCommand } from "@/types/models/commands/invitation/invitation-team-command";
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
import { Label } from "@/components/ui/label";
import { TypographyH2 } from "@/components/_common/typography/typography-h2";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";
import { Loader2 } from "lucide-react";

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
  const [enableAddToTeam, setEnableAddToTeam] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [open, setOpen] = useState(false);
  const query: UserGetAllQuery = {
    email: debouncedSearchQuery,
    pageSize: 5,
    pageNumber: 1,
    isPagination: true,
  };
  const inputRef = useRef(null);

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
        return response?.status === 1 ? response.data?.results ?? [] : [];
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    enabled: debouncedSearchQuery.length > 0,
    staleTime: 5000,
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
        englishTitle: result.data?.topic?.ideaVersion?.englishName || "",
        abbreviation: result.data?.topic?.ideaVersion?.abbreviations || "",
        vietnameseTitle: result.data?.topic?.ideaVersion?.vietNamName || "",
        description: result.data?.topic?.ideaVersion?.description || "",
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
  const isHasTopic = project?.topicId ? true : false;

  let availableSlots = 6;
  if (!isHasTopic) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.topic?.ideaVersion?.teamSize ?? 0) -
      (project?.teamMembers?.length ?? 0);
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
        toast.error("Hiện tại không thấy email này, hãy nhập lại.");
        return;
      }
      if (availableSlots === 0) {
        toast.error("Nhóm hiện tại đã đủ thành viên");
        return;
      }

      try {
        const receiver = await userService.getByEmail(emailToInvite);

        if (receiver.status === 1 && receiver.data) {
          const idReceiver = receiver.data.id;
          const prj = await projectService.getProjectInfo();

          const invitation: InvitationTeamCreatePendingCommand = {
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
        <div className="">
         

          {/* Team Members */}
          <div className="mb-4 mt-4">
            <Label>
              Những thành viên hiện tại
              <Badge variant={"secondary"}>{sortedMembers?.length}</Badge>
            </Label>
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
              <Label>Tìm bằng email</Label>
              <FormControl>
                <div className="flex flex-col space-y-2">
                  <Popover open={open} >
                    <PopoverTrigger asChild>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Tìm email ví dụ: example@fpt.edu.vn"
                            value={email}
                            onChange={(e) => {
                              setEmailInvite(e.target.value);
                              setSearchQuery(e.target.value);
                              if (e.target.value.length > 0) {
                                setOpen(true);
                              }
                              setEnableAddToTeam(false);
                            }}
                            autoComplete="off"
                            className="w-full"
                            onClick={() => setOpen(true)}
                            // onMouseLeave={() => setOpen(false)} // Mở popover khi click vào input
                            // onCli
                          />
                          {isSearching && (
                            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleInvite(email)}
                          disabled={!enableAddToTeam}
                        >
                          Thêm vào nhóm
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      onInteractOutside={(e) => {
                        // Ngăn không cho đóng khi click bên ngoài
                        e.preventDefault();
                      }}
                    >
                      <Command shouldFilter={false}>
                        <CommandList>
                          <CommandEmpty>
                            {isSearching
                              ? "Đang tìm kiếm..."
                              : "Không tìm thấy kết quả"}
                          </CommandEmpty>
                          <CommandGroup>
                            {matchingUsers.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.email ?? ""}
                                onSelect={() => {
                                  setEmailInvite(user.email ?? "");
                                  setSearchQuery("");
                                  setOpen(false);
                                  setEnableAddToTeam(true);
                                }}
                                className="cursor-pointer"
                              >
                                {user.email}
                              </CommandItem>
                            ))}
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
          {/* <Button type="submit" className="mt-8 text-center">
            Update Idea
          </Button> */}
        </div>
      </form>
    </Form>
  );
};

export default UpdateProjectTeam;
