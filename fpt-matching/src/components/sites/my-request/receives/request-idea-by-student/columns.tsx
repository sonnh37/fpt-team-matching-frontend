"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { mentortopicrequestService } from "@/services/mentor-idea-request-service";
import { InvitationStatus } from "@/types/enums/invitation";
import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { Invitation } from "@/types/invitation";
import { MentorTopicRequest } from "@/types/mentor-topic-request";
import { MentorTopicRequestUpdateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-update-command";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export const columns: ColumnDef<MentorTopicRequest>[] = [
  {
    accessorKey: "project.teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      const teamName = row.original.project?.teamName ?? "Unknown"; // Tránh lỗi undefined
      const projectId = row.original.project?.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/team-detail/${projectId}`}>{teamName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "topic.topicCode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status as MentorTopicRequestStatus;
      const statusText = MentorTopicRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case MentorTopicRequestStatus.Pending:
          badgeVariant = "secondary";
          break;
        case MentorTopicRequestStatus.Approved:
          badgeVariant = "default";
          break;
        case MentorTopicRequestStatus.Rejected:
          badgeVariant = "destructive";
          break;
        default:
          badgeVariant = "outline";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const model = row.original;

      return (
        <>
          {model.status === MentorTopicRequestStatus.Pending && (
            <Actions row={row} />
          )}
        </>
      );
    },
  },
];

interface ActionsProps {
  row: Row<MentorTopicRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    try {
      // Gọi API cancelInvite
      const command: MentorTopicRequestUpdateCommand = {
        id: model.id,
        status: MentorTopicRequestStatus.Rejected,
        projectId: model.projectId,
        ideaId: model.topic?.ideaVersion?.ideaId,
      };
      const res = await mentortopicrequestService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Canceled`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleApprove = async () => {
    try {
      // Gọi API approveInvite
      const command: MentorTopicRequestUpdateCommand = {
        id: model.id,
        status: MentorTopicRequestStatus.Approved,
        projectId: model.projectId,
        ideaId: model.topic?.ideaVersion?.ideaId,
      };
      const res = await mentortopicrequestService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Approved`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <>
      <div className="isolate flex -space-x-px">
        <Button className="rounded-r-none focus:z-10" onClick={handleApprove}>
          Accept
        </Button>
        <Button
          variant="outline"
          className="rounded-l-none focus:z-10"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};
