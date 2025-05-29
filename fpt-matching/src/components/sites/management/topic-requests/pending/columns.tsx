"use client";

import { DataTableColumnHeader } from "@/components/_common/data-table-api/data-table-column-header";
import TimeStageTopic from "@/components/_common/time-stage-idea";
import { TypographyP } from "@/components/_common/typography/typography-p";
import { TopicDetailForm } from "@/components/sites/topic/detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentRole } from "@/hooks/use-current-role";
import { semesterService } from "@/services/semester-service";
import { topicRequestService } from "@/services/topic-request-service";
import { topicService } from "@/services/topic-service";
import { TopicStatus } from "@/types/enums/topic";
import { TopicRequestStatus } from "@/types/enums/topic-request";
import { TopicRequestMentorOrManagerResponseCommand } from "@/types/models/commands/topic-requests/topic-request-mentor-or-manager-response-command";
import { Topic } from "@/types/topic";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Topic>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên tiếng anh" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      return topic?.englishName || "-";
    },
  },
  {
    accessorKey: "semester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kỳ" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      return topic.semester?.semesterName;
    },
  },
  {
    accessorKey: "stage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên giảng viên" />
    ),
    cell: ({ row }) => {
      const topic = row.original;
      if (!topic.topicVersions) return;
      return topic?.mentor?.email || "-";
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as TopicStatus | undefined;

      // Ánh xạ status sang tiếng Việt
      const statusText =
        status !== undefined
          ? {
              [TopicStatus.Draft]: "Bản nháp",
              [TopicStatus.StudentEditing]: "Sinh viên chỉnh sửa",
              [TopicStatus.MentorPending]: "Chờ giảng viên phản hồi",
              [TopicStatus.MentorConsider]: "Giảng viên đang yêu cầu chỉnh sửa",
              [TopicStatus.MentorApproved]: "Giảng viên đã duyệt",
              [TopicStatus.MentorRejected]: "Giảng viên đã từ chối",
              [TopicStatus.MentorSubmitted]: "Giảng viên đã nộp lên hội đồng",
              [TopicStatus.ManagerPending]: "Đang xem xét",
              [TopicStatus.ManagerApproved]: "Đã duyệt",
              [TopicStatus.ManagerRejected]: "Đã từ chối",
            }[status] || "Khác"
          : "-";

      // Xác định màu sắc (variant) cho từng trạng thái
      let badgeVariant: "secondary" | "destructive" | "default" | "outline" =
        "outline";

      switch (status) {
        case TopicStatus.Draft:
        case TopicStatus.StudentEditing:
        case TopicStatus.MentorPending:
        case TopicStatus.ManagerPending:
          badgeVariant = "secondary"; // màu trung tính, chờ xử lý
          break;

        case TopicStatus.MentorApproved:
        case TopicStatus.ManagerApproved:
          badgeVariant = "default"; // màu xanh (duyệt)
          break;

        case TopicStatus.MentorRejected:
        case TopicStatus.ManagerRejected:
          badgeVariant = "destructive"; // màu đỏ (từ chối)
          break;

        case TopicStatus.MentorConsider:
        case TopicStatus.MentorSubmitted:
          badgeVariant = "outline"; // màu nhẹ (đang xem xét, trung gian)
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
    header: "Thao tác",
    cell: ({ row }) => {
      return <Actions row={row} />;
    },
  },
];

interface ActionsProps {
  row: Row<Topic>;
}

const Actions: React.FC<ActionsProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const role = useCurrentRole();
  const topic = row.original;

  const topicRequest = topic.topicRequests.find(
    (m) => m.role === "Manager" && m.status === TopicRequestStatus.Pending
  );

  if (!topicRequest) {
    return <div className="text-sm">Không có yêu cầu nào</div>;
  }

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      if (!topic.id) {
        toast.error("Không tìm thấy ID đề tài");
        return;
      }

      const command: TopicRequestMentorOrManagerResponseCommand = {
        id: topicRequest.id,
        status: TopicRequestStatus.Approved,
      };
      // Gọi API phê duyệt
      const res = await topicRequestService.responseByManagerOrMentor(command);

      if (res.status !== 1) {
        toast.error(res.message || "Có lỗi xảy ra khi phê duyệt");
        return;
      }

      toast.success("Đã phê duyệt đề tài thành công");
      await queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (error) {
      console.error("Lỗi khi phê duyệt đề tài:", error);
      toast.error("Có lỗi xảy ra khi phê duyệt");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      if (!topic.id) {
        toast.error("Không tìm thấy ID đề tài");
        return;
      }

      const command: TopicRequestMentorOrManagerResponseCommand = {
        id: topicRequest.id,
        status: TopicRequestStatus.Rejected,
      };
      // Gọi API phê duyệt
      const res = await topicRequestService.responseByManagerOrMentor(command);

      if (res.status !== 1) {
        toast.error(res.message || "Có lỗi xảy ra khi từ chối");
        return;
      }

      toast.success("Đã từ chối đề tài thành công");
      await queryClient.refetchQueries({ queryKey: ["data"] });
    } catch (error) {
      console.error("Lỗi khi từ chối đề tài:", error);
      toast.error("Có lỗi xảy ra khi từ chối");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (!topic.id) {
        toast.error("Topic ID is missing. Cannot delete the topic.");
        return;
      }
      const res = await topicService.deletePermanent(topic.id);
      if (res.status != 1) {
        toast.error(res.message);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(res.message);
      await queryClient.refetchQueries({ queryKey: ["data"] });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting topic:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {/* Nút Đồng ý */}
        <Button
          variant="default"
          size="sm"
          onClick={handleApprove}
          disabled={isApproving}
        >
          {isApproving ? "Đang xử lý..." : "Đồng ý"}
        </Button>

        {/* Nút Từ chối */}
        <Button
          variant="destructive"
          size="sm"
          onClick={handleReject}
          disabled={isRejecting}
        >
          {isRejecting ? "Đang xử lý..." : "Từ chối"}
        </Button>
      </div>

      {/* Dialog xóa (giữ nguyên từ code cũ) */}
      
    </div>
  );
};
