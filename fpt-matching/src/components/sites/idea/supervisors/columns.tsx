"use client";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import ErrorSystem from "@/components/_common/errors/error-system";
import { LoadingComponent } from "@/components/_common/loading-page";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mentoridearequestService } from "@/services/mentor-idea-request-service";
import { projectService } from "@/services/project-service";
import { MentorIdeaRequestStatus } from "@/types/enums/mentor-idea-request";
import { Idea } from "@/types/idea";
import { MentorIdeaRequestCreateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-create-command";
import { Project } from "@/types/project";
import { User } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal, Send, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CiFolderOn, CiFolderOff } from "react-icons/ci";
import { toast } from "sonner";
import { TypographyH4 } from "@/components/_common/typography/typography-h4";

export const columns: ColumnDef<Idea>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="English" />
    ),
    cell: ({ row }) => {
      const englishName = row.original.englishName ?? "Unknown"; // Tránh lỗi undefined
      const ideaId = row.original.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/idea-detail/${ideaId}`}>{englishName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "maxTeamSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Size (Required)" />
    ),
  },
  {
    accessorKey: "specialty.profession.professionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profession" />
    ),
  },
  {
    accessorKey: "specialty.specialtyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialty" />
    ),
  },
  {
    accessorKey: "mentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mentor" />
    ),
    cell: ({ row }) => {
      const mentorEmail = row.original.mentor?.email ?? "Unknown"; // Tránh lỗi undefined
      const mentorId = row.original.mentorId ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/profile-detail/${mentorId}`}>{mentorEmail}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "subMentor.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sub Mentor" />
    ),
  },
  {
    accessorKey: "isExistedTeam",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slot" />
    ),
    cell: ({ row }) => {
      const project = row.getValue("project") as Project;
      const isExistedTeam = row.getValue("isExistedTeam") as boolean;

      if (!project && !isExistedTeam) {
        return <Badge variant={"default"}>Open</Badge>;
      }
      return <Badge variant={"destructive"}>Closed</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },

  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Idea>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();
  const handleViewDetailsClick = () => {
    // router.push(`${pathName}/${model.id}`);
  };

  // if (model.isExistedTeam) return null;

  // project của user
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

  if (isLoading) return <LoadingComponent />;
  if (isError) {
    console.error("Error fetching:", error);
    return <ErrorSystem />;
  }

  // ko có thì return null ko hiển thị nút
  if (!result || !result.data)
    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"secondary"}>
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Let's create team first</p>
          </TooltipContent>
        </Tooltip>
      </>
    );

  model.mentorIdeaRequests = model.mentorIdeaRequests ?? [];
  const isSent =
    model.mentorIdeaRequests.length > 0
      ? model.mentorIdeaRequests.some((m) => m.projectId == result.data?.id)
      : false;
  const project = result.data;
  const teammembers = project.teamMembers;

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      if (!model.id) throw new Error("Idea ID is undefined");
      if (!project.id) throw new Error("Project ID is undefined");
      // if (teammembers.length != model.maxTeamSize) {
      //     toast.warning("Please add members to match the size requirement of this idea.");
      //     return;
      // }
      const command: MentorIdeaRequestCreateCommand = {
        projectId: project.id,
        ideaId: model.id,
      };
      const res = await mentoridearequestService.sendRequestIdeaByStudent(
        command
      );
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Invitation successfully`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                disabled={model.isExistedTeam ? true : isSent}
                variant={model.isExistedTeam ? "secondary" : "default"}
              >
                {isSent ? "Request Sent" : <Send />}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Request</DialogTitle>
                <DialogDescription>
                  Are you sure you want to send a request to mentor{" "}
                  <span className="font-bold">
                    {model.mentor?.email ?? "Unknown"}
                  </span>{" "}
                  for the idea{" "}
                  <span className="font-bold">"{model.englishName}"</span>?
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm text-muted-foreground">
                    Once sent, you'll need to wait for the mentor's and
                    council's approval.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline" disabled={isSending}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button onClick={handleSendRequest} disabled={isSending}>
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSent ? "Request already sent" : "Send request to mentor"}</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};
