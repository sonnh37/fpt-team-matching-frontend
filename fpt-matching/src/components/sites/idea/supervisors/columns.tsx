"use client";

import PageNoTeam from "@/app/(client)/(dashboard)/team/page-no-team/page";
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
        return <Badge variant={"default"}>Available</Badge>;
      }
      return <Badge variant={"destructive"}>UnAvailable</Badge>;
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

  if (model.isExistedTeam) return null;

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

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      if (!model.id) throw new Error("Idea ID is undefined");
      if (!project.id) throw new Error("Project ID is undefined");
      const command: MentorIdeaRequestCreateCommand = {
        projectId: project.id,
        ideaId: model.id,
      };
      const res = await mentoridearequestService.sendRequestIdeaByStudent(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Invitation canceled successfully`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    const isRejected =
      model.mentorIdeaRequests.length > 0
        ? model.mentorIdeaRequests.some(
            (m) =>
              m.projectId == result.data?.id &&
              m.status == MentorIdeaRequestStatus.Rejected
          )
        : false;

    if (isRejected) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={handleSendRequest} variant={"default"}>
              {isSending ? (
                "Loading..."
              ) : (
                <>
                  <Send />
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Request</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    const isApproved =
      model.mentorIdeaRequests.length > 0
        ? model.mentorIdeaRequests.some(
            (m) =>
              m.projectId == result.data?.id &&
              m.status == MentorIdeaRequestStatus.Approved
          )
        : false;

    if (isApproved) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"secondary"}>
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Approved.</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"secondary"}>
              <Send />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You have sent in recently.</p>
          </TooltipContent>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleSendRequest} variant={"default"}>
            {isSending ? "Loading..." : <Send />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Request</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};
