"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { mentortopicrequestService } from "@/services/mentor-topic-request-service";
import { MentorTopicRequestStatus } from "@/types/enums/mentor-idea-request";
import { MentorTopicRequest } from "@/types/mentor-topic-request";
import { MentorTopicRequestUpdateCommand } from "@/types/models/commands/mentor-idea-requests/mentor-idea-request-update-command";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export const columns: ColumnDef<MentorTopicRequest>[] = [
  {
    accessorKey: "project.teamName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nhóm" />
    ),
    cell: ({ row }) => {
      const teamName = row.original.project?.teamName ?? "-"; // Tránh lỗi undefined
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
      <DataTableColumnHeader column={column} title="Mã đề tài" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.original.status as MentorTopicRequestStatus;

      // Map status to Vietnamese text
      const statusText =
        {
          [MentorTopicRequestStatus.Pending]: "Chờ phê duyệt",
          [MentorTopicRequestStatus.Approved]: "Đã chấp nhận",
          [MentorTopicRequestStatus.Rejected]: "Đã từ chối",
          // Add other statuses if needed
        }[status] || "Khác";

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case MentorTopicRequestStatus.Pending:
          badgeVariant = "secondary"; // Neutral color for pending state
          break;
        case MentorTopicRequestStatus.Approved:
          badgeVariant = "default"; // Positive color for approved
          break;
        case MentorTopicRequestStatus.Rejected:
          badgeVariant = "destructive"; // Negative color for rejected
          break;
        default:
          badgeVariant = "outline"; // Outline for unknown states
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Thao tác",
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
        topicId: model.topicId,
      };
      const res = await mentortopicrequestService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Đã từ chối`);
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
        topicId: model.topicId,
      };
      const res = await mentortopicrequestService.update(command);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      toast.success(`Đã đồng ý`);
      queryClient.invalidateQueries({ queryKey: ["data"] });
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <>
      <div className="isolate flex -space-x-px">
        <Button className="rounded-r-none focus:z-10" onClick={handleApprove}>
          Đồng ý
        </Button>
        <Button
          variant="outline"
          className="rounded-l-none focus:z-10"
          onClick={handleCancel}
        >
          Từ chối
        </Button>
      </div>
    </>
  );
};
