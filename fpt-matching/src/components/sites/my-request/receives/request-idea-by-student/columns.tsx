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
import { mentoridearequestService } from "@/services/mentor-idea-request-service";
import { InvitationStatus } from "@/types/enums/invitation";
import { MentorIdeaRequestStatus } from "@/types/enums/mentor-idea-request";
import { Invitation } from "@/types/invitation";
import { MentorIdeaRequest } from "@/types/mentor-idea-request";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const columns: ColumnDef<MentorIdeaRequest>[] = [
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
    accessorKey: "idea.englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Idea" />
    ),
    cell: ({ row }) => {
      const englishName = row.original.idea?.englishName ?? "Unknown"; // Tránh lỗi undefined
      const ideaId = row.original.idea?.id ?? "#";

      return (
        <Button variant="link" className="p-0 m-0" asChild>
          <Link href={`/idea-detail/${ideaId}`}>{englishName}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as MentorIdeaRequestStatus;
      const statusText = MentorIdeaRequestStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case MentorIdeaRequestStatus.Pending:
          badgeVariant = "secondary";
          break;
        case MentorIdeaRequestStatus.Approved:
          badgeVariant = "default";
          break;
        case MentorIdeaRequestStatus.Rejected:
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
    accessorKey: "createdDate",
    header: ({ column }) => null,
    cell: ({ row }) => null,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const model = row.original;

      return (
        <>
          {model.status === MentorIdeaRequestStatus.Pending && <Actions row={row} />}
        </>
      );
    },
  },
];

interface ActionsProps {
  row: Row<MentorIdeaRequest>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const model = row.original;
  const router = useRouter();
  const pathName = usePathname();
  const queryClient = useQueryClient();

  const handleCancel = async () => {
    // try {
    //   // Gọi API cancelInvite
    // //   if (!model.projectId) throw new Error("Project ID is undefined");
    // //   const res = await invitationService.cancelInvite_(model.projectId);
    // //   if (res.status != 1) {
    // //     toast.error(res.message);
    // //     return;
    // //   }

    // //   toast.success(`Invitation canceled successfully`);
    // //   queryClient.invalidateQueries({ queryKey: ["data"] });
    // // } catch (error) {
    // //   toast.error(error as string);
    // }
  };

  const handleApprove = async () => {
    // try {
    //   // Gọi API approveInvite
    // //   if (!model.projectId) throw new Error("Project ID is undefined");
    // //   const res = await mentoridearequestService.approveInvite(model.projectId);
    // //   if (res.status != 1) {
    // //     toast.error(res.message);
    // //     return;
    // //   }

    // //   toast.success(`Invitation approved successfully`);
    // //   queryClient.invalidateQueries({ queryKey: ["data"] });
    // // } catch (error) {
    // //   toast.error(error as string);
    // }
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
