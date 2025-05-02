"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { invitationService } from "@/services/invitation-service";
import { projectService } from "@/services/project-service";
import { userService } from "@/services/user-service";
import { TeamMemberRole } from "@/types/enums/team-member";
import { TeamInvitationCommand } from "@/types/models/commands/invitation/invitation-team-command";
import { UserGetAllQuery } from "@/types/models/queries/users/user-get-all-query";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const InviteUsersForm = () => {
  const [email, setEmailInvite] = useState<string>("");
  const [MessageInvite, setMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [enableAddToTeam, setEnableAddToTeam] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [open, setOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const query: UserGetAllQuery = {
    email: debouncedSearchQuery,
    pageSize: 5,
    pageNumber: 1,
    isPagination: true,
  };

  const { data: matchingUsers = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery) return [];

      try {
        const response = await userService.getStudentsNoTeam(query);
        return response?.status === 1 ? response.data?.results ?? [] : [];
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
        return [];
      }
    },
    enabled: debouncedSearchQuery.length > 0,
    refetchOnWindowFocus: false,
    staleTime: 5000,
  });

  const { data: result, refetch } = useQuery({
    queryKey: ["getTeamInfo"],
    queryFn: projectService.getProjectInfo,
    refetchOnWindowFocus: false,
  });

  const {
    data: currentSemesterTeam,
    isLoading: isLoadingCurrentSemester,
    isError: isErrorCurrentSemester,
  } = useQuery({
    queryKey: ["getTeamInfoCurrentSemester"],
    queryFn: () => projectService.getProjectInSemesterCurrentInfo(),
    refetchOnWindowFocus: false,
  });

  const project = currentSemesterTeam?.data ?? result?.data;
  if (!project) return null;

  const sortedMembers = project?.teamMembers
    ?.slice()
    .sort((a, b) =>
      a.role === TeamMemberRole.Leader
        ? -1
        : b.role === TeamMemberRole.Leader
        ? 1
        : 0
    );

  const isHasTopic = !!project?.topicId;

  let availableSlots = 6;
  if (!isHasTopic) {
    availableSlots = availableSlots - (project?.teamMembers?.length ?? 0);
  } else {
    availableSlots =
      (project?.topic?.ideaVersion?.teamSize ?? 0) -
      (project?.teamMembers?.length ?? 0);
  }

  const handleInvite = useCallback(
    async (emailToInvite: string) => {
      if (!emailToInvite) {
        toast.error("Vui lòng nhập email người dùng để mời");
        return;
      }
      if (availableSlots === 0) {
        toast.error("Nhóm hiện đã đủ thành viên");
        return;
      }

      setIsInviting(true);
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

          const res = await invitationService.sendByTeam(invitation);
          if (res.status == 1) {
            toast.success("Gửi lời mời thành công!");
            setEmailInvite("");
            setMessage("");
            setEnableAddToTeam(false);
          } else {
            toast.error(res.message || "Gửi lời mời thất bại");
            setMessage(res?.message ?? "");
          }
        } else {
          toast.warning("Người dùng không tồn tại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi gửi lời mời");
        console.error("Lỗi mời:", error);
      } finally {
        setIsInviting(false);
      }
    },
    [availableSlots]
  );

  return (
    <div className="space-y-6 overflow-visible">
      {/* Danh sách thành viên hiện tại */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label className="text-base font-medium">Thành viên hiện tại</Label>
          <Badge variant="outline" className="px-2 py-0.5">
            {sortedMembers?.length}/
            {isHasTopic ? project?.topic?.ideaVersion?.teamSize ?? 6 : 6}
          </Badge>
        </div>

        <div className="space-y-2">
          {sortedMembers?.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                  {member.user?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium">
                  {member.user?.email}
                </span>
              </div>
              <Badge
                variant={
                  member.role === TeamMemberRole.Leader
                    ? "default"
                    : "secondary"
                }
              >
                {member.role === TeamMemberRole.Leader
                  ? "Trưởng nhóm"
                  : "Thành viên"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Form mời thành viên mới */}
      <div className="space-y-2">
        <Label>Tìm bằng email</Label>
        <div className="flex flex-col space-y-2">
          <Popover open={open}>
            <PopoverTrigger asChild>
              <div className="flex space-x-2">
                <div className="relative flex-1 overflow-visible">
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
                    className="w-full overflow-visible"
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
                  disabled={!enableAddToTeam || isInviting}
                  className=""
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Mời vào nhóm
                    </>
                  )}
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
        {MessageInvite && (
          <p className="text-sm text-muted-foreground mt-1">{MessageInvite}</p>
        )}
      </div>
    </div>
  );
};

export default InviteUsersForm;
